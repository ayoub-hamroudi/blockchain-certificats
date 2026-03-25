const express = require("express");
const router = express.Router();
const certificatesController = require("./certificates.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");

// lecture liste complète : accessible aux rôles connectés
router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "teacher", "student", "visitor"),
  certificatesController.getAllCertificates
);

// vérification : protégée aussi, même le visiteur doit avoir un wallet
router.get(
  "/verify",
  authMiddleware,
  allowRoles("admin", "teacher", "student", "visitor"),
  certificatesController.verifyCertificate
);

// génération : admin seulement
router.post(
  "/generate",
  authMiddleware,
  allowRoles("admin"),
  certificatesController.generateCertificate
);

// signature : teacher seulement
router.post(
  "/sign",
  authMiddleware,
  allowRoles("teacher"),
  certificatesController.signCertificate
);

// validation : admin seulement
router.post(
  "/validate",
  authMiddleware,
  allowRoles("admin"),
  certificatesController.validateCertificate
);

module.exports = router;