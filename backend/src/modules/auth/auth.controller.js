const authService = require("./auth.service");

async function getNonce(req, res) {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "walletAddress is required",
      });
    }

    const result = await authService.createNonce(walletAddress);

    return res.status(200).json({
      success: true,
      message: "Sign this message to authenticate",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function verifySignature(req, res) {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({
        success: false,
        message: "walletAddress and signature are required",
      });
    }

    const result = await authService.verifyWalletSignature(walletAddress, signature);

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}

async function getMe(req, res) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        walletAddress: req.user.walletAddress,
        role: req.user.role,
        blockchainRole: req.user.blockchainRole,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
}

module.exports = {
  getNonce,
  verifySignature,
  getMe,
};