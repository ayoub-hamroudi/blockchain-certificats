require("dotenv").config();
const { ethers } = require("ethers");
const path = require("path");

const contractJson = require(path.join(
  __dirname,
  "../../../blockchain/build/contracts/CertificateSystem.json"
));

const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TEACHER_PRIVATE_KEY = process.env.TEACHER_PRIVATE_KEY;

if (!RPC_URL) {
  throw new Error("RPC_URL is missing in .env");
}

if (!CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is missing in .env");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractJson.abi,
  provider
);

let signer = null;
let signedContract = null;

if (PRIVATE_KEY) {
  signer = new ethers.Wallet(PRIVATE_KEY, provider);
  signedContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractJson.abi,
    signer
  );
}

let teacherSigner = null;
let teacherSignedContract = null;

if (TEACHER_PRIVATE_KEY) {
  teacherSigner = new ethers.Wallet(TEACHER_PRIVATE_KEY, provider);
  teacherSignedContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractJson.abi,
    teacherSigner
  );
}

module.exports = {
  provider,
  contract,
  signer,
  signedContract,
  teacherSigner,
  teacherSignedContract,
  contractAbi: contractJson.abi,
};