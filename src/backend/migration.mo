import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  // Old admin attempt type, will be dropped in migration
  type OldAdminCodeAttempt = {
    attemptCount : Nat;
    lastAttempt : Time.Time;
    lockedUntil : ?Time.Time;
    sharedCodeSession : ?Time.Time;
  };

  // Old actor type from previous canister (all dropped stable variables)
  type OldActor = {
    MAX_ATTEMPTS : Nat;
    LOCKOUT_DURATION_NS : Int;
    SHARED_CODE_SESSION_DURATION_NS : Int;
    ADMIN_SHARED_CODE : Text;
    adminCodeAttempts : Map.Map<Principal, OldAdminCodeAttempt>;
  };

  // New admin verification state type
  type NewAdminVerificationState = {
    step1_verified : Bool;
    step2_verified : Bool;
    step3_verified : Bool;
    session_expiry : ?Time.Time;
  };

  // New actor type (only the new stable variable)
  type NewActor = {
    adminVerificationStates : Map.Map<Principal, NewAdminVerificationState>;
  };

  public func run(old : OldActor) : NewActor {
    let newStates = Map.empty<Principal, NewAdminVerificationState>();
    { adminVerificationStates = newStates };
  };
};
