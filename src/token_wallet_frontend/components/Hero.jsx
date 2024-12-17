import React, { useState } from "react";
import { ethers } from "ethers";
import walletImage from "../assets/wallet.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { LedgerCanister } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { Secp256k1KeyIdentity } from "@dfinity/identity";

// Function to send ICP tokens
const transferICP = async (privateKey, recipient, amount) => {
  try {
    const identity = Secp256k1KeyIdentity.fromSecretKey(Uint8Array.from(privateKey));
    const agent = new HttpAgent({ identity, host: "https://ic0.app" });
    await agent.fetchRootKey();
    const ledger = LedgerCanister.create({ agent });
    const recipientPrincipal = Principal.fromText(recipient);
    const amountInE8s = BigInt(amount * 100_000_000);
    const senderPrincipal = identity.getPrincipal();
    const transferDetails = {
      to: recipientPrincipal,
      fee: { e8s: BigInt(10000) },
      amount: { e8s: amountInE8s },
      memo: BigInt(0),
      from_subaccount: [],
      created_at_time: [],
    };
    const response = await ledger.transfer(transferDetails);
    if (response.Err) {
      console.error("Transfer failed:", response.Err);
      return "Transaction failed!";
    }
    console.log("Transfer succeeded:", response.Ok);
    return `Transaction successful! Block Height: ${response.Ok}`;
  } catch (error) {
    console.error("Error in transferICP:", error);
    return "Transaction failed!";
  }
};

const Hero = () => {
  const [connectedAddress, setConnectedAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [userPrivateKey, setUserPrivateKey] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setConnectedAddress(accounts[0]);
        await fetchBalance(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setStatusMessage("Connection failed.");
      }
    } else {
      setStatusMessage("MetaMask is not installed. Please install it.");
    }
  };

  const fetchBalance = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balanceInWei = await provider.getBalance(address);
      const formattedBalance = ethers.utils.formatEther(balanceInWei);
      const finalBalance = parseFloat(formattedBalance).toFixed(6);
      setWalletBalance(finalBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setStatusMessage("Failed to fetch balance.");
    }
  };

  const handleSendTokens = async () => {
    if (!amountToSend || parseFloat(amountToSend) <= 0) {
      setStatusMessage("Please enter a valid amount.");
    } else if (!recipientAddress || !userPrivateKey) {
      setStatusMessage("Please provide both the receiver address and private key.");
    } else {
      const resultMessage = await transferICP(userPrivateKey, recipientAddress, parseFloat(amountToSend));
      setStatusMessage(resultMessage);
    }
  };

  return (
    <>
      <div className="navbar">
        <h4 className="!text-2xl">
          <span className="text-gray-800 font-semibold text-base">Wallet Address: </span>
          <span className="text-black font-semibold">
            {connectedAddress ? `${connectedAddress}` : "Not connected"}
          </span>
        </h4>
        <h3 className="text-[#fff]">Blockchain Crypto Wallet with Rust & ICP</h3>
      </div>
      <div className="home">
        <div className="left !h-fit !p-2 flex flex-col">
          <h1 className="text-4xl text-[#ffff] font-semibold">ICP Wallet</h1>
          <div className="box !m-2">
            <h4 className="!text-base">Connect your wallet to start</h4>
            <button className="connect" onClick={connectWallet}>
              Connect Wallet
            </button>
            <h2>
              <span className="text-[#00ffee]">Balance: </span>
              <span className="text-[rgb(0,0,0)]">
                {walletBalance ? `${walletBalance} ETH` : "0.00 ETH"}
              </span>
            </h2>
            <div className="form">
              <label htmlFor="amount">Enter Token Amount:</label>
              <input
                type="number"
                placeholder="Enter amount"
                id="amount"
                value={amountToSend}
                onChange={(e) => setAmountToSend(e.target.value)}
              />
              <label htmlFor="recipient">Enter Receiver Address:</label>
              <input
                type="text"
                placeholder="Receiver Principal Address"
                id="recipient"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
              <label htmlFor="privateKey">Enter Private Key:</label>
              <input
                type="text"
                placeholder="Private Key"
                id="privateKey"
                value={userPrivateKey}
                onChange={(e) => setUserPrivateKey(e.target.value)}
              />
            </div>
            <button className="Send" onClick={handleSendTokens}>
              Send
            </button>
            {statusMessage && <h5 className="text-[#11ff40] font-semibold">{statusMessage}</h5>}
          </div>
        </div>
        <div className="right">
          <img src={walletImage} alt="Wallet" />
        </div>
      </div>
    </>
  );
};

export default Hero;
