const blockchainService = require("../blockchain/blockchain.service");
const { toInitCase } = require("../../utils/normalizeName");

async function verifyCertificateByIdAndName(certificateId, studentName) {
  try {
    const cert = await blockchainService.getCertificateById(certificateId);

    const normalizedInputName = toInitCase(studentName);
    const normalizedBlockchainName = toInitCase(cert.studentName);

    if (normalizedInputName !== normalizedBlockchainName) {
      return {
        valid: false,
        message: "Certificate not found or name mismatch",
      };
    }

    const isValid = cert.teacherSigned && cert.validated;

    return {
      valid: isValid,
      data: {
        id: cert.id,
        studentName: cert.studentName,
        studentAddress: cert.studentAddress,
        diplomaTitle: cert.diplomaTitle,
        mention: cert.mention,
        issueDate: cert.issueDate,
        teacherSigned: cert.teacherSigned,
        validated: cert.validated,
        signedByTeacher: cert.signedByTeacher,
      },
    };
  } catch (error) {
    return {
      valid: false,
      message: "Certificate not found or invalid ID",
    };
  }
}

async function getAllCertificates() {
  const ids = await blockchainService.getAllCertificateIds();

  const certificates = await Promise.all(
    ids.map(async (id) => {
      return await blockchainService.getCertificateById(id);
    })
  );

  return certificates;
}

module.exports = {
  verifyCertificateByIdAndName,
  getAllCertificates,
};
