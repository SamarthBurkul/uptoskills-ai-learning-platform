// backend/src/controllers/authController.js
const axios = require("axios");
const User = require("../models/User");

// ---------- helpers ----------

const success = (res, statusCode, data, message) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const fail = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const setAuthCookies = (res, accessToken, refreshToken) => {
  const options = {
    httpOnly: true,
    secure: false, // set true once using HTTPS custom domain
    sameSite: "lax",
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);
};

const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// ---------- normal email/password ----------

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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN BODY:", req.body); // keep for debugging

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

// ---------- Google OAuth ----------

const verifyFirebaseIdToken = async (idToken) => {
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey) {
    throw new Error("FIREBASE_WEB_API_KEY not set in backend .env");
  }

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
  const { data } = await axios.post(url, { idToken });

  if (!data.users || data.users.length === 0) {
    throw new Error("No user found for this token");
  }

  const userInfo = data.users[0];
  return {
    email: userInfo.email,
    fullName: userInfo.displayName || userInfo.email.split("@")[0],
  };
};

// POST /api/auth/oauth-login
const oauthLogin = asyncHandler(async (req, res) => {
  const { provider, idToken } = req.body;

  console.log("OAUTH body:", {
    provider,
    idToken: idToken ? idToken.slice(0, 20) + "..." : undefined,
  });

  if (provider !== "google") {
    return fail(res, 400, "Unsupported provider");
  }

  if (!idToken) {
    return fail(res, 400, "ID token is required");
  }

  try {
    const { email, fullName } = await verifyFirebaseIdToken(idToken);

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        password: `${Date.now()}_${email}`, // dummy
      });
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
      "OAuth login successful"
    );
  } catch (err) {
    console.error(
      "Firebase token verify error:",
      err.response?.data || err.message
    );
    return fail(res, 400, "Invalid Google token");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
  }

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options);

  return success(res, 200, null, "Logged out successfully");
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return success(res, 200, req.user, "User fetched successfully");
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  oauthLogin,
  logoutUser,
};
