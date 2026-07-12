const { generateStructuredOutput } = require("../utils/llmHelper");

/**
 * Competitive Analyst Agent Node
 * Analyzes market share, entry barriers, economic moats, and peer dynamics to evaluate competition.
 */
const competitiveAnalystNode = async (state) => {
  const symbol = state.symbol || "XYZ";
  const progressLogEntry = {
    node: "Competitive Analyst",
    message: `Analyzing moat structure and benchmarking against major competitors for ${symbol}...`,
    timestamp: new Date().toISOString(),
  };

  const generalSearch = state.rawData?.generalSearch || [];
  const schemaDescription = '{"score": number (0-100), "summary": string, "pros": string[], "cons": string[], "competitors": string[]}';

  // Fallbacks if API key is absent
  let fallbackScore = 70;
  let fallbackSummary = `Solid industry position for ${symbol} with a moderate competitive moat.`;
  let fallbackPros = ["Steady market share retention", "R&D spending keeps pace with direct peers"];
  let fallbackCons = ["Low cost switching barriers for competitors", "Direct competitors expanding capacity"];
  let fallbackCompetitors = ["Competitor A", "Competitor B"];

  if (symbol === "AAPL") {
    fallbackScore = 90;
    fallbackSummary = "Apple commands an exceptionally wide economic moat rooted in high ecosystem switching costs and premium brand value.";
    fallbackPros = ["High customer retention (>90% upgrade intent)", "Superior hardware + software ecosystem lock-in", "Extremely powerful retail store network"];
    fallbackCons = ["Google/Android gaining traction in emerging market segments", "Open-source sideloading regulatory changes threaten App Store exclusivity"];
    fallbackCompetitors = ["Samsung Electronics", "Google (Alphabet)", "Microsoft"];
  } else if (symbol === "NVDA") {
    fallbackScore = 94;
    fallbackSummary = "Nvidia commands a dominant competitive position in AI computing due to its CUDA software ecosystem, creating a high barrier to entry.";
    fallbackPros = ["CUDA software platform locks developers into Nvidia silicon", "Complete full-stack system architecture (chips, networking, servers)", "Massive head-start in hyperscale datacenters"];
    fallbackCons = ["Custom silicon developed by customers (AWS, Google, Microsoft) poses long-term threat", "Pacing AMD (ROCm ecosystem) and Intel hardware challenges"];
    fallbackCompetitors = ["AMD", "Intel", "Custom ASICs (TPUs, Trainium)"];
  } else if (symbol === "TSLA") {
    fallbackScore = 72;
    fallbackSummary = "Tesla retains a notable competitive advantage in manufacturing scale and charging network infrastructure, though it is narrowing.";
    fallbackPros = ["Proprietary Supercharger network is a major sales driver", "Unrivaled manufacturing scale in pure play EVs", "Over-the-air software capabilities lead traditional auto"];
    fallbackCons = ["BYD and Chinese EV makers producing lower-cost quality vehicles", "Legacy OEMs introducing strong competitive SUV models"];
    fallbackCompetitors = ["BYD", "Xiaomi Auto", "Rivian", "Legacy OEMs"];
  }

  const fallbackValue = {
    score: fallbackScore,
    summary: fallbackSummary,
    pros: fallbackPros,
    cons: fallbackCons,
    competitors: fallbackCompetitors
  };

  const prompt = `
    You are a market strategist. Benchmark the competitive position of ${symbol} using these search results:
    ${JSON.stringify(generalSearch)}
    
    Determine a competitive moat score from 0 (no moat / commoditized) to 100 (impenetrable moat / monopoly).
    
    Output ONLY a valid JSON object matching this schema:
    ${schemaDescription}
    
    Rules:
    - Pros should focus on core moats (switching costs, network effects, cost advantages, brand equity).
    - Cons should highlight competitor gains, product substitution, or pricing power loss.
    - list major direct competitors in the competitors list.
    - Do not output markdown fences or comments.
  `;

  try {
    const response = await generateStructuredOutput(prompt, schemaDescription, fallbackValue);
    
    return {
      competitiveAnalysis: response,
      progressLog: [
        progressLogEntry,
        {
          node: "Competitive Analyst",
          message: `Competitive analysis complete for ${symbol}. Moat Score: ${response.score}/100.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error("Competitive Analyst failed, using fallback:", err.message);
    return {
      competitiveAnalysis: fallbackValue,
      progressLog: [
        progressLogEntry,
        {
          node: "Competitive Analyst",
          message: `Competitive analysis complete for ${symbol}. Moat Score: ${fallbackValue.score}/100 (fallback).`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
};

module.exports = competitiveAnalystNode;
