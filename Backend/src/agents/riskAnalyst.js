const { generateStructuredOutput } = require("../utils/llmHelper");

/**
 * Risk Analyst Agent Node
 * Analyzes market volatility, operational overhead, balance sheet leverages, and regulatory updates to assign a risk score.
 * Note: Risk score is represented from 0 (lowest risk) to 100 (highest risk).
 */
const riskAnalystNode = async (state) => {
  const symbol = state.symbol || "XYZ";
  const progressLogEntry = {
    node: "Risk Analyst",
    message: `Conducting risk assessment across regulatory, market, and balance sheet categories for ${symbol}...`,
    timestamp: new Date().toISOString(),
  };

  const financials = state.rawData?.financials || {};
  const news = state.rawData?.news || [];
  const schemaDescription = '{"score": number (0-100), "summary": string, "pros": string[], "cons": string[], "riskFactors": string[]}';

  // Fallbacks if API key is absent
  let fallbackScore = 40; // Moderate risk
  let fallbackSummary = `Moderate risk profile for ${symbol}. Macro headwinds and standard regulatory oversight.`;
  let fallbackPros = ["Strong liquidity ratios mitigate default risk", "Diversified revenue streams geographically"];
  let fallbackCons = ["Susceptible to supply chain disruption", "Interest rate fluctuations impacting financing costs"];
  let fallbackFactors = ["Supply Chain Vulnerability", "Macroeconomic Slowdown"];

  if (symbol === "AAPL") {
    fallbackScore = 25; // Low risk
    fallbackSummary = "Apple has a low-risk profile due to a massive cash reserve and high brand switching costs, but faces antitrust exposure.";
    fallbackPros = ["Massive cash buffer (> $150B)", "Sticky ecosystem limits customer churn", "Strong pricing power against inflation"];
    fallbackCons = ["Antitrust suits in EU and US could force changes in App Store fees", "China supply chain concentration risk"];
    fallbackFactors = ["Antitrust Litigation", "Supply Chain Concentration", "Hardware Saturation"];
  } else if (symbol === "NVDA") {
    fallbackScore = 45; // Moderate-High risk
    fallbackSummary = "Nvidia faces moderate-to-high risks related to extreme valuation pricing-in perfection, customer concentration, and export bans.";
    fallbackPros = ["Critical supplier status shields from near-term competition", "Virtually zero long-term debt"];
    fallbackCons = ["US government export controls on AI hardware to China", "High client concentration (few hyper-scalers generate >40% revenue)"];
    fallbackFactors = ["Export Regulations", "Customer Concentration", "AI Capex Bubble", "Extreme Valuation"];
  } else if (symbol === "TSLA") {
    fallbackScore = 65; // High risk
    fallbackSummary = "Tesla carries a higher risk profile due to aggressive price competition, safety probes, and CEO key-person dependency.";
    fallbackPros = ["Strong balance sheet with no net debt", "Vertical integration shields battery supply chains"];
    fallbackCons = ["Key-person risk (Elon Musk involvement)", "Increasing federal probes into Autopilot / FSD claims", "Aggressive price cuts eroding net income margins"];
    fallbackFactors = ["Key-person Dependency", "Regulatory Probes into FSD", "Intense Price Competition"];
  }

  const fallbackValue = {
    score: fallbackScore,
    summary: fallbackSummary,
    pros: fallbackPros,
    cons: fallbackCons,
    riskFactors: fallbackFactors
  };

  const prompt = `
    You are a conservative risk analyst.
    Analyze the regulatory, operational, market, and financial risk profiles of ${symbol} using:
    Financials: ${JSON.stringify(financials)}
    News updates: ${JSON.stringify(news)}
    
    Determine a risk index rating from 0 (very low risk / safe) to 100 (very high risk / volatile).
    
    Output ONLY a valid JSON object matching this schema:
    ${schemaDescription}
    
    Rules:
    - Pros should be risk-mitigating factors (e.g. solid liquidity, low debt, pricing power).
    - Cons should highlight active risks or warning signals.
    - list specific risk categories in riskFactors.
    - Return ONLY valid JSON.
  `;

  try {
    const response = await generateStructuredOutput(prompt, schemaDescription, fallbackValue);
    
    return {
      riskAnalysis: response,
      progressLog: [
        progressLogEntry,
        {
          node: "Risk Analyst",
          message: `Risk analysis complete for ${symbol}. Risk Score: ${response.score}/100.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error("Risk Analyst failed, using fallback:", err.message);
    return {
      riskAnalysis: fallbackValue,
      progressLog: [
        progressLogEntry,
        {
          node: "Risk Analyst",
          message: `Risk analysis complete for ${symbol}. Risk Score: ${fallbackValue.score}/100 (fallback).`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
};

module.exports = riskAnalystNode;
