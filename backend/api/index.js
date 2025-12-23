// backend/api/index.js

// Import the Express app defined in src/server.js
const app = require("../src/server");

// Export it so Vercel can run it as a serverless function
module.exports = app;
