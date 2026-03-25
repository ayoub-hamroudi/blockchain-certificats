const { contract } = require("../../config/blockchain");

async function test() {
  try {
    const ids = await contract.getAllCertificateIds();
    console.log("Certificates:", ids);
  } catch (err) {
    console.error(err);
  }
}

test();