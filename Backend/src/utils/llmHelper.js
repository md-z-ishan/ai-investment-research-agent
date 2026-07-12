const geminiService = require("../services/geminiService");

/**
 * Parses and cleans JSON blocks returned by LLMs.
 */
function parseAndCleanJson(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Empty response text");
  }
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  
  return JSON.parse(cleaned);
}

/**
 * Calls Gemini and enforces a structured JSON output.
 * If JSON parsing fails, it runs a single-attempt repair prompt.
 */
async function generateStructuredOutput(prompt, schemaDescription, fallbackValue) {
  // If Gemini API is not configured or fails initialization, return the mock fallback
  if (!geminiService.genAI || !geminiService.apiKey) {
    return fallbackValue;
  }

  let textResponse = "";
  try {
    const result = await geminiService.generateContent(prompt);
    textResponse = geminiService.extractResponseText(result);
    return parseAndCleanJson(textResponse);
  } catch (error) {
    console.warn("LLM response malformed or failed to parse. Attempting JSON repair prompt...");
    
    try {
      const repairPrompt = [
        "You are an AI data formatter. Your previous response was not valid JSON or failed to parse.",
        `Error Message: ${error.message}`,
        `Original Prompt: ${prompt}`,
        `Malformed Response: ${textResponse}`,
        "Please fix the response and return ONLY a valid JSON string. Do not include markdown code fences (like ```json), commentary, or leading/trailing text.",
        "Target Schema:",
        schemaDescription
      ].join("\n");

      const result = await geminiService.generateContent(repairPrompt);
      const repairedText = geminiService.extractResponseText(result);
      return parseAndCleanJson(repairedText);
    } catch (repairError) {
      console.error("JSON repair attempt failed. Using fallback defaults.", repairError.message);
      return fallbackValue;
    }
  }
}

module.exports = {
  generateStructuredOutput,
};
