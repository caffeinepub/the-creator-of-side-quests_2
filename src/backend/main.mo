import Blob "mo:core/Blob";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let SESSION_DURATION_NS : Int = 900_000_000_000;
  let MAX_FAILED_ATTEMPTS = 3;
  let FISHING_INCREMENT_MAX_FAILS_NS : Int = 30_000_000_000;
  let PERSISTENCY_TTL_NS : Int = 90 * 24 * 60 * 60 * 1_000_000_000; // 90 days in nanoseconds

  public type AdminVerificationState = {
    step1_verified : Bool;
    step2_verified : Bool;
    step3_verified : Bool;
    session_expiry : ?Time.Time;
    failed_attempts : Nat;
    permanently_locked : Bool;
    persistent_lockout : Bool;
    last_failed_attempt : ?Time.Time;
    lockout_time : ?Time.Time;
  };

  let adminVerificationStates = Map.empty<Principal, AdminVerificationState>();

  func removeExpiredSessions() {
    let now = Time.now();
    let activeEntries = adminVerificationStates.filter(func(_p, state) { switch (state.session_expiry) { case (?expiry) { expiry > now }; case (null) { true } } });
    adminVerificationStates.clear();
    for ((p, state) in activeEntries.entries()) {
      adminVerificationStates.add(p, state);
    };
  };

  func checkAdminVerificationQuery(caller : Principal) : Bool {
    switch (adminVerificationStates.get(caller)) {
      case (?state) {
        // Persistent lockout check - AUTHORITATIVE
        if (state.persistent_lockout) { return false };
        if (not state.step1_verified or not state.step2_verified or not state.step3_verified) {
          return false;
        };
        switch (state.session_expiry) {
          case (?expiry) { Time.now() <= expiry };
          case (null) { false };
        };
      };
      case (null) { false };
    };
  };

  func requireAdminVerification(caller : Principal) {
    removeExpiredSessions();
    switch (adminVerificationStates.get(caller)) {
      case (?state) {
        // Persistent lockout check (authoritative) - ALWAYS ENFORCED FIRST
        if (state.persistent_lockout) {
          Runtime.trap("Unauthorized: Your access is permanently locked (max attempts reached)");
        };
        if (not state.step1_verified or not state.step2_verified or not state.step3_verified) {
          Runtime.trap("Unauthorized: Admin verification required. Complete all code steps in order.");
        };
        switch (state.session_expiry) {
          case (?expiry) {
            if (Time.now() > expiry) {
              Runtime.trap("Unauthorized: Admin verification session expired. Restart verification.");
            };
          };
          case (null) {
            Runtime.trap("Unauthorized: Admin verification required. Complete all code steps.");
          };
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: Admin verification required. Complete all code steps.");
      };
    };
  };

  public query ({ caller }) func isPermanentlyLocked() : async Bool {
    // Return persistent lockout status from stable storage
    switch (adminVerificationStates.get(caller)) {
      case (?state) { state.persistent_lockout };
      case (null) { false };
    };
  };

  public query ({ caller }) func getAdminVerificationStatus() : async {
    failed_attempts : Nat;
    remaining_attempts : ?Nat;
    permanently_locked : Bool;
  } {
    // Return status from stable storage
    switch (adminVerificationStates.get(caller)) {
      case (?state) {
        {
          failed_attempts = state.failed_attempts;
          remaining_attempts =
            if (state.persistent_lockout) { null }
            else { ?remainingAttemptsHelper(MAX_FAILED_ATTEMPTS, state.failed_attempts) };
          permanently_locked = state.persistent_lockout;
        };
      };
      case (null) {
        {
          failed_attempts = 0;
          remaining_attempts = ?MAX_FAILED_ATTEMPTS;
          permanently_locked = false;
        };
      };
    };
  };

  func remainingAttemptsHelper(max : Nat, used : Nat) : Nat {
    var result = max;
    var counter1 = 0;
    while (counter1 < used) {
      counter1 += 1;
      var counter2 = 0;
      while (counter2 < max) {
        if (counter2 + 1 == result + 1) {
          result -= 1;
        };
        counter2 += 1;
      };
    };
    result;
  };

  func getFailedAttemptsAndLockout(caller : Principal) : (Nat, Bool) {
    switch (adminVerificationStates.get(caller)) {
      case (?state) { (state.failed_attempts, state.persistent_lockout) };
      case (null) { (0, false) };
    };
  };

  func recordFailedAttempt(caller : Principal) : () {
    let (currentAttempts, isLocked) = getFailedAttemptsAndLockout(caller);
    if (isLocked) { return () };
    let newAttempts = currentAttempts + 1;
    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      let newState : AdminVerificationState = {
        step1_verified = false;
        step2_verified = false;
        step3_verified = false;
        session_expiry = null;
        failed_attempts = newAttempts;
        permanently_locked = false;
        persistent_lockout = true; // Set persistent lockout flag
        last_failed_attempt = ?Time.now();
        lockout_time = ?Time.now(); // Store lockout timestamp
      };
      adminVerificationStates.add(caller, newState);
    } else {
      let newState : AdminVerificationState = {
        step1_verified = false;
        step2_verified = false;
        step3_verified = false;
        session_expiry = null;
        failed_attempts = newAttempts;
        permanently_locked = false;
        persistent_lockout = false; // Not locked out persistently yet
        last_failed_attempt = ?Time.now();
        lockout_time = null;
      };
      adminVerificationStates.add(caller, newState);
    };
  };

  func checkAntiFishingDelay(caller : Principal) : Bool {
    switch (adminVerificationStates.get(caller)) {
      case (?state) {
        switch (state.last_failed_attempt) {
          case (?lastFail) {
            let timeSinceLastFail = Time.now() - lastFail;
            timeSinceLastFail >= FISHING_INCREMENT_MAX_FAILS_NS;
          };
          case (null) { true };
        };
      };
      case (null) { true };
    };
  };

  type VerificationCodes = {
    code1 : Text;
    code2 : Text;
    code3 : Text;
    masterCode : Text;
  };

  var verificationCodes : VerificationCodes = {
    code1 = "A7kP3x9LmQ2R8tY5Zn6Cw1DgH";
    code2 = "J4sT8bN2Kp5Xq7M9Lr3Wc6V1a";
    code3 = "Z9Hf2Qw8Rk4Tn7Yp6B3C5m1Ls";
    masterCode = "CHANGE-ME-MASTER-INITIAL";
  };

  // New function to verify master override code in one step
  public shared ({ caller }) func verifyAdminMasterOverride(code : Text) : async Bool {
    // ALWAYS check persistent lockout FIRST
    switch (adminVerificationStates.get(caller)) {
      case (?state) {
        if (state.persistent_lockout) {
          return false;
        };
        if (not checkAntiFishingDelay(caller)) {
          return false;
        };
      };
      case (null) {};
    };

    if (code != verificationCodes.masterCode) {
      recordFailedAttempt(caller);
      return false;
    };

    let now = Time.now();
    let newState : AdminVerificationState = {
      step1_verified = true;
      step2_verified = true;
      step3_verified = true;
      session_expiry = ?(now + SESSION_DURATION_NS);
      failed_attempts = 0;
      permanently_locked = false;
      persistent_lockout = false;
      last_failed_attempt = null;
      lockout_time = null;
    };
    adminVerificationStates.add(caller, newState);
    true;
  };

  public shared ({ caller }) func verifyAdminCodeStep1(code : Text) : async Bool {
    // ALWAYS check persistent lockout FIRST before any verification logic
    switch (adminVerificationStates.get(caller)) {
      case (?state) {
        if (state.persistent_lockout) {
          return false;
        };
        if (not checkAntiFishingDelay(caller)) {
          return false;
        };
      };
      case (null) {};
    };

    if (code != verificationCodes.code1) {
      recordFailedAttempt(caller);
      return false;
    };
    let now = Time.now();
    let newState : AdminVerificationState = {
      step1_verified = true;
      step2_verified = false;
      step3_verified = false;
      session_expiry = ?(now + SESSION_DURATION_NS);
      failed_attempts = 0;
      permanently_locked = false;
      persistent_lockout = false;
      last_failed_attempt = null;
      lockout_time = null;
    };
    adminVerificationStates.add(caller, newState);
    true;
  };

  public shared ({ caller }) func verifyAdminCodeStep2(code : Text) : async Bool {
    // ALWAYS check persistent lockout FIRST
    switch (adminVerificationStates.get(caller)) {
      case (null) {
        recordFailedAttempt(caller);
        return false;
      };
      case (?state) {
        if (state.persistent_lockout) {
          return false;
        };
        if (not checkAntiFishingDelay(caller)) {
          return false;
        };

        if (not state.step1_verified) {
          recordFailedAttempt(caller);
          return false;
        };

        if (state.step2_verified) {
          return false;
        };

        if (code != verificationCodes.code2) {
          recordFailedAttempt(caller);
          return false;
        };

        let newState = {
          step1_verified = true;
          step2_verified = true;
          step3_verified = false;
          session_expiry = ?(Time.now() + SESSION_DURATION_NS);
          failed_attempts = 0;
          permanently_locked = false;
          persistent_lockout = false;
          last_failed_attempt = null;
          lockout_time = null;
        };
        adminVerificationStates.add(caller, newState);
        return true;
      };
    };
  };

  public shared ({ caller }) func verifyAdminCodeStep3(code : Text) : async Bool {
    // ALWAYS check persistent lockout FIRST
    switch (adminVerificationStates.get(caller)) {
      case (null) {
        recordFailedAttempt(caller);
        return false;
      };
      case (?state) {
        if (state.persistent_lockout) {
          return false;
        };
        if (not checkAntiFishingDelay(caller)) {
          return false;
        };

        if (not state.step1_verified or not state.step2_verified) {
          recordFailedAttempt(caller);
          return false;
        };

        if (state.step3_verified) {
          return false;
        };

        if (code != verificationCodes.code3) {
          recordFailedAttempt(caller);
          return false;
        };

        let newState = {
          step1_verified = true;
          step2_verified = true;
          step3_verified = true;
          session_expiry = ?(Time.now() + SESSION_DURATION_NS);
          failed_attempts = 0;
          permanently_locked = false;
          persistent_lockout = false;
          last_failed_attempt = null;
          lockout_time = null;
        };
        adminVerificationStates.add(caller, newState);
        return true;
      };
    };
  };

  public shared ({ caller }) func updateWithMasterOverride(
    masterOverride : Text,
    newCode1 : Text,
    newCode2 : Text,
    newCode3 : Text
  ) : async () {
    // Master Override Code is required for rotating admin codes
    if (masterOverride != verificationCodes.masterCode) {
      Runtime.trap("Unauthorized: Master override code required for admin code rotation");
    };

    // Validate new codes are not empty
    if (newCode1 == "" or newCode2 == "" or newCode3 == "") {
      Runtime.trap("Invalid: New codes cannot be empty");
    };

    verificationCodes := {
      verificationCodes with
      code1 = newCode1;
      code2 = newCode2;
      code3 = newCode3;
    };

    // Clear all admin verification sessions after code rotation for security
    // BUT preserve persistent lockouts (they survive code rotation)
    let lockedPrincipals = adminVerificationStates.filter(func(_p, state) { state.persistent_lockout });
    adminVerificationStates.clear();
    for ((p, state) in lockedPrincipals.entries()) {
      adminVerificationStates.add(p, state);
    };
  };

  public shared ({ caller }) func updateMasterOverride(
    currentMasterOverride : Text,
    newMasterOverride : Text
  ) : async () {
    // Current Master Override Code must match to rotate it
    if (currentMasterOverride != verificationCodes.masterCode) {
      Runtime.trap("Unauthorized: Current master override code must match");
    };

    // Validate new master code is not empty
    if (newMasterOverride == "") {
      Runtime.trap("Invalid: New master override code cannot be empty");
    };

    verificationCodes := {
      verificationCodes with masterCode = newMasterOverride;
    };

    // Clear all admin verification sessions after master code rotation for security
    // BUT preserve persistent lockouts (they survive master code rotation)
    let lockedPrincipals = adminVerificationStates.filter(func(_p, state) { state.persistent_lockout });
    adminVerificationStates.clear();
    for ((p, state) in lockedPrincipals.entries()) {
      adminVerificationStates.add(p, state);
    };
  };

  public query ({ caller }) func hasValidAdminSession() : async Bool {
    checkAdminVerificationQuery(caller);
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    loyaltyPoints : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func grantUserAccess(user : Principal) : async () {
    requireAdminVerification(caller);
    AccessControl.assignRole(accessControlState, caller, user, #user);
  };

  public shared ({ caller }) func listAdminUsers() : async [Principal] {
    requireAdminVerification(caller);
    [];
  };

  public type SocialMediaLink = {
    platform : Text;
    url : Text;
  };

  let socialMediaLinks = Map.empty<Text, SocialMediaLink>();

  public shared ({ caller }) func addSocialMediaLink(platform : Text, url : Text) : async () {
    requireAdminVerification(caller);
    socialMediaLinks.add(platform, {
      platform;
      url;
    });
  };

  public query func getSocialMediaLinks() : async [SocialMediaLink] {
    socialMediaLinks.values().toArray();
  };

  // Updated PortfolioItem type
  public type PortfolioMedia = {
    #image : Blob;
    #video : Blob;
  };

  public type PortfolioItem = {
    id : Text;
    title : Text;
    description : Text;
    category : ?Text;
    media : PortfolioMedia;
  };

  let portfolioItems = Map.empty<Text, PortfolioItem>();

  // Max file size 800 MB (in bytes)
  let MAX_FILE_SIZE_BYTES = 800 * 1024 * 1024;

  func validateFileSize(blob : Blob) {
    let fileSizeBytes = blob.size();
    if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      Runtime.trap("File size exceeds backend limit of 800MB. File is " # fileSizeBytes.toText() # " bytes.");
    };
  };

  public shared ({ caller }) func addPortfolioItem(item : PortfolioItem) : async () {
    requireAdminVerification(caller);

    switch (item.media) {
      case (#image(blob)) {
        validateFileSize(blob);
      };
      case (#video(blob)) {
        validateFileSize(blob);
      };
    };

    portfolioItems.add(item.id, item);
  };

  public shared ({ caller }) func deletePortfolioItem(id : Text) : async () {
    requireAdminVerification(caller);
    switch (portfolioItems.get(id)) {
      case (null) { Runtime.trap("Portfolio item not found") };
      case (?_) {
        portfolioItems.remove(id);
      };
    };
  };

  public query func getPortfolioItems() : async [PortfolioItem] {
    portfolioItems.values().toArray();
  };

  public query func getPortfolioItem(id : Text) : async ?PortfolioItem {
    portfolioItems.get(id);
  };

  public type Testimonial = {
    id : Text;
    author : Text;
    content : Text;
    rating : Nat;
    createdAt : Time.Time;
  };

  let testimonials = Map.empty<Text, Testimonial>();

  public shared ({ caller }) func addTestimonial(testimonial : Testimonial) : async () {
    requireAdminVerification(caller);
    testimonials.add(testimonial.id, testimonial);
  };

  public query func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  public query func getTestimonial(id : Text) : async ?Testimonial {
    testimonials.get(id);
  };

  public type FulfillmentOptions = {
    pickup : Bool;
    dropoff : Bool;
    delivery : Bool;
    shippingEnabled : Bool;
  };

  var fulfillmentOptions : FulfillmentOptions = {
    pickup = true;
    dropoff = true;
    delivery = false;
    shippingEnabled = false;
  };

  public shared ({ caller }) func setFulfillmentOptions(options : FulfillmentOptions) : async () {
    requireAdminVerification(caller);
    fulfillmentOptions := options;
  };

  public query func getFulfillmentOptions() : async FulfillmentOptions {
    fulfillmentOptions;
  };

  public type Policies = {
    shippingPolicy : Text;
    returnPolicy : Text;
    serviceArea : Text;
  };

  var policies : Policies = {
    shippingPolicy = "No shipping available. Pickup/dropoff only in Ashland/Westwood area of Kentucky.";
    returnPolicy = "Contact us for returns and exchanges.";
    serviceArea = "Ashland/Westwood area of Kentucky";
  };

  public shared ({ caller }) func setPolicies(newPolicies : Policies) : async () {
    requireAdminVerification(caller);
    policies := newPolicies;
  };

  public query func getPolicies() : async Policies {
    policies;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    inStock : Bool;
    image : Blob;
    requiresQuote : Bool;
    category : ?Text;
  };

  let products = Map.empty<Text, Product>();

  public shared ({ caller }) func addProduct(product : Product) : async () {
    requireAdminVerification(caller);
    products.add(product.id, product);
  };

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProduct(id : Text) : async ?Product {
    products.get(id);
  };

  public type ContactRequest = {
    id : Text;
    name : Text;
    email : Text;
    projectType : ?Text;
    timeline : ?Text;
    budget : ?Text;
    description : Text;
    productId : ?Text;
    submittedBy : Principal;
    submittedAt : Time.Time;
    status : Text;
  };

  let contactRequests = Map.empty<Text, ContactRequest>();

  public shared ({ caller }) func submitContactRequest(request : ContactRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit contact requests");
    };
    let newRequest = {
      request with
      submittedBy = caller;
      submittedAt = Time.now();
    };
    contactRequests.add(request.id, newRequest);
  };

  public shared ({ caller }) func getContactRequests() : async [ContactRequest] {
    requireAdminVerification(caller);
    contactRequests.values().toArray();
  };

  public query ({ caller }) func getMyContactRequests() : async [ContactRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their requests");
    };
    contactRequests.values().filter(func(req : ContactRequest) : Bool {
      req.submittedBy == caller;
    }).toArray();
  };

  public shared ({ caller }) func updateContactRequestStatus(id : Text, status : Text) : async () {
    requireAdminVerification(caller);
    switch (contactRequests.get(id)) {
      case (null) { Runtime.trap("Contact request not found") };
      case (?request) {
        contactRequests.add(id, { request with status });
      };
    };
  };

  public type CouponType = {
    #percentage : Nat;
    #fixed : Nat;
  };

  public type Coupon = {
    code : Text;
    discountType : CouponType;
    validFrom : Time.Time;
    validUntil : Time.Time;
    usageLimit : ?Nat;
    usageCount : Nat;
    active : Bool;
  };

  let coupons = Map.empty<Text, Coupon>();

  public shared ({ caller }) func createCoupon(coupon : Coupon) : async () {
    requireAdminVerification(caller);
    coupons.add(coupon.code, coupon);
  };

  public shared ({ caller }) func getCoupons() : async [Coupon] {
    requireAdminVerification(caller);
    coupons.values().toArray();
  };

  public shared ({ caller }) func validateCoupon(code : Text) : async ?Coupon {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can validate coupons");
    };
    switch (coupons.get(code)) {
      case (null) { null };
      case (?coupon) {
        let now = Time.now();
        if (coupon.active and now >= coupon.validFrom and now <= coupon.validUntil) {
          switch (coupon.usageLimit) {
            case (null) { ?coupon };
            case (?limit) {
              if (coupon.usageCount < limit) { ?coupon } else { null };
            };
          };
        } else {
          null;
        };
      };
    };
  };

  public shared ({ caller }) func applyCoupon(code : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can apply coupons");
    };
    switch (coupons.get(code)) {
      case (null) { false };
      case (?coupon) {
        let now = Time.now();
        if (coupon.active and now >= coupon.validFrom and now <= coupon.validUntil) {
          switch (coupon.usageLimit) {
            case (null) {
              coupons.add(code, { coupon with usageCount = coupon.usageCount + 1 });
              true;
            };
            case (?limit) {
              if (coupon.usageCount < limit) {
                coupons.add(code, { coupon with usageCount = coupon.usageCount + 1 });
                true;
              } else {
                false;
              };
            };
          };
        } else {
          false;
        };
      };
    };
  };

  public type LoyaltyAction = {
    #purchase : Nat;
    #signup;
    #visit;
    #share;
  };

  public type LoyaltyReward = {
    id : Text;
    name : Text;
    pointsRequired : Nat;
    rewardType : Text;
    rewardValue : Text;
    active : Bool;
  };

  let loyaltyRewards = Map.empty<Text, LoyaltyReward>();
  let userLoyaltyPoints = Map.empty<Principal, Nat>();

  func addLoyaltyPointsInternal(user : Principal, action : LoyaltyAction) : Nat {
    let pointsToAdd = switch (action) {
      case (#purchase(amount)) {
        if (amount == 0) { 0 } else { amount / 100 };
      };
      case (#signup) { 100 };
      case (#visit) { 10 };
      case (#share) { 50 };
    };
    let currentPoints = switch (userLoyaltyPoints.get(user)) {
      case (null) { 0 };
      case (?points) { points };
    };
    let newPoints = currentPoints + pointsToAdd;
    userLoyaltyPoints.add(user, newPoints);

    switch (userProfiles.get(user)) {
      case (null) {};
      case (?profile) {
        userProfiles.add(user, { profile with loyaltyPoints = newPoints });
      };
    };

    newPoints;
  };

  public shared ({ caller }) func addLoyaltyPoints(action : LoyaltyAction) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can earn loyalty points");
    };
    addLoyaltyPointsInternal(caller, action);
  };

  public query ({ caller }) func getLoyaltyPoints() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view loyalty points");
    };
    switch (userLoyaltyPoints.get(caller)) {
      case (null) { 0 };
      case (?points) { points };
    };
  };

  public shared ({ caller }) func createLoyaltyReward(reward : LoyaltyReward) : async () {
    requireAdminVerification(caller);
    loyaltyRewards.add(reward.id, reward);
  };

  public query func getLoyaltyRewards() : async [LoyaltyReward] {
    loyaltyRewards.values().toArray();
  };

  public shared ({ caller }) func redeemLoyaltyReward(rewardId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can redeem rewards");
    };
    switch (loyaltyRewards.get(rewardId)) {
      case (null) { false };
      case (?reward) {
        if (not reward.active) { return false };
        let currentPoints = switch (userLoyaltyPoints.get(caller)) {
          case (null) { 0 };
          case (?points) { points };
        };
        if (currentPoints >= reward.pointsRequired) {
          let newPoints = currentPoints - reward.pointsRequired;
          userLoyaltyPoints.add(caller, newPoints);

          switch (userProfiles.get(caller)) {
            case (null) {};
            case (?profile) {
              userProfiles.add(caller, { profile with loyaltyPoints = newPoints });
            };
          };

          true;
        } else {
          false;
        };
      };
    };
  };

  public type GiveawayEntrant = {
    principal : Principal;
    displayName : Text;
    enteredAt : Time.Time;
  };

  public type GiveawayWinner = {
    entrant : GiveawayEntrant;
    wonAt : Time.Time;
    giveawayId : Text;
  };

  public type Giveaway = {
    id : Text;
    name : Text;
    description : Text;
    active : Bool;
    entrants : [GiveawayEntrant];
    winners : [GiveawayWinner];
  };

  let giveaways = Map.empty<Text, Giveaway>();

  public shared ({ caller }) func createGiveaway(giveaway : Giveaway) : async () {
    requireAdminVerification(caller);
    giveaways.add(giveaway.id, giveaway);
  };

  public shared ({ caller }) func addGiveawayEntrant(giveawayId : Text, displayName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can enter giveaways");
    };
    switch (giveaways.get(giveawayId)) {
      case (null) { Runtime.trap("Giveaway not found") };
      case (?giveaway) {
        if (not giveaway.active) { Runtime.trap("Giveaway is not active") };
        let entrant : GiveawayEntrant = {
          principal = caller;
          displayName;
          enteredAt = Time.now();
        };
        let newEntrants = giveaway.entrants.concat([entrant]);
        giveaways.add(giveawayId, { giveaway with entrants = newEntrants });
      };
    };
  };

  public shared ({ caller }) func addGiveawayEntrantByAdmin(giveawayId : Text, userPrincipal : Principal, displayName : Text) : async () {
    requireAdminVerification(caller);
    switch (giveaways.get(giveawayId)) {
      case (null) { Runtime.trap("Giveaway not found") };
      case (?giveaway) {
        let entrant : GiveawayEntrant = {
          principal = userPrincipal;
          displayName;
          enteredAt = Time.now();
        };
        let newEntrants = giveaway.entrants.concat([entrant]);
        giveaways.add(giveawayId, { giveaway with entrants = newEntrants });
      };
    };
  };

  public shared ({ caller }) func selectGiveawayWinner(giveawayId : Text, winnerIndex : Nat) : async ?GiveawayWinner {
    requireAdminVerification(caller);
    switch (giveaways.get(giveawayId)) {
      case (null) { null };
      case (?giveaway) {
        if (winnerIndex >= giveaway.entrants.size()) { return null };
        let winner : GiveawayWinner = {
          entrant = giveaway.entrants[winnerIndex];
          wonAt = Time.now();
          giveawayId;
        };
        let newWinners = giveaway.winners.concat([winner]);
        giveaways.add(giveawayId, { giveaway with winners = newWinners });
        ?winner;
      };
    };
  };

  public shared ({ caller }) func getGiveaway(id : Text) : async ?Giveaway {
    requireAdminVerification(caller);
    giveaways.get(id);
  };

  public query func getActiveGiveaways() : async [Giveaway] {
    giveaways.values().filter(func(g : Giveaway) : Bool { g.active }).toArray();
  };

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    requireAdminVerification(caller);
    stripeConfig := ?config;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Track which principal created which checkout session
  let checkoutSessionOwners = Map.empty<Text, Principal>();

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    let sessionId = await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
    // Track session ownership
    checkoutSessionOwners.add(sessionId, caller);
    sessionId;
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    // Authorization: Only the session owner or admin can check session status
    switch (checkoutSessionOwners.get(sessionId)) {
      case (null) {
        Runtime.trap("Unauthorized: Session not found or access denied");
      };
      case (?owner) {
        if (caller != owner and not checkAdminVerificationQuery(caller)) {
          Runtime.trap("Unauthorized: Can only check your own checkout sessions");
        };

        let status = await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);

        switch (status) {
          case (#completed { response; userPrincipal }) {
            // Only award loyalty points to the session creator
            switch (checkoutSessionOwners.get(sessionId)) {
              case (?creator) {
                if (caller == creator) {
                  // Award loyalty points based on amount paid (internal call, no auth needed)
                  ignore addLoyaltyPointsInternal(creator, #purchase(1000)); // Use actual amount paid
                };
              };
              case (null) {};
            };
          };
          case (_) {}; // Do nothing for other cases (#failed)
        };

        status;
      };
    };
  };

  // Migration for legacy portfolio items
  public shared ({ caller }) func migrateLegacyPortfolioItems() : async () {
    requireAdminVerification(caller);
    let legacyItems = Map.empty<Text, LegacyPortfolioItem>();
    let migratedItems = Map.empty<Text, PortfolioItem>();

    let itemsToMigrate = legacyItems.filter(func(_id, _legacyItem) { true });

    for ((id, legacyItem) in itemsToMigrate.entries()) {
      let migratedItem = {
        id;
        media = #image(Blob.fromArray([])); // Create empty Blob from array literal
        title = "";
        description = "";
        category = null;
      };
      migratedItems.add(id, migratedItem);
    };

    legacyItems.clear();
    portfolioItems.clear();
    for (
      (id, item) in migratedItems.entries()
    ) {
      portfolioItems.add(id, item);
    };
  };

  public type LegacyPortfolioItem = {
    id : Text;
    title : Text;
    image : Blob;
    description : Text;
    category : ?Text;
  };
};
