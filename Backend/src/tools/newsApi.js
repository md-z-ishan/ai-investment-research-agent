const newsService = require("../services/newsService");

/**
 * NewsAPI.org Tool
 * Fetches recent news articles for a company.
 * Falls back to GNews (newsService) or mock data if key is missing or fails.
 */
async function getCompanyNews(companyName) {
  if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
    return [];
  }

  const apiKey = process.env.NEWS_API_KEY || "";
  const query = companyName.trim();

  if (!apiKey) {
    console.warn("NewsAPI key is not configured. Falling back to GNews.");
    return fetchGNewsFallback(query);
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://newsapi.org/v2/everything?q=${encodedQuery}&language=en&pageSize=5&sortBy=publishedAt&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NewsAPI responded with status ${response.status}`);
    }

    const data = await response.json();
    const articles = Array.isArray(data?.articles) ? data.articles : [];

    if (articles.length === 0) {
      return fetchGNewsFallback(query);
    }

    return articles.map((article) => ({
      title: article.title || "Untitled Article",
      description: article.description || "",
      url: article.url || "#",
      source: article.source?.name || "NewsAPI",
      publishedAt: article.publishedAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("NewsAPI request failed, using GNews fallback:", error.message);
    return fetchGNewsFallback(query);
  }
}

/**
 * Fallback to GNews API
 */
async function fetchGNewsFallback(query) {
  try {
    const articles = await newsService.getCompanyNews(query);
    if (articles && articles.length > 0) {
      return articles.map((a) => ({
        title: a.title,
        description: a.description || "",
        url: a.url || "#",
        source: a.source || "GNews",
        publishedAt: a.publishedAt || new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.error("GNews fallback failed:", err.message);
  }

  // Hard fallback mock news
  return [
    {
      title: `Latest financial analysis updates released for ${query}`,
      description: `Market coverage analysts update ratings for ${query} noting strong sector growth trends.`,
      url: "#",
      source: "Financial Bulletin",
      publishedAt: new Date().toISOString(),
    },
    {
      title: `${query} stock index shows stability in mid-day trading`,
      description: `Stock fluctuations for ${query} remain in standard support bands during global trading index runs.`,
      url: "#",
      source: "Market Watcher",
      publishedAt: new Date().toISOString(),
    }
  ];
}

module.exports = {
  getCompanyNews,
};
