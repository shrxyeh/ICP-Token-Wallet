use ic_cdk_macros::{init, update, query};
use candid::{CandidType, Principal};
use serde::{Serialize, Deserialize};
use bincode;
use ic_cdk::storage;

#[derive(CandidType, Serialize, Deserialize)]
struct Token {
    id: u32,
    owner: Principal,
    balance: u64,
}

#[init]
fn initialize() {
    let token = Token {
        id: 1,
        owner: ic_cdk::caller(),
        balance: 1000,
    };

    let encoded = bincode::serialize(&token).expect("Serialization failed");
    storage::stable_save((encoded,)).expect("Failed to save to stable memory");
}

#[update]
fn modify_balance(amount: u64) {
    let mut token = fetch_token();
    token.balance = amount;

    let encoded = bincode::serialize(&token).expect("Serialization failed");
    storage::stable_save((encoded,)).expect("Failed to save to stable memory");
}

#[query]
fn get_token() -> Token {
    fetch_token()
}

fn fetch_token() -> Token {
    let (data,): (Vec<u8>,) = storage::stable_restore().expect("Failed to restore from memory");
    bincode::deserialize(&data).expect("Deserialization failed")
}
