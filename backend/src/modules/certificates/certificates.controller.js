const certificatesService = require("./certificates.service");
const blockchainService = require("../blockchain/blockchain.service");

async function getAllCertificates(req, res) {
  try {
    const certificates = await certificatesService.getAllCertificates();

    return res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
      error: error.message,
    });
  }
}

async function verifyCertificate(req, res) {
  try {
    const { id, name } = req.query;

    if (!id || !name) {
      return res.status(400).json({
        success: false,
        message: "Both id and name are required",
      });
    }

    const result = await certificatesService.verifyCertificateByIdAndName(id, name);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
}

async function generateCertificate(req, res) {
  try {
    const { id, studentName, studentAddress, diplomaTitle, mention, issueDate } = req.body;

    if (!id || !studentName || !studentAddress || !diplomaTitle || !issueDate) {
      return res.status(400).json({
        success: false,
        message: "id, studentName, studentAddress, diplomaTitle and issueDate are required",
      });
    }

    const result = await blockchainService.generateCertificate({
      id,
      studentName,
      studentAddress,
      diplomaTitle,
      mention: mention || "",
      issueDate,
    });

    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate certificate",
      error: error.message,
    });
  }
}

async function signCertificate(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Certificate id is required",
      });
    }

    const result = await blockchainService.signCertificate(id);

    return res.status(200).json({
      success: true,
      message: "Certificate signed successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to sign certificate",
      error: error.message,
    });
  }
}

async function validateCertificate(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Certificate id is required",
      });
    }

    const result = await blockchainService.validateCertificate(id);

    return res.status(200).json({
      success: true,
      message: "Certificate validated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to validate certificate",
      error: error.message,
    });
  }
}

module.exports = {
  getAllCertificates,
  verifyCertificate,
  generateCertificate,
  signCertificate,
  validateCertificate,
};