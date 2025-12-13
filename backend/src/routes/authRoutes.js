// src/routes/authRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController");
const { verifyJWT } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// secured
router.get("/current-user", verifyJWT, getCurrentUser);

module.exports = router;
