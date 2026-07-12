if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = require("crypto").webcrypto;
}
const { StateGraph, START, END } = require("@langchain/langgraph");
const { StateAnnotation } = require("./state");
const routerNode = require("../agents/router");
const financialAnalystNode = require("../agents/financialAnalyst");
const sentimentAnalystNode = require("../agents/sentimentAnalyst");
const riskAnalystNode = require("../agents/riskAnalyst");
const competitiveAnalystNode = require("../agents/competitiveAnalyst");
const synthesizerNode = require("../agents/synthesizer");
const criticNode = require("../agents/critic");
const computeFinalScore = require("../scoring/computeFinalScore");
const computeConfidence = require("../scoring/computeConfidence");
const { getCompanyFinancials } = require("../tools/alphaVantage");
const { getCompanyNews } = require("../tools/newsApi");
const { searchWeb } = require("../tools/tavilySearch");

/**
 * Data Collector Node
 * Fetches real balance sheets, press updates, and web searches in parallel using external tool wrappers.
 */
const dataCollectorNode = async (state) => {
  const symbol = state.symbol || "";
  const companyName = state.companyName || "";
  const progressLogEntry = {
    node: "Data Collector",
    message: `Fetching real-time financials, news and web context for: "${companyName}"...`,
    timestamp: new Date().toISOString(),
  };

  try {
    const [financials, news, generalSearch] = await Promise.all([
      getCompanyFinancials(companyName, symbol),
      getCompanyNews(companyName),
      searchWeb(`${companyName} competitors market position economic moat`)
    ]);

    const resolvedSymbol = financials.symbol || symbol;

    return {
      symbol: resolvedSymbol,
      rawData: {
        financials,
        news,
        generalSearch
      },
      progressLog: [
        progressLogEntry,
        {
          node: "Data Collector",
          message: `Financials resolved from ${financials.source}. Fetched ${news.length} articles and competitor profiles.`,
          timestamp: new Date().toISOString(),
        }
      ]
    };
  } catch (error) {
    console.error("Data Collector node execution failed:", error);
    return {
      error: `Data Collection failed: ${error.message}`,
      progressLog: [
        progressLogEntry,
        {
          node: "Data Collector",
          message: `Data Collection error: ${error.message}`,
          timestamp: new Date().toISOString(),
        }
      ]
    };
  }
};

/**
 * Scoring Node
 * Computes deterministic score, confidence, and verdict from structured analyst inputs.
 */
const scoringNode = async (state) => {
  const symbol = state.symbol || "XYZ";
  const progressLogEntry = {
    node: "Scoring Engine",
    message: `Determining final investment recommendation index for ${symbol}...`,
    timestamp: new Date().toISOString(),
  };

  await new Promise((resolve) => setTimeout(resolve, 200));

  const fScore = state.financialAnalysis?.score ?? 50;
  const sScore = state.sentimentAnalysis?.score ?? 50;
  const rScore = state.riskAnalysis?.score ?? 50;
  const cScore = state.competitiveAnalysis?.score ?? 50;

  const finalScore = computeFinalScore(fScore, sScore, rScore, cScore);

  const rawData = state.rawData || {};
  const analystScores = {
    financial: fScore,
    sentiment: sScore,
    risk: rScore,
    competitive: cScore,
  };
  const criticAttempts = state.criticFeedback?.attemptCount || 1;

  const confidence = computeConfidence(rawData, analystScores, criticAttempts);

  // Verdict logic: 0-39 PASS, 40-64 WATCH, 65-100 INVEST
  let action = "WATCH";
  if (finalScore >= 65) action = "INVEST";
  else if (finalScore <= 39) action = "PASS";

  // Compile opposing thesis (Devil's Advocate) based on risk factors and critic notes
  const riskFactors = Array.isArray(state.riskAnalysis?.riskFactors)
    ? state.riskAnalysis.riskFactors.map(r => typeof r === 'string' ? r : (r.factor || '')).filter(Boolean).join(", ")
    : "";
  const criticNotes = Array.isArray(state.criticFeedback?.feedbackHistory)
    ? state.criticFeedback.feedbackHistory.join(" ")
    : typeof state.criticFeedback?.notes === 'string' ? state.criticFeedback.notes : "";

  let opposingThesis = "No major opposing arguments identified. Monitor overall macroeconomic variables and general execution limits.";
  if (riskFactors || criticNotes) {
    opposingThesis = `CRITICAL COUNTER-THESIS: Investment could fail due to significant risk exposures. High-severity threats include: ${riskFactors || "Systemic market risk"}. Additionally, independent auditing flagged: ${criticNotes || "Validation check warnings"}. Review these parameters before allocations.`;
  }

  const updatedSynthesizedReport = {
    ...state.synthesizedReport,
    finalScore,
    confidence,
    recommendation: {
      action,
      score: finalScore,
      confidence,
      reasoning: state.synthesizedReport?.executiveSummary || "Analysis completed.",
      opposingThesis,
    },
  };

  return {
    synthesizedReport: updatedSynthesizedReport,
    currentStep: "SCORING_COMPLETE",
    progressLog: [
      progressLogEntry,
      {
        node: "Scoring Engine",
        message: `Analysis finalized. Verdict: ${action} (${finalScore}/100), Confidence: ${confidence}%.`,
        timestamp: new Date().toISOString(),
      },
    ],
  };
};

// Route decisions
const routeAfterRouter = (state) => {
  if (state.error) {
    return "END";
  }
  return "dataCollector";
};

const routeAfterCritic = (state) => {
  const feedback = state.criticFeedback;
  if (feedback && feedback.issuesFound && feedback.attemptCount < 2) {
    return "synthesizer";
  }
  return "scoring";
};

const createResearchGraph = () => {
  const workflow = new StateGraph(StateAnnotation);

  // Add Nodes
  workflow.addNode("router", routerNode);
  workflow.addNode("dataCollector", dataCollectorNode);
  workflow.addNode("financialAnalyst", financialAnalystNode);
  workflow.addNode("sentimentAnalyst", sentimentAnalystNode);
  workflow.addNode("riskAnalyst", riskAnalystNode);
  workflow.addNode("competitiveAnalyst", competitiveAnalystNode);
  workflow.addNode("synthesizer", synthesizerNode);
  workflow.addNode("critic", criticNode);
  workflow.addNode("scoring", scoringNode);

  // Define edges
  workflow.addEdge(START, "router");

  // Router conditional edge
  workflow.addConditionalEdges("router", routeAfterRouter, {
    dataCollector: "dataCollector",
    END: END,
  });

  // Parallel execution branches
  workflow.addEdge("dataCollector", "financialAnalyst");
  workflow.addEdge("dataCollector", "sentimentAnalyst");
  workflow.addEdge("dataCollector", "riskAnalyst");
  workflow.addEdge("dataCollector", "competitiveAnalyst");

  // Re-converging edges (StateGraph merges outputs)
  workflow.addEdge("financialAnalyst", "synthesizer");
  workflow.addEdge("sentimentAnalyst", "synthesizer");
  workflow.addEdge("riskAnalyst", "synthesizer");
  workflow.addEdge("competitiveAnalyst", "synthesizer");

  // Synthesizer to Critic
  workflow.addEdge("synthesizer", "critic");

  // Critic conditional edge (can loop back to synthesizer once, or route to scoring)
  workflow.addConditionalEdges("critic", routeAfterCritic, {
    synthesizer: "synthesizer",
    scoring: "scoring",
  });

  // Scoring completes and exits
  workflow.addEdge("scoring", END);

  return workflow.compile();
};

const runInvestmentResearch = async (companyName) => {
  if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
    throw new Error("companyName is required");
  }

  const graph = createResearchGraph();
  const initialState = {
    companyName: companyName.trim(),
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

  return graph.invoke(initialState);
};

module.exports = {
  createResearchGraph,
  runInvestmentResearch,
};
