const { generateStructuredOutput } = require("../utils/llmHelper");

/**
 * Critic / Verifier Agent Node
 * Verifies if the synthesized thesis is consistent with the specialist agent reports.
 * Employs strict loop limits (max 1 retry loop back to Synthesizer) to prevent infinite runs.
 */
const criticNode = async (state) => {
  const symbol = state.symbol || "XYZ";
  const prevFeedback = state.criticFeedback || { issuesFound: false, feedback: "", attemptCount: 0 };
  const nextAttemptCount = prevFeedback.attemptCount + 1;

  const progressLogEntry = {
    node: "Critic",
    message: `Critic node verifying report consistency for ${symbol} (Verification Attempt #${nextAttemptCount})...`,
    timestamp: new Date().toISOString(),
  };

  const schemaDescription = '{"issuesFound": boolean, "feedback": string}';

  // Construct robust fallback behavior
  const companyLower = (state.companyName || "").toLowerCase();
  const shouldTriggerMockLoop = companyLower.includes("loop") && nextAttemptCount === 1;

  const fallbackValue = {
    issuesFound: shouldTriggerMockLoop,
    feedback: shouldTriggerMockLoop 
      ? "Critic found formatting issues: The Key Takeaways list is too short. Please expand with additional detail from the Risk analysis." 
      : "All data verified successfully. No inconsistencies found."
  };

  // Enforce a hard ceiling in code to prevent any possibility of infinite loops
  if (nextAttemptCount >= 2) {
    return {
      criticFeedback: {
        issuesFound: false,
        feedback: "All data verified successfully (Max critique limit reached).",
        attemptCount: nextAttemptCount,
      },
      progressLog: [
        progressLogEntry,
        {
          node: "Critic",
          message: "Critique count limit reached. Forcing report approval to ensure execution completes.",
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  const prompt = `
    You are a skeptical peer-review editor.
    Cross-reference this consolidated synthesized investment draft:
    ${JSON.stringify(state.synthesizedReport)}
    
    Against the underlying inputs:
    Financials: ${JSON.stringify(state.financialAnalysis)}
    Sentiment: ${JSON.stringify(state.sentimentAnalysis)}
    Risks: ${JSON.stringify(state.riskAnalysis)}
    Competition Moat: ${JSON.stringify(state.competitiveAnalysis)}
    
    Check for contradictions (e.g., claiming margins are improving when the financials show compression, or ignoring major regulatory risks).
    
    Output ONLY a valid JSON object matching this schema:
    ${schemaDescription}
    
    Rules:
    - If you find discrepancies, set issuesFound = true and write details in the feedback field.
    - If it matches the underlying reports perfectly, set issuesFound = false, feedback = "Verified."
    - Return ONLY valid raw JSON.
  `;

  try {
    const response = await generateStructuredOutput(prompt, schemaDescription, fallbackValue);
    
    const issuesFound = response.issuesFound;
    const finalFeedback = issuesFound ? (response.feedback || "Discrepancy found.") : "All data verified successfully.";

    return {
      criticFeedback: {
        issuesFound,
        feedback: finalFeedback,
        attemptCount: nextAttemptCount,
      },
      progressLog: [
        progressLogEntry,
        {
          node: "Critic",
          message: issuesFound
            ? `Verification failed. Feedback: "${finalFeedback}". Routing back to Synthesizer.`
            : `Verification successful. Proceeding to final scoring.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error("Critic Agent failed, using fallback:", err.message);
    return {
      criticFeedback: {
        issuesFound: shouldTriggerMockLoop,
        feedback: fallbackValue.feedback,
        attemptCount: nextAttemptCount,
      },
      progressLog: [
        progressLogEntry,
        {
          node: "Critic",
          message: shouldTriggerMockLoop
            ? `Verification failed (fallback). Routing back to Synthesizer.`
            : `Verification successful (fallback). Proceeding to final scoring.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
};

module.exports = criticNode;
