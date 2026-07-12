const { GoogleGenAI } = require("@google/genai");
const env = require("../config/env");

const VALID_RECOMMENDATIONS = new Set(["Buy", "Hold", "Sell"]);

class GeminiService {
  constructor() {
    this.apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    this.genAI = this.apiKey ? new GoogleGenAI({ apiKey: this.apiKey }) : null;
    this.model = "gemini-3.5-flash";
    this.maxAttempts = 3;
    this.baseDelayMs = 1000;
  }

  async analyzeInvestment(financialData, news) {
    if (!this.genAI || !this.apiKey) {
      console.warn("Gemini API key is not configured. Using fallback analysis.");
      return this.createFallbackAnalysis(financialData, news, "API key is not configured.");
    }

    const compactFinancialData = this.summarizeFinancialData(financialData);
    const compactNews = this.summarizeNews(news);
    const prompt = this.buildPrompt(compactFinancialData, compactNews);

    for (let attempt = 1; attempt <= this.maxAttempts; attempt += 1) {
      try {
        const result = await this.generateContent(prompt);
        const responseText = this.extractResponseText(result);

        if (!responseText) {
          throw Object.assign(new Error("Empty Gemini response"), { code: "EMPTY_RESPONSE" });
        }

        const parsed = this.parseResponse(responseText);
        const normalized = this.normalizeAnalysis(parsed);

        if (normalized.isFallback) {
          return this.createFallbackAnalysis(financialData, news, "AI returned an invalid response.");
        }

        return normalized;
      } catch (error) {
        const classification = this.classifyError(error);

        if (classification === "RETRYABLE" && attempt < this.maxAttempts) {
          const delayMs = this.getBackoffDelay(attempt);
          console.warn(`Gemini request failed with retryable error. Retrying in ${delayMs}ms...`);
          await this.sleep(delayMs);
          continue;
        }

        if (classification === "INVALID_API_KEY") {
          console.warn("Gemini API key is invalid or unauthorized.");
          return this.createFallbackAnalysis(financialData, news, "Invalid API key.");
        }

        if (classification === "QUOTA_EXCEEDED") {
          console.warn("Gemini quota exceeded. Falling back to safe analysis.");
          return this.createFallbackAnalysis(financialData, news, "Quota exceeded.");
        }

        if (classification === "TIMEOUT") {
          console.warn("Gemini request timed out.");
          return this.createFallbackAnalysis(financialData, news, "Request timed out.");
        }

        if (classification === "MALFORMED_JSON") {
          console.warn("Gemini returned malformed JSON.");
          return this.createFallbackAnalysis(financialData, news, "Malformed JSON response.");
        }

        console.warn("Gemini analysis failed. Using fallback analysis.", error?.message || String(error));
        return this.createFallbackAnalysis(financialData, news, error?.message || String(error));
      }
    }

    return this.createFallbackAnalysis(financialData, news, "Gemini request failed after retries.");
  }

  async generateContent(prompt) {
    return this.genAI.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });
  }

  extractResponseText(result) {
    if (typeof result?.text === "string" && result.text.trim()) {
      return result.text;
    }

    const textParts = result?.candidates?.[0]?.content?.parts || [];
    return textParts
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .filter(Boolean)
      .join("")
      .trim();
  }

  parseResponse(responseText) {
    const cleanedText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleanedText);
    } catch (error) {
      throw Object.assign(new Error("Malformed JSON response from Gemini"), { code: "MALFORMED_JSON" });
    }
  }

  normalizeAnalysis(payload) {
    const recommendation = this.normalizeRecommendation(payload?.recommendation);
    const confidence = this.normalizeConfidence(payload?.confidence);
    const pros = this.normalizeStringList(payload?.pros);
    const cons = this.normalizeStringList(payload?.cons);
    const reasoning = this.normalizeReasoning(payload?.reasoning);

    if (!recommendation || confidence === null || !Array.isArray(pros) || !Array.isArray(cons) || !reasoning) {
      return {
        recommendation: null,
        confidence: null,
        pros: [],
        cons: [],
        reasoning: "AI returned an invalid response.",
        isFallback: true,
      };
    }

    return {
      recommendation,
      confidence,
      pros,
      cons,
      reasoning,
      isFallback: false,
    };
  }

  normalizeRecommendation(value) {
    if (typeof value === "string") {
      const normalized = value.trim();
      return VALID_RECOMMENDATIONS.has(normalized) ? normalized : null;
    }
    return null;
  }

  normalizeConfidence(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      if (value >= 0 && value <= 1) {
        return Math.round(value * 100);
      }

      if (value >= 0 && value <= 100) {
        return Math.round(value);
      }
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        const numeric = Number(trimmed);
        if (numeric >= 0 && numeric <= 1) {
          return Math.round(numeric * 100);
        }
        if (numeric >= 0 && numeric <= 100) {
          return Math.round(numeric);
        }
      }
    }

    return null;
  }

  normalizeStringList(value) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter((item) => typeof item === "string" && item.trim())
      .map((item) => item.trim())
      .slice(0, 5);
  }

  normalizeReasoning(value) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    return "No reasoning provided.";
  }

  summarizeFinancialData(financialData = {}) {
    return {
      companyName: financialData.companyName || financialData.company || financialData.symbol || "Unknown",
      symbol: financialData.symbol || null,
      currentPrice: financialData.currentPrice ?? null,
      peRatio: financialData.peRatio ?? null,
      eps: financialData.eps ?? null,
      profitMargin: financialData.profitMargin ?? null,
      marketCap: financialData.marketCap ?? null,
      industry: financialData.industry || null,
      sector: financialData.sector || null,
    };
  }

  summarizeNews(news = []) {
    const limitedNews = Array.isArray(news) ? news.slice(0, 3) : [];
    return limitedNews.map((item) => ({
      title: item?.title || "",
      description: item?.description || item?.summary || "",
      publishedAt: item?.publishedAt || "",
    }));
  }

  buildPrompt(financialData, news) {
    return [
      "You are an investment research analyst.",
      "Analyze the company using valuation, EPS, profit margin, market cap, and recent news together.",
      "Return ONLY valid JSON with this exact schema:",
      '{"recommendation":"Buy|Hold|Sell","confidence":0,"pros":["..."],"cons":["..."],"reasoning":"..."}',
      "Rules:",
      "- Do not include markdown, code fences, commentary, or extra text.",
      "- Confidence must be an integer from 0 to 100.",
      "- Keep reasoning concise and grounded in the provided data.",
      "Financial data:",
      JSON.stringify(financialData),
      "Recent news:",
      JSON.stringify(news),
    ].join("\n");
  }

  createFallbackAnalysis(financialData, news, reason) {
    const reasoning = [
      "AI analysis is temporarily unavailable.",
      this.describeSignalContext(financialData, news),
      reason ? `Reason: ${reason}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      recommendation: null,
      confidence: null,
      pros: [],
      cons: [],
      reasoning,
      isFallback: true,
    };
  }

  describeSignalContext(financialData = {}, news = []) {
    const metrics = [];

    if (financialData?.peRatio != null) {
      metrics.push(`valuation ${financialData.peRatio}`);
    }

    if (financialData?.eps != null) {
      metrics.push(`EPS ${financialData.eps}`);
    }

    if (financialData?.profitMargin != null) {
      metrics.push(`profit margin ${financialData.profitMargin}`);
    }

    if (financialData?.marketCap != null) {
      metrics.push(`market cap ${financialData.marketCap}`);
    }

    if (Array.isArray(news) && news.length > 0) {
      metrics.push(`${news.length} recent news item(s)`);
    }

    return metrics.length > 0
      ? `The request considered ${metrics.join(", ")}.`
      : "No structured signals were available.";
  }

  classifyError(error) {
    const message = error?.message || String(error);
    const status = error?.status || error?.code || null;

    if (/invalid api key|api key|unauthorized|forbidden/i.test(message)) {
      return "INVALID_API_KEY";
    }

    if (/quota|rate limit|too many requests|exceeded/i.test(message)) {
      return "QUOTA_EXCEEDED";
    }

    if (/timeout|timed out|aborted|ETIMEDOUT/i.test(message)) {
      return "TIMEOUT";
    }

    if (error?.code === "MALFORMED_JSON" || /malformed json|json/i.test(message)) {
      return "MALFORMED_JSON";
    }

    if (status === 429 || status === 503 || /503|429/i.test(message)) {
      return "RETRYABLE";
    }

    return "UNKNOWN";
  }

  getBackoffDelay(attempt) {
    return this.baseDelayMs * 2 ** (attempt - 1);
  }

  sleep(delayMs) {
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

module.exports = new GeminiService();
