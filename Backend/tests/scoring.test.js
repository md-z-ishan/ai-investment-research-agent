const test = require("node:test");
const assert = require("node:assert/strict");
const computeFinalScore = require("../src/scoring/computeFinalScore");
const computeConfidence = require("../src/scoring/computeConfidence");

test("computeFinalScore calculates weighted score correctly", () => {
  // Test case 1: Standard metrics
  // Financials: 88 (35% -> 30.8)
  // Sentiment: 80 (25% -> 20.0)
  // Risk: 25 (Safety: 75 -> 20% -> 15.0)
  // Competitive Moat: 90 (20% -> 18.0)
  // Expected final: 30.8 + 20.0 + 15.0 + 18.0 = 83.8 -> rounds to 84
  const result = computeFinalScore(88, 80, 25, 90);
  assert.equal(result, 84);
});

test("computeFinalScore handles bounds and defaults correctly", () => {
  // Test case 2: Empty/undefined values fall back to 50
  // Financials: 50 (35% -> 17.5)
  // Sentiment: 50 (25% -> 12.5)
  // Risk: 50 (Safety: 50 -> 20% -> 10.0)
  // Competitive Moat: 50 (20% -> 10.0)
  // Expected: 17.5 + 12.5 + 10.0 + 10.0 = 50
  const resultDefaults = computeFinalScore(null, undefined, NaN, "invalid");
  assert.equal(resultDefaults, 50);

  // Test case 3: Zero values
  // Financials: 0
  // Sentiment: 0
  // Risk: 100 (Safety: 0)
  // Competitive: 0
  // Expected: 0
  const resultZero = computeFinalScore(0, 0, 100, 0);
  assert.equal(resultZero, 0);

  // Test case 4: Maximum values
  // Financials: 100 (35)
  // Sentiment: 100 (25)
  // Risk: 0 (Safety: 100 -> 20)
  // Competitive: 100 (20)
  // Expected: 100
  const resultMax = computeFinalScore(100, 100, 0, 100);
  assert.equal(resultMax, 100);
});

test("computeConfidence returns correct score based on data availability", () => {
  const fullRawData = {
    financials: { price: 100 },
    news: [ { title: "news" } ],
    generalSearch: [ { snippet: "moat" } ]
  };

  const highConsensusScores = {
    financial: 80,
    sentiment: 80,
    risk: 20, // Safety = 80
    competitive: 80
  };

  // 1. Full data (40 points)
  // 2. Full consensus (stdDev = 0 -> 40 points)
  // 3. First attempt critic (20 points)
  // Expected: 40 + 40 + 20 = 100
  const maxConfidence = computeConfidence(fullRawData, highConsensusScores, 1);
  assert.equal(maxConfidence, 100);
});

test("computeConfidence reduces score for missing inputs and high consensus dispersion", () => {
  // Missing search results (only financials and news present -> 30 points)
  const partialRawData = {
    financials: { price: 100 },
    news: [ { title: "news" } ],
    generalSearch: []
  };

  // High dispersion (stdDev > 20)
  const lowConsensusScores = {
    financial: 90,
    sentiment: 30,
    risk: 80, // Safety = 20
    competitive: 95
  };

  // Critic review took 2 loops (10 points instead of 20)
  const result = computeConfidence(partialRawData, lowConsensusScores, 2);
  
  // Checking that it degrades properly and stays within boundaries
  assert.ok(result < 100);
  assert.ok(result > 0);
});
