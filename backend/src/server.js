require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// DB
connectDB();

app.use(express.json());
app.use(cookieParser());

// CORS: local + production frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://uptoskills-ai-learning-platform.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Uptoskills backend running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
}
