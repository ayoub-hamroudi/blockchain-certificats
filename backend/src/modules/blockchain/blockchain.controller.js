const blockchainService = require("./blockchain.service");

async function getCertificateIds(req, res) {
  try {
    const ids = await blockchainService.getAllCertificateIds();

    res.json({
      success: true,
      data: ids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificate IDs",
    });
  }
}

async function getCertificateById(req, res) {
  try {
    const { id } = req.params;

    const certificate = await blockchainService.getCertificateById(id);

    res.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Certificate not found",
    });
  }
}

module.exports = {
  getCertificateIds,
  getCertificateById,
};
