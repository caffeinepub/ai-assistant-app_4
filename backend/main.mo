import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profiles
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Account and transaction data
  let accounts = Map.empty<Principal, Nat>();
  
  public type Transaction = {
    id : Nat;
    sender : Principal;
    recipient : Principal;
    amount : Nat;
    timestamp : Int;
    memo : Text;
  };
  
  let transactions = Map.empty<Nat, Transaction>();
  let mints = Map.empty<Principal, Nat>();
  var nextTransactionId : Nat = 1;
  let mintAmount : Nat = 1000;
  let mintLimit : Nat = 1;

  // User profile functions
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

  // Balance query
  public query ({ caller }) func getBalance() : async Nat {
    switch (accounts.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
  };

  // Demo minting with rate limiting
  public shared ({ caller }) func mintForDemo() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mint tokens");
    };
    
    let mintCount = switch (mints.get(caller)) {
      case (null) { 0 };
      case (?count) { count };
    };
    
    if (mintCount >= mintLimit) {
      Runtime.trap("Minting limit reached for this principal");
    };

    let currentBalance = switch (accounts.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
    accounts.add(caller, currentBalance + mintAmount);

    let transaction : Transaction = {
      id = nextTransactionId;
      sender = caller;
      recipient = caller;
      amount = mintAmount;
      timestamp = Time.now();
      memo = "Demo mint";
    };
    transactions.add(transaction.id, transaction);

    mints.add(caller, mintCount + 1);
    nextTransactionId += 1;
  };

  // Transfer funds
  public shared ({ caller }) func transferFunds(recipient : Principal, amount : Nat, memo : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can transfer funds");
    };

    let senderBalance = switch (accounts.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    };

    if (senderBalance < amount) {
      Runtime.trap("Insufficient balance for transfer");
    };

    accounts.add(caller, Nat.sub(senderBalance, amount));
    
    let recipientBalance = switch (accounts.get(recipient)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
    accounts.add(recipient, recipientBalance + amount);

    let transaction : Transaction = {
      id = nextTransactionId;
      sender = caller;
      recipient = recipient;
      amount = amount;
      timestamp = Time.now();
      memo = memo;
    };
    transactions.add(transaction.id, transaction);

    nextTransactionId += 1;
  };

  // List transactions for caller
  public query ({ caller }) func listTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    
    var transactionList : [Transaction] = [];
    for ((id, transaction) in transactions.entries()) {
      if (transaction.sender == caller or transaction.recipient == caller) {
        transactionList := transactionList.concat([transaction]);
      };
    };

    transactionList.sort(func(t1 : Transaction, t2 : Transaction) : Order.Order {
      Nat.compare(t1.id, t2.id)
    });
  };
};
