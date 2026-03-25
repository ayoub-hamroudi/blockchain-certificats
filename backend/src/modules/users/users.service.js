const crypto = require("crypto");
const { ethers } = require("ethers");
const { toInitCase } = require("../../utils");
const usersRepository = require("./users.repository");
const blockchainService = require("../blockchain/blockchain.service");

function generateId() {
  return crypto.randomUUID();
}

function normalizeWalletAddress(address) {
  if (!address || !ethers.isAddress(address)) {
    throw new Error("Invalid wallet address");
  }

  return ethers.getAddress(address);
}

function validateRole(role) {
  if (!["teacher", "student"].includes(role)) {
    throw new Error("Invalid role");
  }
}

function validateName(name) {
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    throw new Error("Name must contain at least 2 characters");
  }

  return toInitCase(name);
}

function validateEmail(email) {
  if (!email || typeof email !== "string") {
    throw new Error("Email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw new Error("Invalid email format");
  }

  return normalizedEmail;
}

function mapUserForResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.walletAddress,
    walletAddress: user.walletAddress,
    role: user.role,
    status: user.status,
    blockchainSynced: user.blockchainSynced ?? false,
    blockchainTxHash: user.blockchainTxHash || null,
    addedAt: user.createdAt.slice(0, 10),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function syncUserToBlockchain(role, walletAddress) {
  if (role === "teacher") {
    return blockchainService.addTeacher(walletAddress);
  }

  if (role === "student") {
    return blockchainService.addStudent(walletAddress);
  }

  throw new Error("Unsupported blockchain role");
}

async function createUser({ name, email, walletAddress, role }) {
  validateRole(role);

  const normalizedName = validateName(name);
  const normalizedEmail = validateEmail(email);
  const normalizedWalletAddress = normalizeWalletAddress(walletAddress);

  const users = await usersRepository.getAllUsers();

  const addressExists = users.some(
    (user) => user.walletAddress.toLowerCase() === normalizedWalletAddress.toLowerCase()
  );

  if (addressExists) {
    throw new Error("A user with this wallet address already exists");
  }

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === normalizedEmail.toLowerCase()
  );

  if (emailExists) {
    throw new Error("A user with this email already exists");
  }

  const blockchainResult = await syncUserToBlockchain(role, normalizedWalletAddress);

  const now = new Date().toISOString();

  const newUser = {
    id: generateId(),
    name: normalizedName,
    email: normalizedEmail,
    walletAddress: normalizedWalletAddress,
    role,
    status: "active",
    blockchainSynced: true,
    blockchainTxHash: blockchainResult.txHash,
    createdAt: now,
    updatedAt: now,
  };

  users.unshift(newUser);
  await usersRepository.saveAllUsers(users);

  return mapUserForResponse(newUser);
}

async function getAllUsers() {
  const users = await usersRepository.getAllUsers();
  return users.map(mapUserForResponse);
}

async function getUsersByRole(role) {
  validateRole(role);

  const users = await usersRepository.getAllUsers();

  return users
    .filter((user) => user.role === role)
    .map(mapUserForResponse);
}

async function updateUser(id, { name, email, status }) {
  const users = await usersRepository.getAllUsers();
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  if (name !== undefined) {
    users[userIndex].name = validateName(name);
  }

  if (email !== undefined) {
    const normalizedEmail = validateEmail(email);

    const emailTaken = users.some(
      (user, index) =>
        index !== userIndex &&
        user.email.toLowerCase() === normalizedEmail.toLowerCase()
    );

    if (emailTaken) {
      throw new Error("A user with this email already exists");
    }

    users[userIndex].email = normalizedEmail;
  }

  if (status !== undefined) {
    if (!["active", "inactive"].includes(status)) {
      throw new Error("Invalid status");
    }

    users[userIndex].status = status;
  }

  users[userIndex].updatedAt = new Date().toISOString();

  await usersRepository.saveAllUsers(users);

  return mapUserForResponse(users[userIndex]);
}

async function deleteUser(id) {
  const users = await usersRepository.getAllUsers();
  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new Error("User not found");
  }

  const filteredUsers = users.filter((item) => item.id !== id);
  await usersRepository.saveAllUsers(filteredUsers);

  return mapUserForResponse(user);
}

module.exports = {
  createUser,
  getAllUsers,
  getUsersByRole,
  updateUser,
  deleteUser,
};