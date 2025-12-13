// src/controllers/authController.js
const User = require("../models/User");

// helper: send consistent success responses
const success = (res, statusCode, data, message) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// helper: send error responses
const fail = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

// helper: wrap async handlers
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// helper to set cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  const options = {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    sameSite: "lax",
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);
};

// generate tokens and save refreshToken on user
const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((f) => !f || f.trim() === "")) {
    return fail(res, 400, "All fields are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return fail(res, 409, "User with this email already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const { accessToken, refreshToken } = await generateTokens(user._id);
  setAuthCookies(res, accessToken, refreshToken);

  return success(
    res,
    201,
    { user: safeUser, accessToken, refreshToken },
    "User registered successfully"
  );
});

// POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return fail(res, 400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return fail(res, 404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return fail(res, 401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);
  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  setAuthCookies(res, accessToken, refreshToken);

  return success(
    res,
    200,
    { user: safeUser, accessToken, refreshToken },
    "User logged in successfully"
  );
});

// GET /api/auth/current-user
const getCurrentUser = asyncHandler(async (req, res) => {
  return success(res, 200, req.user, "User fetched successfully");
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
