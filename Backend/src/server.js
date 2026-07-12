const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

// Always allow these origins regardless of env config
const HARDCODED_ORIGINS = [
  "https://ai-investment-research-agent-rouge-nu.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const envOrigins = (env.CORS_ORIGIN || env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...HARDCODED_ORIGINS, ...envOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes("*") ||
      allowedOrigins.some((o) => o === origin || origin.endsWith(".vercel.app"))
    ) {
      return callback(null, true);
    }

    console.warn(`CORS blocked: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(notFound);
app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
