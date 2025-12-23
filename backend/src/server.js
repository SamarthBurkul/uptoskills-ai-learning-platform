require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

// Synchronized CORS for Vercel and Localhost
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://uptoskills-ai-learning-platform.vercel.app",
      /\.vercel\.app$/ 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Uptoskills backend running");
});

// ✅ Corrected for Express v5 path-to-regexp
app.options('/*splat', cors()); 

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running on http://localhost:${PORT}`);
  });
}