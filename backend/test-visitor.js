require("dotenv").config();
const { ethers } = require("ethers");
const axios = require("axios");

async function testVisitorAuth() {
  try {
    const privateKey = process.env.VISITOR_PRIVATE_KEY;

    if (!privateKey) {
      throw new Error("VISITOR_PRIVATE_KEY is missing in .env");
    }

    const wallet = new ethers.Wallet(privateKey);
    const walletAddress = wallet.address;

    console.log("Visitor wallet:", walletAddress);

    const nonceResponse = await axios.post("http://localhost:5000/api/auth/nonce", {
      walletAddress,
    });

    const message = nonceResponse.data.data.message;

    console.log("\nMessage à signer:\n", message);

    const signature = await wallet.signMessage(message);

    console.log("\nSignature:\n", signature);

    const verifyResponse = await axios.post("http://localhost:5000/api/auth/verify", {
      walletAddress,
      signature,
    });

    console.log("\nRésultat auth visitor:\n", verifyResponse.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

testVisitorAuth();