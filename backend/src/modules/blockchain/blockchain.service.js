const {
  contract,
  signedContract,
  teacherSignedContract,
} = require("../../config/blockchain");

async function getAllCertificateIds() {
  const ids = await contract.getAllCertificateIds();
  return Array.from(ids);
}

async function getCertificateById(certificateId) {
  const cert = await contract.getCertificate(certificateId);

  return {
    id: cert[0],
    studentName: cert[1],
    studentAddress: cert[2],
    diplomaTitle: cert[3],
    mention: cert[4],
    issueDate: Number(cert[5]),
    teacherSigned: cert[6],
    validated: cert[7],
    signedByTeacher: cert[8],
  };
}

async function generateCertificate(data) {
  if (!signedContract) {
    throw new Error("Signer not configured. PRIVATE_KEY is missing.");
  }

  const tx = await signedContract.generateCertificate(
    data.id,
    data.studentName,
    data.studentAddress,
    data.diplomaTitle,
    data.mention,
    data.issueDate
  );

  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
  };
}

async function signCertificate(certificateId) {
  if (!teacherSignedContract) {
    throw new Error("Teacher signer not configured. TEACHER_PRIVATE_KEY is missing.");
  }

  const tx = await teacherSignedContract.signCertificate(certificateId);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
  };
}

async function validateCertificate(certificateId) {
  if (!signedContract) {
    throw new Error("Signer not configured. PRIVATE_KEY is missing.");
  }

  const tx = await signedContract.validateCertificate(certificateId);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
  };
}

async function getUserRole(walletAddress) {
  const role = await contract.getMyRole(walletAddress);
  return role;
}

module.exports = {
  getAllCertificateIds,
  getCertificateById,
  generateCertificate,
  signCertificate,
  validateCertificate,
  getUserRole,
};