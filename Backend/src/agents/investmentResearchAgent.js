const { StateGraph, END, START } = require("@langchain/langgraph");
const financeService = require("../services/financeService");
const newsService = require("../services/newsService");
const geminiService = require("../services/geminiService");

const createInvestmentResearchGraph = () => {
  const workflow = new StateGraph({
    channels: {
      companyName: {
        value: (x, y) => y ?? x,
        default: () => "",
      },
      financialData: {
        value: (x, y) => y ?? x,
        default: () => null,
      },
      news: {
        value: (x, y) => y ?? x,
        default: () => [],
      },
      analysis: {
        value: (x, y) => y ?? x,
        default: () => null,
      },
      finalReport: {
        value: (x, y) => y ?? x,
        default: () => null,
      },
    },
  });

  workflow.addNode("fetchFinancialData", async (state) => {
    const financialData = await financeService.getCompanyFinancialData(state.companyName);
    return { financialData };
  });

  workflow.addNode("fetchLatestNews", async (state) => {
    const news = await newsService.getCompanyNews(state.companyName);
    return { news };
  });

  workflow.addNode("analyzeWithGemini", async (state) => {
    const analysis = await geminiService.analyzeInvestment(state.financialData, state.news);
    return { analysis };
  });

  workflow.addNode("generateFinalReport", async (state) => {
    const finalReport = {
      companyName: state.companyName,
      financialData: state.financialData,
      news: state.news,
      analysis: state.analysis,
    };

    return { finalReport };
  });

  workflow.addEdge(START, "fetchFinancialData");
  workflow.addEdge("fetchFinancialData", "fetchLatestNews");
  workflow.addEdge("fetchLatestNews", "analyzeWithGemini");
  workflow.addEdge("analyzeWithGemini", "generateFinalReport");
  workflow.addEdge("generateFinalReport", END);

  return workflow.compile();
};

module.exports = {
  createInvestmentResearchGraph,
};
