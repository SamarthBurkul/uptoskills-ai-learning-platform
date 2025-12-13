// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id || decodedToken?.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

module.exports = { verifyJWT };
