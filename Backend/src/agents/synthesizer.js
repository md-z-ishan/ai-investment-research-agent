const { generateStructuredOutput } = require("../utils/llmHelper");

/**
 * Synthesizer Agent Node
 * Aggregates structured outputs from all parallel analysts and compiles an executive summary.
 */
const synthesizerNode = async (state) => {
  const symbol = state.symbol || "XYZ";
  const progressLogEntry = {
    node: "Synthesizer",
    message: `Synthesizing analyst insights and compiling unified investment report for ${symbol}...`,
    timestamp: new Date().toISOString(),
  };

  const fin = state.financialAnalysis || { score: 50, summary: "N/A" };
  const sent = state.sentimentAnalysis || { score: 50, summary: "N/A" };
  const risk = state.riskAnalysis || { score: 50, summary: "N/A" };
  const comp = state.competitiveAnalysis || { score: 50, summary: "N/A" };

  const schemaDescription = '{"executiveSummary": string, "keyTakeaways": string[], "categoryReasonings": {"financials": string, "sentiment": string, "risk": string, "competition": string}}';

  // Fallbacks if API key is absent
  let fallbackSummary = `Unified analysis of ${symbol} points to standard industry performance. Financial stability is balanced by market risks.`;
  let fallbackTakeaways = [
    `Financial analyst scores ${symbol} at ${fin.score}/100 based on core profit numbers.`,
    `Sentiment metrics sit at ${sent.score}/100 reflecting recent press releases.`,
    `Risk analyst rates risk at ${risk.score}/100 (Safety: ${100 - risk.score}/100).`,
    `Competitive analyst finds peer comparison score is ${comp.score}/100.`,
  ];

  if (symbol === "AAPL") {
    fallbackSummary = "Apple Inc. represents a highly defensive investment option characterized by extreme cash flow generation, a wide competitive ecosystem moat, and solid sentiment, offset slightly by high valuation and minor hardware sales growth slowing.";
    fallbackTakeaways = [
      "Hardware-services ecosystem creates high customer switching costs and sticky repeat revenue.",
      "Regulatory antitrust challenges in Europe and US remain the single largest tail-risk factor.",
      "Current premium valuation suggests moderate upside but strong downside protection due to a $150B+ cash pile."
    ];
  } else if (symbol === "NVDA") {
    fallbackSummary = "Nvidia is the undisputed leader in AI computing infrastructure, displaying hyper-growth and exceptional profitability. However, high valuation multiples and geopolitical export restrictions introduce elevated volatility and downside risk.";
    fallbackTakeaways = [
      "CUDA developer ecosystem locks in customers, maintaining gross margins over 70%.",
      "Short-term demand remains insatiable among hyper-scale tech firms, supporting growth trajectory.",
      "Long-term risks include hyperscaler in-house silicon expansion and export regulations."
    ];
  } else if (symbol === "TSLA") {
    fallbackSummary = "Tesla is undergoing a transition phase, facing intense competitive margin pressure in its core automotive business, while investing heavily in autonomous driving (FSD), robotaxis, and robotics to fuel its next wave of growth.";
    fallbackTakeaways = [
      "Automotive profit margins have compressed due to global EV price competition.",
      "The charging network infrastructure and vertical battery integration remain critical moats.",
      "High valuation relies heavily on successful monetization of Robotaxi and FSD autonomous technologies."
    ];
  }

  const fallbackValue = {
    executiveSummary: fallbackSummary,
    keyTakeaways: fallbackTakeaways,
    categoryReasonings: {
      financials: fin.summary,
      sentiment: sent.summary,
      risk: risk.summary,
      competition: comp.summary,
    }
  };

  const prompt = `
    You are a senior investment decision-maker.
    Synthesize these individual analyst reports for ticker ${symbol} into a unified thesis:
    
    Financial Strength Report (Score ${fin.score}/100): ${JSON.stringify(fin)}
    Media Sentiment Report (Score ${sent.score}/100): ${JSON.stringify(sent)}
    Risk Assessment Audit (Score ${risk.score}/100 - where 0 is low risk, 100 is high risk): ${JSON.stringify(risk)}
    Competitive Moat Report (Score ${comp.score}/100): ${JSON.stringify(comp)}
    
    Draft:
    1. A comprehensive, institutional-grade executiveSummary (~150-200 words).
    2. A list of 3 high-impact keyTakeaways.
    3. Categorized summaries mapping each analyst's key perspective in categoryReasonings.
    
    Output ONLY a valid JSON object matching this schema:
    ${schemaDescription}
    
    Rules:
    - Avoid code blocks, comments, or leading markdown strings.
  `;

  try {
    const response = await generateStructuredOutput(prompt, schemaDescription, fallbackValue);
    
    return {
      synthesizedReport: response,
      progressLog: [
        progressLogEntry,
        {
          node: "Synthesizer",
          message: "Unified report synthesis complete. Routing to Critic for validation.",
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error("Synthesizer failed, using fallback:", err.message);
    return {
      synthesizedReport: fallbackValue,
      progressLog: [
        progressLogEntry,
        {
          node: "Synthesizer",
          message: "Unified report synthesis complete. Routing to Critic for validation (fallback).",
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
};

module.exports = synthesizerNode;
