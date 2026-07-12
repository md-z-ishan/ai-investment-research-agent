const YahooFinance = require("yahoo-finance2").default;
const AppError = require("../utils/AppError");

class FinanceService {
  constructor() {
    this.yahooFinance = new YahooFinance();
  }

  async getCompanyFinancialData(companyName) {
    if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
      throw new AppError("companyName is required", 400, null, "INVALID_COMPANY_NAME");
    }

    const normalizedName = companyName.trim();

    try {
      const aliases = this.getCompanyAliases(normalizedName);
      const searchQueries = [...new Set([normalizedName, ...aliases])].filter(Boolean);
      let bestQuote = null;

      for (const query of searchQueries) {
        const searchResults = await this.yahooFinance.search(query, {
          quotesCount: 10,
          newsCount: 0,
        });

        const candidateQuote = this.selectBestQuote(searchResults?.quotes || [], normalizedName, query);
        if (candidateQuote) {
          bestQuote = candidateQuote;
          break;
        }
      }

      if (!bestQuote) {
        throw new AppError("No publicly listed company was found matching the provided name.", 404, null, "COMPANY_NOT_FOUND");
      }

      const quoteData = await this.yahooFinance.quote(bestQuote.symbol);

      return {
        companyName: quoteData.shortName || quoteData.longName || quoteData.displayName || normalizedName,
        symbol: quoteData.symbol || bestQuote.symbol,
        industry: quoteData.industry || null,
        sector: quoteData.sector || null,
        marketCap: quoteData.marketCap ?? null,
        currentPrice: quoteData.currentPrice ?? quoteData.regularMarketPrice ?? null,
        peRatio: quoteData.trailingPE ?? quoteData.forwardPE ?? null,
        eps: quoteData.epsTrailingTwelveMonths ?? quoteData.epsCurrentYear ?? null,
        revenue: quoteData.totalRevenue ?? null,
        profitMargin: quoteData.profitMargins ?? null,
        fiftyTwoWeekHigh: quoteData.fiftyTwoWeekHigh ?? null,
        fiftyTwoWeekLow: quoteData.fiftyTwoWeekLow ?? null,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : "Unknown error";
      throw new AppError("Unable to retrieve financial data for the provided company.", 500, { cause: message }, "FINANCIAL_DATA_UNAVAILABLE");
    }
  }

  getCompanyAliases(companyName) {
    const normalizedName = this.normalizeText(companyName);

    const aliases = {
      google: ["alphabet", "googl"],
      alphabet: ["google", "googl"],
      facebook: ["meta", "meta platforms"],
      meta: ["facebook", "meta platforms"],
      microsoft: ["msft"],
      apple: ["aapl"],
      amazon: ["amzn"],
      tesla: ["tsla"],
      nvidia: ["nvda"],
      nvda: ["nvidia"],
      netflix: ["nflx"],
      googl: ["alphabet", "google"],
      meta: ["facebook", "meta platforms"],
      msft: ["microsoft"],
      aapl: ["apple"],
      amzn: ["amazon"],
      tsla: ["tesla"],
      nflx: ["netflix"],
    };

    return (aliases[normalizedName] || []).filter(Boolean);
  }

  selectBestQuote(quotes, originalName, query) {
    const normalizedOriginal = this.normalizeText(originalName);
    const normalizedQuery = this.normalizeText(query);
    const aliasTerms = this.getCompanyAliases(originalName);
    const candidateTerms = [...new Set([normalizedOriginal, normalizedQuery, ...aliasTerms])].filter(Boolean);

    const scoredQuotes = quotes
      .map((quote) => {
        const quoteName = this.normalizeText(quote?.shortname || quote?.longname || quote?.displayname || quote?.symbol || "");
        const quoteSymbol = this.normalizeText(quote?.symbol || "");
        let score = 0;

        for (const term of candidateTerms) {
          if (!term) continue;

          if (quoteSymbol === term || quoteSymbol.includes(term)) {
            score += 70;
          }

          if (quoteName === term || quoteName.includes(term)) {
            score += 50;
          }

          if (quoteName.includes(term) || term.includes(quoteName)) {
            score += 15;
          }
        }

        if (quoteSymbol && normalizedOriginal.length <= 5 && quoteSymbol.toLowerCase() === normalizedOriginal.toLowerCase()) {
          score += 80;
        }

        return { quote, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scoredQuotes[0]?.quote || null;
  }

  normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b(inc|llc|corp|corporation|co|company|plc|group|technologies|platforms)\b/g, "")
      .trim();
  }
}

module.exports = new FinanceService();
