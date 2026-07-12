const env = require("../config/env");

class NewsService {
  async getCompanyNews(companyName) {
    if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
      return [];
    }

    const apiKey = env.GNEWS_API_KEY;

    if (!apiKey) {
      console.error("GNews API key is not configured");
      return [];
    }

    try {
      const query = encodeURIComponent(companyName.trim());
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=${query}&lang=en&max=5&apikey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`GNews API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const articles = Array.isArray(data?.articles) ? data.articles : [];

      return articles.slice(0, 5).map((article) => ({
        title: article?.title || null,
        description: article?.description || null,
        url: article?.url || null,
        source: article?.source?.name || article?.source || null,
        publishedAt: article?.publishedAt || null,
      }));
    } catch (error) {
      console.error("Failed to fetch company news:", error.message);
      return [];
    }
  }
}

module.exports = new NewsService();
