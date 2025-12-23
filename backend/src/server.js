require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Robust CORS (Applying Finsaarthi logic + Vercel Fix)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://uptoskills-ai-learning-platform.vercel.app",
    /\.vercel\.app$/ // Allows dynamic preview URLs
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Manual Preflight Handler (Fixes current net::ERR_FAILED)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.includes("vercel.app") || origin.includes("localhost"))) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Error Handling (From your previous project)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}