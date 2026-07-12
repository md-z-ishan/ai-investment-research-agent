const AppError = require("../utils/AppError");
const MemoryCache = require("../cache/memoryCache");
const { createResearchGraph } = require("../graph/buildGraph");

/**
 * Main Controller for investment research.
 * Supports:
 * 1. GET /api/research?companyName=XYZ (Server-Sent Events stream for progress)
 * 2. POST /api/research (Standard JSON request)
 */
const createResearch = async (req, res, next) => {
  try {
    const isGET = req.method === "GET";
    const isSSE = isGET || req.headers.accept === "text/event-stream";
    const companyName = isGET ? req.query.companyName : req.body.companyName;

    if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
      if (isSSE) {
        res.setHeader("Content-Type", "text/event-stream");
        res.write(`event: error\ndata: ${JSON.stringify({ message: "companyName is required" })}\n\n`);
        return res.end();
      }
      return next(new AppError("companyName is required", 400, null, "INVALID_COMPANY_NAME"));
    }

    const normalizedCompanyName = companyName.trim();

    // 1. Check Cache (24-hour cache window)
    const cachedData = MemoryCache.get(normalizedCompanyName);
    if (cachedData) {
      console.log(`Cache hit for company: "${normalizedCompanyName}"`);
      
      if (isSSE) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        // Stream cached progress logs with rapid delays for UX pacing
        const mockSteps = [
          { node: "Router", message: `Retrieving cached report for ${normalizedCompanyName}...`, timestamp: new Date().toISOString() },
          { node: "Scoring Engine", message: "Restoring final vector ratings from cache database.", timestamp: new Date().toISOString() }
        ];

        for (const step of mockSteps) {
          res.write(`event: progress\ndata: ${JSON.stringify(step)}\n\n`);
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        res.write(`event: complete\ndata: ${JSON.stringify(cachedData)}\n\n`);
        return res.end();
      }

      return res.status(200).json({
        success: true,
        message: "Research completed (cached)",
        data: cachedData,
      });
    }

    // 2. Stream Pipeline updates using LangGraph `.stream()`
    if (isSSE) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      const graph = createResearchGraph();
      const initialState = {
        companyName: normalizedCompanyName,
        symbol: "",
        error: null,
        currentStep: "INIT",
        progressLog: [],
        rawData: { financials: null, news: [], generalSearch: [] },
        financialAnalysis: null,
        sentimentAnalysis: null,
        riskAnalysis: null,
        competitiveAnalysis: null,
        synthesizedReport: null,
        criticFeedback: { issuesFound: false, feedback: "", attemptCount: 0 },
      };

      const stream = await graph.stream(initialState);
      let finalState = initialState;

      for await (const chunk of stream) {
        const completedNodeName = Object.keys(chunk)[0];
        const nodeOutput = chunk[completedNodeName];

        // Merge incoming state channels
        finalState = {
          ...finalState,
          ...nodeOutput,
        };

        // Stream logs generated in this step
        const logs = nodeOutput.progressLog || [];
        for (const log of logs) {
          res.write(`event: progress\ndata: ${JSON.stringify(log)}\n\n`);
        }
      }

      if (finalState.error) {
        res.write(`event: error\ndata: ${JSON.stringify({ message: finalState.error })}\n\n`);
        return res.end();
      }

      // Save complete report to cache
      MemoryCache.set(normalizedCompanyName, finalState);

      res.write(`event: complete\ndata: ${JSON.stringify(finalState)}\n\n`);
      return res.end();
    } else {
      // 3. Fallback synchronous JSON payload execution
      const graph = createResearchGraph();
      const result = await graph.invoke({
        companyName: normalizedCompanyName,
        symbol: "",
        error: null,
        currentStep: "INIT",
        progressLog: [],
        rawData: { financials: null, news: [], generalSearch: [] },
        financialAnalysis: null,
        sentimentAnalysis: null,
        riskAnalysis: null,
        competitiveAnalysis: null,
        synthesizedReport: null,
        criticFeedback: { issuesFound: false, feedback: "", attemptCount: 0 },
      });

      if (result.error) {
        throw new AppError(result.error, 404, null, "COMPANY_NOT_FOUND");
      }

      MemoryCache.set(normalizedCompanyName, result);

      return res.status(200).json({
        success: true,
        message: "Research completed",
        data: result,
      });
    }
  } catch (error) {
    if (res.headersSent) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
      return res.end();
    }
    
    if (error instanceof AppError) {
      return next(error);
    }
    
    return next(new AppError(error.message || "Research request failed.", 500, null, "RESEARCH_FAILED"));
  }
};

module.exports = {
  createResearch,
};
