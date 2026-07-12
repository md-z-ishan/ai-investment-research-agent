const express = require("express");
const { healthCheck } = require("../controllers/healthController");
const { createResearch } = require("../controllers/researchController");
const { handleChat } = require("../controllers/chatController");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Investment Research Agent API",
    version: "1.0.0",
  });
});

router.get("/api/health", healthCheck);
router.get("/api/research", createResearch);
router.post("/api/research", createResearch);
router.post("/api/chat", handleChat);

module.exports = router;
