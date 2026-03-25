const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./modules/auth/auth.routes");
const blockchainRoutes = require("./modules/blockchain/blockchain.routes");
const certificatesRoutes = require("./modules/certificates/certificates.routes");
const usersRoutes = require("./modules/users/users.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Certificate System API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/certificates", certificatesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;