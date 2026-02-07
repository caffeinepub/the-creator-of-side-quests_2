import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import OutCall "http-outcalls/outcall";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Runtime "mo:core/Runtime";

actor {
  include MixinStorage();

  // Add authentication
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Admin shared code system
  let ADMIN_SHARED_CODE = "A7F9K2M8Q4R6T1Z5X3LJH9C8";
  let MAX_ATTEMPTS = 3;
  let LOCKOUT_DURATION_NS : Int = 300_000_000_000; // 5 minutes in nanoseconds
  let SHARED_CODE_SESSION_DURATION_NS : Int = 900_000_000_000; // 15 minutes in nanoseconds

  public type AdminCodeAttempt = {
    attemptCount : Nat;
    lastAttempt : Time.Time;
    lockedUntil : ?Time.Time;
    sharedCodeSession : ?Time.Time;
  };

  let adminCodeAttempts = Map.empty<Principal, AdminCodeAttempt>();

  // Helper function to check if caller has valid admin shared code session
  func requireAdminSharedCodeSession(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin permission required");
    };

    switch (adminCodeAttempts.get(caller)) {
      case (?attempt) {
        switch (attempt.sharedCodeSession) {
          case (?expiry) {
            if (Time.now() > expiry) {
              Runtime.trap("Unauthorized: Admin shared code session expired. Please re-enter the shared code.");
            };
          };
          case (null) {
            Runtime.trap("Unauthorized: Admin shared code verification required. Please enter the shared code.");
          };
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: Admin shared code verification required. Please enter the shared code.");
      };
    };
  };

  public shared ({ caller }) func verifyAdminSharedCode(code : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin permission required");
    };

    if (code != ADMIN_SHARED_CODE) {
      Runtime.trap("Incorrect admin shared code");
    };

    let now = Time.now();
    let sessionExpiry = now + SHARED_CODE_SESSION_DURATION_NS;

    let attempt : AdminCodeAttempt = {
      attemptCount = 0;
      lastAttempt = now;
      lockedUntil = null;
      sharedCodeSession = ?sessionExpiry;
    };

    adminCodeAttempts.add(caller, attempt);
    true;
  };

  public shared ({ caller }) func retryVerifyAdminSharedCode(code : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin permission required");
    };

    switch (adminCodeAttempts.get(caller)) {
      case (?attempt) {
        let now = Time.now();
        let attempts = attempt.attemptCount;
        let lockedUntil = attempt.lockedUntil;

        switch (lockedUntil) {
          case (?lockTime) {
            if (now < lockTime) {
              Runtime.trap("This account is currently locked out due to too many unsuccessful attempts. Please try again later.");
            };
          };
          case (null) {};
        };

        if (attempts >= MAX_ATTEMPTS) {
          let newAttempt = {
            attempt with
            attemptCount = attempts + 1;
            lastAttempt = now;
            lockedUntil = ?(now + LOCKOUT_DURATION_NS);
          };
          adminCodeAttempts.add(caller, newAttempt);
          Runtime.trap("Too many attempts. This account is temporarily locked out for 5 minutes.");
        };

        if (code != ADMIN_SHARED_CODE) {
          let newAttempt = {
            attempt with
            attemptCount = attempts + 1;
            lastAttempt = now;
          };
          adminCodeAttempts.add(caller, newAttempt);
          Runtime.trap("Incorrect admin shared code. Attempt " # Nat.toText(attempts + 1) # "/" # Nat.toText(MAX_ATTEMPTS));
        };

        let sessionExpiry = now + SHARED_CODE_SESSION_DURATION_NS;
        let successAttempt = {
          attempt with
          attemptCount = 0;
          lastAttempt = now;
          sharedCodeSession = ?sessionExpiry;
        };
        adminCodeAttempts.add(caller, successAttempt);
        true;
      };
      case (null) {
        if (code != ADMIN_SHARED_CODE) {
          let firstAttempt : AdminCodeAttempt = {
            attemptCount = 1;
            lastAttempt = Time.now();
            lockedUntil = null;
            sharedCodeSession = null;
          };
          adminCodeAttempts.add(caller, firstAttempt);
          Runtime.trap("Incorrect admin shared code. Attempt 1/" # Nat.toText(MAX_ATTEMPTS));
        } else {
          let now = Time.now();
          let sessionExpiry = now + SHARED_CODE_SESSION_DURATION_NS;
          let successAttempt : AdminCodeAttempt = {
            attemptCount = 0;
            lastAttempt = now;
            lockedUntil = null;
            sharedCodeSession = ?sessionExpiry;
          };
          adminCodeAttempts.add(caller, successAttempt);
          true;
        };
      };
    };
  };

  public query ({ caller }) func hasValidAdminSharedCode() : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return false;
    };

    switch (adminCodeAttempts.get(caller)) {
      case (?attempt) {
        switch (attempt.sharedCodeSession) {
          case (?expiry) {
            Time.now() <= expiry;
          };
          case (null) { false };
        };
      };
      case (null) { false };
    };
  };

  // User Profile (required by instructions)
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

  // Admin Access Management
  public shared ({ caller }) func grantAdminAccess(user : Principal) : async () {
    requireAdminSharedCodeSession(caller);
    AccessControl.assignRole(accessControlState, caller, user, #admin);
  };

  public shared ({ caller }) func revokeAdminAccess(user : Principal) : async () {
    requireAdminSharedCodeSession(caller);
    AccessControl.assignRole(accessControlState, caller, user, #user);
  };

  public query ({ caller }) func listAdminUsers() : async [Principal] {
    requireAdminSharedCodeSession(caller);
    [];
  };

  // Social media links
  public type SocialMediaLink = {
    platform : Text;
    url : Text;
  };

  let socialMediaLinks = Map.empty<Text, SocialMediaLink>();

  public shared ({ caller }) func addSocialMediaLink(platform : Text, url : Text) : async () {
    requireAdminSharedCodeSession(caller);
    socialMediaLinks.add(platform, {
      platform;
      url;
    });
  };

  public shared ({ caller }) func updateSocialMediaLink(platform : Text, url : Text) : async () {
    requireAdminSharedCodeSession(caller);
    socialMediaLinks.add(platform, {
      platform;
      url;
    });
  };

  public shared ({ caller }) func deleteSocialMediaLink(platform : Text) : async () {
    requireAdminSharedCodeSession(caller);
    socialMediaLinks.remove(platform);
  };

  public query func getSocialMediaLinks() : async [SocialMediaLink] {
    socialMediaLinks.values().toArray();
  };

  // Portfolio management
  public type PortfolioItem = {
    id : Text;
    title : Text;
    image : Storage.ExternalBlob;
    description : Text;
    category : ?Text;
  };

  let portfolioItems = Map.empty<Text, PortfolioItem>();

  public shared ({ caller }) func addPortfolioItem(item : PortfolioItem) : async () {
    requireAdminSharedCodeSession(caller);
    portfolioItems.add(item.id, item);
  };

  public shared ({ caller }) func updatePortfolioItem(item : PortfolioItem) : async () {
    requireAdminSharedCodeSession(caller);
    portfolioItems.add(item.id, item);
  };

  public shared ({ caller }) func deletePortfolioItem(id : Text) : async () {
    requireAdminSharedCodeSession(caller);
    portfolioItems.remove(id);
  };

  public query func getPortfolioItems() : async [PortfolioItem] {
    portfolioItems.values().toArray();
  };

  public query func getPortfolioItem(id : Text) : async ?PortfolioItem {
    portfolioItems.get(id);
  };

  // Testimonials management
  public type Testimonial = {
    id : Text;
    author : Text;
    content : Text;
    rating : Nat;
    createdAt : Time.Time;
  };

  let testimonials = Map.empty<Text, Testimonial>();

  public shared ({ caller }) func addTestimonial(testimonial : Testimonial) : async () {
    requireAdminSharedCodeSession(caller);
    testimonials.add(testimonial.id, testimonial);
  };

  public shared ({ caller }) func updateTestimonial(testimonial : Testimonial) : async () {
    requireAdminSharedCodeSession(caller);
    testimonials.add(testimonial.id, testimonial);
  };

  public shared ({ caller }) func deleteTestimonial(id : Text) : async () {
    requireAdminSharedCodeSession(caller);
    testimonials.remove(id);
  };

  public query func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  public query func getTestimonial(id : Text) : async ?Testimonial {
    testimonials.get(id);
  };

  // Fulfillment options
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
    requireAdminSharedCodeSession(caller);
    fulfillmentOptions := options;
  };

  public query func getFulfillmentOptions() : async FulfillmentOptions {
    fulfillmentOptions;
  };

  // Policies management
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
    requireAdminSharedCodeSession(caller);
    policies := newPolicies;
  };

  public query func getPolicies() : async Policies {
    policies;
  };

  // Products management
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    inStock : Bool;
    image : Storage.ExternalBlob;
    requiresQuote : Bool;
    category : ?Text;
  };

  let products = Map.empty<Text, Product>();

  public shared ({ caller }) func addProduct(product : Product) : async () {
    requireAdminSharedCodeSession(caller);
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    requireAdminSharedCodeSession(caller);
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    requireAdminSharedCodeSession(caller);
    products.remove(id);
  };

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProduct(id : Text) : async ?Product {
    products.get(id);
  };

  // Contact/Quote request system
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
    status : Text; // "pending", "reviewed", "responded"
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

  public query ({ caller }) func getContactRequests() : async [ContactRequest] {
    requireAdminSharedCodeSession(caller);
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
    requireAdminSharedCodeSession(caller);
    switch (contactRequests.get(id)) {
      case (null) { Runtime.trap("Contact request not found") };
      case (?request) {
        contactRequests.add(id, { request with status });
      };
    };
  };

  // Coupon system
  public type CouponType = {
    #percentage : Nat; // 0-100
    #fixed : Nat; // fixed amount in cents
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
    requireAdminSharedCodeSession(caller);
    coupons.add(coupon.code, coupon);
  };

  public shared ({ caller }) func updateCoupon(coupon : Coupon) : async () {
    requireAdminSharedCodeSession(caller);
    coupons.add(coupon.code, coupon);
  };

  public shared ({ caller }) func deleteCoupon(code : Text) : async () {
    requireAdminSharedCodeSession(caller);
    coupons.remove(code);
  };

  public query ({ caller }) func getCoupons() : async [Coupon] {
    requireAdminSharedCodeSession(caller);
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

  // Loyalty points system
  public type LoyaltyAction = {
    #purchase : Nat; // amount in cents
    #signup;
    #visit;
    #share;
  };

  public type LoyaltyReward = {
    id : Text;
    name : Text;
    pointsRequired : Nat;
    rewardType : Text; // "coupon", "discount", "free_gift", "free_item"
    rewardValue : Text;
    active : Bool;
  };

  let loyaltyRewards = Map.empty<Text, LoyaltyReward>();
  let userLoyaltyPoints = Map.empty<Principal, Nat>();

  public shared ({ caller }) func addLoyaltyPoints(action : LoyaltyAction) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can earn loyalty points");
    };
    let pointsToAdd = switch (action) {
      case (#purchase(amount)) { amount / 100 };
      case (#signup) { 100 };
      case (#visit) { 10 };
      case (#share) { 50 };
    };
    let currentPoints = switch (userLoyaltyPoints.get(caller)) {
      case (null) { 0 };
      case (?points) { points };
    };
    let newPoints = currentPoints + pointsToAdd;
    userLoyaltyPoints.add(caller, newPoints);

    // Update user profile
    switch (userProfiles.get(caller)) {
      case (null) {};
      case (?profile) {
        userProfiles.add(caller, { profile with loyaltyPoints = newPoints });
      };
    };

    newPoints;
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
    requireAdminSharedCodeSession(caller);
    loyaltyRewards.add(reward.id, reward);
  };

  public shared ({ caller }) func updateLoyaltyReward(reward : LoyaltyReward) : async () {
    requireAdminSharedCodeSession(caller);
    loyaltyRewards.add(reward.id, reward);
  };

  public shared ({ caller }) func deleteLoyaltyReward(id : Text) : async () {
    requireAdminSharedCodeSession(caller);
    loyaltyRewards.remove(id);
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

          // Update user profile
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

  // Giveaway system
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
    requireAdminSharedCodeSession(caller);
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
    requireAdminSharedCodeSession(caller);
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
    requireAdminSharedCodeSession(caller);
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

  public query ({ caller }) func getGiveaway(id : Text) : async ?Giveaway {
    requireAdminSharedCodeSession(caller);
    giveaways.get(id);
  };

  public query func getActiveGiveaways() : async [Giveaway] {
    giveaways.values().filter(func(g : Giveaway) : Bool { g.active }).toArray();
  };

  public shared ({ caller }) func updateGiveaway(giveaway : Giveaway) : async () {
    requireAdminSharedCodeSession(caller);
    giveaways.add(giveaway.id, giveaway);
  };

  public shared ({ caller }) func deleteGiveaway(id : Text) : async () {
    requireAdminSharedCodeSession(caller);
    giveaways.remove(id);
  };

  // Stripe integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    requireAdminSharedCodeSession(caller);
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

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public shared ({ caller }) func recordPurchase(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can record purchases");
    };
    ignore await addLoyaltyPoints(#purchase(amount));
  };
};
