// src/server.js

// Load environment variables from a .env file into process.env
// This allows you to use environment variables like process.env.PORT or process.env.MONGO_URI
require("dotenv").config();

// Import the express library to create and manage the server application
const express = require("express");

// Import the cors library to handle Cross-Origin Resource Sharing
// This allows the frontend (on one port/origin) to make requests to the backend (on another port/origin)
const cors = require("cors");

// Import the cookie-parser library to parse incoming cookies from the client
// It populates req.cookies and req.signedCookies in route handlers
const cookieParser = require("cookie-parser");

// Import the function we defined to connect to our MongoDB database
const connectDB = require("./config/db");

// Import the specific routes related to authentication (e.g., login, register), server.js points the incoming request toward the authRoutes variable, which automatically runs the correct function within the authRoutes.js file to handle that specific login or signup action.
// This keeps our main server file clean by organizing route logic elsewhere
const authRoutes = require("./routes/authRoutes");

// Initialize the Express application
const app = express();

// --- Database Connection ---

// Execute the function to connect to MongoDB.
// Note: This connection is typically asynchronous but often handled implicitly in a simple server.js setup.
connectDB();

// --- Application Middlewares ---

// Middleware: Enable the Express app to parse JSON formatted bodies from incoming requests (e.g., POST requests), express.json() returns a middleware function.This middleware reads JSON body from incoming requests and sets it on req.body. Without this, req.body would be undefined when frontend sends JS
app.use(express.json());

// Middleware: Use cookie-parser to parse the 'Cookie' header and make cookies available in req.cookies
app.use(cookieParser());

// Middleware: Configure CORS to allow requests ONLY from our specified frontend origin (http://localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000", // Specifies which URL is allowed to access this backend
    credentials: true, // Allows the server to accept/set cookies and authorization headers from the frontend origin
  })
);

app.use("/api/auth", authRoutes);
// --- Routes ---

// Route Middleware: When a request hits the path '/api/auth', use the imported authRoutes router to handle it, app.use(path, router) says: For any URL starting with /api/auth, send the request into authRoutes. authRoutes itself is another mini router that has detailed routes for /register, /login, etc. This keeps your server organized: server.js knows which group of routes to use, and authRoutes.js knows exact paths and controllers. app.use("/api/auth", authRoutes);

// Simple GET route for the root URL ('/') to serve as a health check or status message, To see if the server is up
app.get("/", (req, res) => {
  res.send("Uptoskills backend running"); // Sends a simple string response back to the client
});

// --- Start Server ---

// Define the port the server will listen on. Use the environment variable PORT if available, otherwise default to 8000.
const PORT = process.env.PORT || 8000;

// Start the server and make it listen for incoming network traffic on the specified port
app.listen(PORT, () => {
  // This callback function executes once the server has successfully started listening
  console.log(`Server listening on port ${PORT}`);
});
