const { StateGraph, START, END } = require("@langchain/langgraph");
const { Annotation } = require("@langchain/langgraph");
const financeService = require("../../src/services/financeService");
const newsService = require("../../src/services/newsService");
const geminiService = require("../../src/services/geminiService");

const State = Annotation.Root({
  companyName: Annotation(),
  financialData: Annotation(),
  news: Annotation(),
  analysis: Annotation(),
});

const createInitialState = (companyName) => ({
  companyName,
  financialData: null,
  news: [],
  analysis: null,
});

const createInvestmentGraph = () => {
  const workflow = new StateGraph(State);

  workflow.addNode("fetchFinancialData", async (state) => {
    const companyName = state?.companyName || state?.values?.companyName || "";
    const financialData = await financeService.getCompanyFinancialData(companyName);
    return { financialData };
  });

  workflow.addNode("fetchCompanyNews", async (state) => {
    const companyName = state?.companyName || state?.values?.companyName || "";
    const news = await newsService.getCompanyNews(companyName);
    return { news };
  });

  workflow.addNode("analyzeInvestment", async (state) => {
    const financialData = state?.financialData ?? state?.values?.financialData ?? null;
    const news = state?.news ?? state?.values?.news ?? [];
    const analysis = await geminiService.analyzeInvestment(financialData, news);
    return { analysis };
  });

  workflow.addEdge(START, "fetchFinancialData");
  workflow.addEdge("fetchFinancialData", "fetchCompanyNews");
  workflow.addEdge("fetchCompanyNews", "analyzeInvestment");
  workflow.addEdge("analyzeInvestment", END);

  return workflow.compile();
};

const runInvestmentResearch = async (companyName) => {
  if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
    throw new Error("companyName is required");
  }

  const graph = createInvestmentGraph();
  const initialState = createInitialState(companyName.trim());

  return graph.invoke(initialState);
};

module.exports = {
  createInvestmentGraph,
  runInvestmentResearch,
};
