use ic_cdk_macros::{init, update, query};
use candid::{CandidType, Principal};
use serde::{Serialize, Deserialize};
use bincode;
use ic_cdk::storage;

#[derive(CandidType, Serialize, Deserialize)]
struct Token {
    id: u32,           // Unique token identifier.
    owner: Principal,  // Owner's principal ID.
    balance: u64,      // Token balance.
}

// Initializes the token with default values and stores it in stable memory.
#[init]
fn initialize() {
    let token = Token {
        id: 1,
        owner: ic_cdk::caller(), // Sets the caller as the token owner.
        balance: 1000,
    };

    let encoded = bincode::serialize(&token).expect("Serialization failed");
    storage::stable_save((encoded,)).expect("Failed to save to stable memory");
}

// Updates the token balance and saves the changes to stable memory.
#[update]
fn modify_balance(amount: u64) {
    let mut token = fetch_token(); // Load the existing token.
    token.balance = amount;

    let encoded = bincode::serialize(&token).expect("Serialization failed");
    storage::stable_save((encoded,)).expect("Failed to save to stable memory");
}

// Reads and returns the token details.
#[query]
fn get_token() -> Token {
    fetch_token()
}

// Helper function to load the token from stable memory.
fn fetch_token() -> Token {
    let (data,): (Vec<u8>,) = storage::stable_restore().expect("Failed to restore from memory");
    bincode::deserialize(&data).expect("Deserialization failed")
}
