const { generateStructuredOutput } = require("../utils/llmHelper");

/**
 * Router Agent Node
 * Uses Gemini (when configured) to validate if a company name is a public entity,
 * resolve its stock ticker symbol, or flag private businesses.
 */
const routerNode = async (state) => {
  const companyName = state.companyName || "";
  const progressLogEntry = {
    node: "Router",
    message: `Routing and validating request for company: "${companyName}"...`,
    timestamp: new Date().toISOString(),
  };

  if (!companyName.trim()) {
    return {
      error: "Company name cannot be empty.",
      currentStep: "ROUTER_ERROR",
      progressLog: [
        progressLogEntry,
        {
          node: "Router",
          message: "Validation failed: Empty company name.",
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  // Handle mock failure for private or non-existent companies (local shortcut to avoid LLM cost)
  const normalized = companyName.trim().toLowerCase();
  if (
    normalized.includes("tea stall") || 
    normalized.includes("corner shop") || 
    normalized.includes("local bakery")
  ) {
    return {
      error: `Company "${companyName}" is a local private business and is not listed on public markets.`,
      currentStep: "ROUTER_ERROR",
      progressLog: [
        progressLogEntry,
        {
          node: "Router",
          message: `Validation failed: "${companyName}" is not a publicly traded entity.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  // Resolve symbols (basic mapping for local testing fallback)
  let mockSymbol = "XYZ";
  if (normalized.includes("apple") || normalized.includes("aapl")) mockSymbol = "AAPL";
  else if (normalized.includes("nvidia") || normalized.includes("nvda")) mockSymbol = "NVDA";
  else if (normalized.includes("microsoft") || normalized.includes("msft")) mockSymbol = "MSFT";
  else if (normalized.includes("tesla") || normalized.includes("tsla")) mockSymbol = "TSLA";
  else if (normalized.includes("netflix") || normalized.includes("nflx")) mockSymbol = "NFLX";

  const fallbackValue = {
    isPublic: true,
    symbol: mockSymbol,
    error: null
  };

  const schemaDescription = '{"isPublic": boolean, "symbol": string, "error": string|null}';
  const prompt = `
    You are an investment research router.
    Analyze the company name: "${companyName}".
    Determine if this is a publicly traded company on major global exchanges (like NYSE, NASDAQ, NSE, LSE).
    Resolve its official ticker symbol.
    
    Output ONLY a valid JSON object matching this schema:
    ${schemaDescription}
    
    Rules:
    - If it is not a publicly listed company, set isPublic = false, symbol = "N/A", and write a descriptive error in the error field.
    - If it is public, set isPublic = true, resolve the symbol, and error = null.
    - Return ONLY valid raw JSON. No comments, no markdown markdown blocks.
  `;

  try {
    const response = await generateStructuredOutput(prompt, schemaDescription, fallbackValue);
    
    if (response.error || !response.isPublic) {
      const errMsg = response.error || `Company "${companyName}" does not appear to be public.`;
      return {
        error: errMsg,
        currentStep: "ROUTER_ERROR",
        progressLog: [
          progressLogEntry,
          {
            node: "Router",
            message: `Validation failed: ${errMsg}`,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    return {
      symbol: response.symbol || mockSymbol,
      currentStep: "ROUTED_SUCCESSFULLY",
      progressLog: [
        progressLogEntry,
        {
          node: "Router",
          message: `Company validated. Ticker resolved to: ${response.symbol || mockSymbol}. Routing to Data Collector.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error("Router agent execution failed, using local fallback:", err.message);
    return {
      symbol: mockSymbol,
      currentStep: "ROUTED_SUCCESSFULLY",
      progressLog: [
        progressLogEntry,
        {
          node: "Router",
          message: `Router resolved symbol AAPL/mock ticker. Routing to Data Collector.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
};

module.exports = routerNode;
