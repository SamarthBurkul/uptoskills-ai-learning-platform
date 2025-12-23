require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 1. Connect to MongoDB
connectDB();

// 2. Basic Middlewares
app.use(express.json());
app.use(cookieParser());

// 3. CORS Configuration for standard requests
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://uptoskills-ai-learning-platform.vercel.app",
      /\.vercel\.app$/ // ✅ Allows all Vercel subdomains
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// 4. ✅ VERCEL SPECIFIC: Manual Preflight & Header Handling
// This fixes the "No Access-Control-Allow-Origin" error
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Logic to allow dynamic Vercel origins
  if (origin && (origin === "https://uptoskills-ai-learning-platform.vercel.app" || origin.endsWith(".vercel.app"))) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// 5. Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Uptoskills backend running");
});

// 6. ✅ Express v5 Fix: Named wildcard for OPTIONS
app.options('/*splat', cors());

// 7. Export for Vercel
module.exports = app;

// 8. Local Listener (Development Only)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running on http://localhost:${PORT}`);
  });
}