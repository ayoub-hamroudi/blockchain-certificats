const path = require("path");
const { readJsonFile, writeJsonFile } = require("../../utils/jsonStorage");

const USERS_FILE = path.join(__dirname, "../../../data/users.json");

async function getAllUsers() {
  return readJsonFile(USERS_FILE, []);
}

async function saveAllUsers(users) {
  await writeJsonFile(USERS_FILE, users);
}

module.exports = {
  getAllUsers,
  saveAllUsers,
};