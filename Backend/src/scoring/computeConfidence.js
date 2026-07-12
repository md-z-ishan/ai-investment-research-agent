/**
 * Calculates a deterministic confidence percentage (0-100)
 * based on data completeness, analyst score consensus, and critic review iterations.
 */
function computeConfidence(rawData, analystScores, criticAttempts) {
  let score = 0;

  // 1. Data Completeness (Max 40 points)
  // Check if financials are populated
  if (rawData?.financials && Object.keys(rawData.financials).length > 0) {
    score += 15;
  }
  // Check if news articles exist
  if (Array.isArray(rawData?.news) && rawData.news.length > 0) {
    score += 15;
  }
  // Check if general search data exists
  if (Array.isArray(rawData?.generalSearch) && rawData.generalSearch.length > 0) {
    score += 10;
  }

  // 2. Consensus Factor (Max 40 points)
  const fScore = analystScores.financial ?? 50;
  const sScore = analystScores.sentiment ?? 50;
  const safetyScore = 100 - (analystScores.risk ?? 50);
  const cScore = analystScores.competitive ?? 50;

  const scores = [fScore, sScore, safetyScore, cScore];
  const mean = scores.reduce((sum, val) => sum + val, 0) / scores.length;
  const variance = scores.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // If stdDev is 0 (total consensus), add 40 points. If stdDev >= 25 (very high divergence), add 0.
  const consensusPoints = Math.max(0, 40 - (stdDev * 1.6));
  score += consensusPoints;

  // 3. Critic Review Loop (Max 20 points)
  const attempts = Number(criticAttempts) || 1;
  if (attempts === 1) {
    score += 20;
  } else if (attempts === 2) {
    score += 10;
  }

  return Math.round(Math.max(0, Math.min(100, score)));
}

module.exports = computeConfidence;
