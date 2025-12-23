require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// connect DB
connectDB();

// middlewares
app.use(express.json());
app.use(cookieParser());

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

// routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Uptoskills backend running");
});

// ✅ FIXED for Express v5: Named wildcard parameter
app.options('/*splat', cors()); 

// IMPORTANT: export app for Vercel
module.exports = app;

// Local listener for development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running on http://localhost:${PORT}`);
  });
}