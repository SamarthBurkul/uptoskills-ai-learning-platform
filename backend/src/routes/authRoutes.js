// backend/src/routes/authRoutes.js
const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
  oauthLogin,
  logoutUser,
} = require("../controllers/authController");
const { verifyJWT } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/oauth-login", oauthLogin);
router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);

module.exports = router;
