// backend/src/server.js

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

// backend/src/server.js
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://uptoskills-ai-learning-platform.vercel.app", // Your actual frontend
      /\.vercel\.app$/ // This regex allows all your Vercel preview links
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

// IMPORTANT: export app for Vercel (NO app.listen here)
module.exports = app;
