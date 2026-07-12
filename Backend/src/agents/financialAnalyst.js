const { generateStructuredOutput } = require("../utils/llmHelper");

/**
 * Financial Analyst Agent Node
 * Analyzes company financial statements, revenue, P/E, and EPS to output structured metrics.
 */
const financialAnalystNode = async (state) => {
  const symbol = state.symbol || "XYZ";
  const progressLogEntry = {
    node: "Financial Analyst",
    message: `Analyzing balance sheet and income statement metrics for ${symbol}...`,
    timestamp: new Date().toISOString(),
  };

  const financials = state.rawData?.financials || {};
  const schemaDescription = '{"score": number (0-100), "summary": string, "pros": string[], "cons": string[], "metricsUsed": {"peRatio": number, "profitMargin": number, "eps": number, "marketCap": number}}';

  // Construct realistic fallbacks if Gemini API is absent
  let fallbackScore = 75;
  let fallbackSummary = `Financial metrics indicate stable performance for ${symbol} with solid cash flow.`;
  let fallbackPros = ["Strong revenue growth year-over-year", "Healthy operating margins", "Excellent debt-to-equity ratio"];
  let fallbackCons = ["Premium valuation (elevated P/E ratio)", "Dividend yield is relatively low"];
  let fallbackMetrics = { peRatio: 28.5, profitMargin: 0.22, eps: 6.2, marketCap: 2800000000000 };

  if (symbol === "AAPL") {
    fallbackScore = 88;
    fallbackSummary = "Apple exhibits world-class financial health with exceptional return on equity and massive free cash flow generation.";
    fallbackPros = ["High return on equity (ROE)", "Exceptional free cash flow generation", "Robust hardware + services model margins"];
    fallbackCons = ["Growth rates slowing down in hardware", "Trading at high end of historical P/E ranges"];
    fallbackMetrics = { peRatio: 31.2, profitMargin: 0.26, eps: 6.5, marketCap: 3300000000000 };
  } else if (symbol === "NVDA") {
    fallbackScore = 92;
    fallbackSummary = "Nvidia demonstrates industry-leading growth and hyper-profitability due to dominating the AI hardware ecosystem.";
    fallbackPros = ["Explosive data center revenue growth", "Gross margins exceeding 70%", "Strong net cash position"];
    fallbackCons = ["Extremely high P/E ratio implies high execution risk", "Subject to semiconductor cyclicality and bottlenecks"];
    fallbackMetrics = { peRatio: 65.4, profitMargin: 0.48, eps: 12.8, marketCap: 3000000000000 };
  } else if (symbol === "TSLA") {
    fallbackScore = 62;
    fallbackSummary = "Tesla shows high profitability but is subject to margin contraction and intense electric vehicle competition.";
    fallbackPros = ["Industry-leading automotive gross margins", "Zero net debt, high liquidity", "Energy storage division growing rapidly"];
    fallbackCons = ["EV margin compression due to price wars", "High valuation relative to traditional auto manufacturers"];
    fallbackMetrics = { peRatio: 48.1, profitMargin: 0.09, eps: 2.8, marketCap: 700000000000 };
  }

  const fallbackValue = {
    score: fallbackScore,
    summary: fallbackSummary,
    pros: fallbackPros,
    cons: fallbackCons,
    metricsUsed: fallbackMetrics
  };

  const prompt = `
    You are an expert Wall Street financial analyst.
    Analyze the financial numbers for ${symbol}:
    ${JSON.stringify(financials)}
    
    Evaluate profitability margins, EPS value, P/E multiples, and capitalization trends.
    Determine a financial strength rating from 0 (poor) to 100 (excellent).
    
    Output ONLY a valid JSON object matching this schema:
    ${schemaDescription}
    
    Rules:
    - Pros should focus on numeric metrics like strong margins, EPS growth, etc.
    - Cons should highlight financial challenges like high leverage, slowing growth, or high P/E multiples.
    - Do not output markdown fences or comments, just raw JSON.
  `;

  try {
    const response = await generateStructuredOutput(prompt, schemaDescription, fallbackValue);
    
    return {
      financialAnalysis: response,
      progressLog: [
        progressLogEntry,
        {
          node: "Financial Analyst",
          message: `Financial analysis complete for ${symbol}. Score: ${response.score}/100.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error("Financial Analyst failed, using fallback:", err.message);
    return {
      financialAnalysis: fallbackValue,
      progressLog: [
        progressLogEntry,
        {
          node: "Financial Analyst",
          message: `Financial analysis complete for ${symbol}. Score: ${fallbackValue.score}/100 (fallback).`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
};

module.exports = financialAnalystNode;
