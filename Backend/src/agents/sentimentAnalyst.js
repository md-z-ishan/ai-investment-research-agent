const { generateStructuredOutput } = require("../utils/llmHelper");

/**
 * Sentiment Analyst Agent Node
 * Analyzes recent news articles to determine media sentiment, rating, and score.
 */
const sentimentAnalystNode = async (state) => {
  const symbol = state.symbol || "XYZ";
  const progressLogEntry = {
    node: "Sentiment Analyst",
    message: `Analyzing recent news headlines and sentiment context for ${symbol}...`,
    timestamp: new Date().toISOString(),
  };

  const news = state.rawData?.news || [];
  const schemaDescription = '{"score": number (0-100), "summary": string, "pros": string[], "cons": string[], "sentimentRating": string}';

  // Fallbacks if API key is absent
  let fallbackScore = 65;
  let fallbackSummary = `Market sentiment for ${symbol} is generally neutral to slightly positive.`;
  let fallbackPros = ["Product line expansions received well", "Favorable institutional coverage in recent weeks"];
  let fallbackCons = ["Macroeconomic concerns weighing on consumer spending", "Mixed retail social media sentiment"];
  let fallbackRating = "Neutral";

  if (symbol === "AAPL") {
    fallbackScore = 80;
    fallbackRating = "Positive";
    fallbackSummary = "Apple's sentiment is bolstered by strong excitement around AI integration (Apple Intelligence) and services growth.";
    fallbackPros = ["Bullish institutional analyst reports", "Positive response to subscription models", "Consistent consumer brand loyalty"];
    fallbackCons = ["Regulatory challenges in the European Union", "Concerns over hardware replacement cycle lengths"];
  } else if (symbol === "NVDA") {
    fallbackScore = 95;
    fallbackRating = "Very Positive";
    fallbackSummary = "Nvidia sentiment is extremely bullish, driven by dominant market mindshare and key product announcements at GTC.";
    fallbackPros = ["FOMO sentiment in enterprise AI adoption", "Widespread price target upgrades from research desks", "Strong positive narrative around GPU chips"];
    fallbackCons = ["High retail expectations create potential for corrections", "Scrutiny over export regulations"];
  } else if (symbol === "TSLA") {
    fallbackScore = 48;
    fallbackRating = "Mixed";
    fallbackSummary = "Tesla's sentiment is volatile, split between excitement for FSD autonomous driving tech and concern over current EV sales.";
    fallbackPros = ["Strong retail investor backing", "Enthusiasm around humanoid robotics updates"];
    fallbackCons = ["Regulatory scrutiny on autopilot systems", "Consumer fatigue in mature EV segments"];
  }

  const fallbackValue = {
    score: fallbackScore,
    summary: fallbackSummary,
    pros: fallbackPros,
    cons: fallbackCons,
    sentimentRating: fallbackRating
  };

  const prompt = `
    You are an expert financial sentiment analyst.
    Analyze these news articles for company ${symbol}:
    ${JSON.stringify(news)}
    
    Calculate a sentiment score from 0 (very negative) to 100 (very bullish).
    Assign a rating: 'Positive', 'Negative', 'Neutral', 'Very Positive', or 'Mixed'.
    
    Output ONLY a valid JSON object matching this schema:
    ${schemaDescription}
    
    Rules:
    - Pros should be media highlights or bullish press announcements.
    - Cons should highlight negative reports, regulatory fines, or bearish rumors.
    - Do not output markdown fences or commentary.
  `;

  try {
    const response = await generateStructuredOutput(prompt, schemaDescription, fallbackValue);
    
    return {
      sentimentAnalysis: response,
      progressLog: [
        progressLogEntry,
        {
          node: "Sentiment Analyst",
          message: `Sentiment analysis complete for ${symbol}. Rating: ${response.sentimentRating} (${response.score}/100).`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error("Sentiment Analyst failed, using fallback:", err.message);
    return {
      sentimentAnalysis: fallbackValue,
      progressLog: [
        progressLogEntry,
        {
          node: "Sentiment Analyst",
          message: `Sentiment analysis complete for ${symbol}. Rating: ${fallbackValue.sentimentRating} (${fallbackValue.score}/100) (fallback).`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
};

module.exports = sentimentAnalystNode;
