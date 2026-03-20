const express = require("express");
const router = express.Router();
const blockchainController = require("./blockchain.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");

// lecture IDs : accessible aux rôles connectés
router.get(
  "/certificate-ids",
  authMiddleware,
  allowRoles("admin", "teacher", "student", "visitor"),
  blockchainController.getCertificateIds
);

// lecture détail certificat : accessible aux rôles connectés
router.get(
  "/certificate/:id",
  authMiddleware,
  allowRoles("admin", "teacher", "student", "visitor"),
  blockchainController.getCertificateById
);

module.exports = router;