require("dotenv").config();
const { ethers } = require("ethers");
const axios = require("axios");

async function testTeacherAuth() {
  try {
    const privateKey = process.env.TEACHER_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey);

    const walletAddress = wallet.address;

    console.log("Teacher wallet:", walletAddress);

    // 1. Demander nonce
    const nonceResponse = await axios.post(
      "http://localhost:5000/api/auth/nonce",
      {
        walletAddress,
      }
    );

    const message = nonceResponse.data.data.message;

    console.log("\nMessage à signer:\n", message);

    // 2. Signer message
    const signature = await wallet.signMessage(message);

    console.log("\nSignature:\n", signature);

    // 3. Vérifier signature
    const verifyResponse = await axios.post(
      "http://localhost:5000/api/auth/verify",
      {
        walletAddress,
        signature,
      }
    );

    console.log("\nRésultat auth teacher:\n", verifyResponse.data);
  } catch (error) {
    console.error("Erreur:", error.response?.data || error.message);
  }
}

testTeacherAuth();