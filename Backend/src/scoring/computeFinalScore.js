/**
 * Calculates a deterministic final investment score (0-100)
 * based on scores from 4 analysts: Financial, Sentiment, Risk, and Competitive.
 * Risk score represents riskiness (0 = safe, 100 = risky), so we use (100 - riskScore) as a Safety Score.
 * 
 * Weights:
 * - Financial: 35%
 * - Sentiment: 25%
 * - Risk (Safety): 20%
 * - Competitive: 20%
 */
function computeFinalScore(financialScore, sentimentScore, riskScore, competitiveScore) {
  const fScore = typeof financialScore === "number" && !Number.isNaN(financialScore) ? financialScore : 50;
  const sScore = typeof sentimentScore === "number" && !Number.isNaN(sentimentScore) ? sentimentScore : 50;
  const rScore = typeof riskScore === "number" && !Number.isNaN(riskScore) ? riskScore : 50;
  const cScore = typeof competitiveScore === "number" && !Number.isNaN(competitiveScore) ? competitiveScore : 50;

  // Align risk: high risk (100) means low safety (0)
  const safetyScore = 100 - rScore;

  const finalScore = (0.35 * fScore) + (0.25 * sScore) + (0.20 * safetyScore) + (0.20 * cScore);

  return Math.round(Math.max(0, Math.min(100, finalScore)));
}

module.exports = computeFinalScore;
