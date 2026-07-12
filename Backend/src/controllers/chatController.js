const geminiService = require("../services/geminiService");

/**
 * Handles RAG Q&A chat requests.
 * Uses Gemini (when active) to answer user questions grounded in the company's research report context.
 */
async function handleChat(req, res) {
  const { companyName, question, reportContext } = req.body;

  if (!companyName || !question) {
    return res.status(400).json({ error: "Missing required parameters: companyName and question" });
  }

  // Mock responses if Gemini is not configured
  if (!geminiService.genAI || !geminiService.apiKey) {
    const mockAnswers = [
      `Based on the compiled reports for ${companyName}, the financial sub-score shows steady progress, though regulatory risk remains a headwind.`,
      `The competitive analysis for ${companyName} indicates a strong moat. However, short-term news sentiment variance warrants a Watch status.`,
      `Consensus among specialists for ${companyName} suggests that key metrics are in-line, with risk variables being the main detractor.`
    ];
    const index = Math.floor(Math.random() * mockAnswers.length);
    return res.json({ answer: mockAnswers[index] });
  }

  const prompt = `
    You are an expert investment research copilot.
    You have analyzed the company "${companyName}" and produced the following report context:
    ${JSON.stringify(reportContext)}

    The user is asking the following question: "${question}"

    Provide a professional, clear, and direct answer grounded strictly in the report metrics (financial scores, sentiment factors, risks, and moat benchmarks).
    Do not invent or assume any metrics that are not present. Keep your response under 150 words.
  `;

  try {
    const result = await geminiService.generateContent(prompt);
    const answer = geminiService.extractResponseText(result);
    return res.json({ answer: answer || "I could not analyze this request." });
  } catch (error) {
    console.error("Chat agent execution failed, returning fallback warning:", error.message);
    return res.status(500).json({ error: "Chat service encountered an error." });
  }
}

module.exports = {
  handleChat,
};
