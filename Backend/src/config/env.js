const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "*",
  GEMINI_API_KEY: geminiApiKey,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  GNEWS_API_KEY: process.env.GNEWS_API_KEY || "",
};
