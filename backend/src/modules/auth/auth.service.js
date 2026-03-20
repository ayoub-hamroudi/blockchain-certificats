const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const blockchainService = require("../blockchain/blockchain.service");

const nonceStore = new Map();

function normalizeAddress(address) {
  return ethers.getAddress(address);
}

function generateNonceMessage(walletAddress) {
  const nonce = crypto.randomInt(100000, 999999).toString();
  return `Login to Certificate System\nWallet: ${walletAddress}\nNonce: ${nonce}`;
}

async function createNonce(walletAddress) {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  if (!ethers.isAddress(walletAddress)) {
    throw new Error("Invalid wallet address");
  }

  const normalizedAddress = normalizeAddress(walletAddress);
  const message = generateNonceMessage(normalizedAddress);

  nonceStore.set(normalizedAddress, message);

  return {
    walletAddress: normalizedAddress,
    message,
  };
}

function mapBlockchainRole(role) {
  switch (role) {
    case "direction":
      return "admin";
    case "teacher":
      return "teacher";
    case "student":
      return "student";
    default:
      return "visitor";
  }
}

async function verifyWalletSignature(walletAddress, signature) {
  if (!walletAddress || !signature) {
    throw new Error("walletAddress and signature are required");
  }

  if (!ethers.isAddress(walletAddress)) {
    throw new Error("Invalid wallet address");
  }

  const normalizedAddress = normalizeAddress(walletAddress);
  const storedMessage = nonceStore.get(normalizedAddress);

  if (!storedMessage) {
    throw new Error("No nonce found for this wallet. Please request a new nonce.");
  }

  const recoveredAddress = ethers.verifyMessage(storedMessage, signature);
  const normalizedRecoveredAddress = normalizeAddress(recoveredAddress);

  if (normalizedRecoveredAddress !== normalizedAddress) {
    throw new Error("Invalid signature");
  }

  const blockchainRole = await blockchainService.getUserRole(normalizedAddress);
  const appRole = mapBlockchainRole(blockchainRole);

  const token = jwt.sign(
    {
      walletAddress: normalizedAddress,
      role: appRole,
      blockchainRole,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  nonceStore.delete(normalizedAddress);

  return {
    token,
    walletAddress: normalizedAddress,
    role: appRole,
    blockchainRole,
  };
}

module.exports = {
  createNonce,
  verifyWalletSignature,
};