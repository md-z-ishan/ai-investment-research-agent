const { Annotation } = require("@langchain/langgraph");
const { z } = require("zod");

// Define Zod schemas for structured validation at boundaries (agents, synthesizers, critic)
const ProgressLogSchema = z.object({
  node: z.string(),
  message: z.string(),
  timestamp: z.string(),
});

const RawDataSchema = z.object({
  financials: z.any().nullable().default(null),
  news: z.array(z.any()).default([]),
  generalSearch: z.array(z.any()).default([]),
});

const FinancialAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  metricsUsed: z.record(z.any()).default({}),
});

const SentimentAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  sentimentRating: z.string(),
});

const RiskAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  pros: z.array(z.string()), // risk mitigators
  cons: z.array(z.string()), // active risks
  riskFactors: z.array(z.string()),
});

const CompetitiveAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  pros: z.array(z.string()), // competitive advantages
  cons: z.array(z.string()), // threats
  competitors: z.array(z.string()),
});

const SynthesizedReportSchema = z.object({
  executiveSummary: z.string(),
  keyTakeaways: z.array(z.string()),
  categoryReasonings: z.object({
    financials: z.string(),
    sentiment: z.string(),
    risk: z.string(),
    competition: z.string(),
  }),
});

const CriticFeedbackSchema = z.object({
  issuesFound: z.boolean().default(false),
  feedback: z.string().default(""),
  attemptCount: z.number().default(0),
});

// Full state schema for validating the entire state object if needed
const FullStateSchema = z.object({
  companyName: z.string(),
  symbol: z.string().default(""),
  error: z.string().nullable().default(null),
  currentStep: z.string().default("INIT"),
  progressLog: z.array(ProgressLogSchema).default([]),
  rawData: RawDataSchema.default({}),
  financialAnalysis: FinancialAnalysisSchema.nullable().default(null),
  sentimentAnalysis: SentimentAnalysisSchema.nullable().default(null),
  riskAnalysis: RiskAnalysisSchema.nullable().default(null),
  competitiveAnalysis: CompetitiveAnalysisSchema.nullable().default(null),
  synthesizedReport: SynthesizedReportSchema.nullable().default(null),
  criticFeedback: CriticFeedbackSchema.default({}),
});

// Reducer functions for arrays and objects to merge updates properly
const appendProgressLog = (prev, next) => {
  const previousList = Array.isArray(prev) ? prev : [];
  if (!next) return previousList;
  const nextList = Array.isArray(next) ? next : [next];
  return [...previousList, ...nextList];
};

const mergeRawData = (prev, next) => {
  const base = prev || { financials: null, news: [], generalSearch: [] };
  if (!next) return base;
  return {
    financials: next.financials !== undefined ? next.financials : base.financials,
    news: next.news !== undefined ? next.news : base.news,
    generalSearch: next.generalSearch !== undefined ? next.generalSearch : base.generalSearch,
  };
};

const updateObject = (prev, next) => {
  if (next === null) return null;
  return next !== undefined ? next : prev;
};

// Define LangGraph channels (Annotation structure)
const StateAnnotation = Annotation.Root({
  companyName: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  symbol: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  error: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  currentStep: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "INIT",
  }),
  progressLog: Annotation({
    reducer: appendProgressLog,
    default: () => [],
  }),
  rawData: Annotation({
    reducer: mergeRawData,
    default: () => ({ financials: null, news: [], generalSearch: [] }),
  }),
  financialAnalysis: Annotation({
    reducer: updateObject,
    default: () => null,
  }),
  sentimentAnalysis: Annotation({
    reducer: updateObject,
    default: () => null,
  }),
  riskAnalysis: Annotation({
    reducer: updateObject,
    default: () => null,
  }),
  competitiveAnalysis: Annotation({
    reducer: updateObject,
    default: () => null,
  }),
  synthesizedReport: Annotation({
    reducer: updateObject,
    default: () => null,
  }),
  criticFeedback: Annotation({
    reducer: (prev, next) => {
      const base = prev || { issuesFound: false, feedback: "", attemptCount: 0 };
      if (!next) return base;
      return {
        issuesFound: next.issuesFound !== undefined ? next.issuesFound : base.issuesFound,
        feedback: next.feedback !== undefined ? next.feedback : base.feedback,
        attemptCount: next.attemptCount !== undefined ? next.attemptCount : base.attemptCount,
      };
    },
    default: () => ({ issuesFound: false, feedback: "", attemptCount: 0 }),
  }),
});

module.exports = {
  StateAnnotation,
  FullStateSchema,
  ProgressLogSchema,
  RawDataSchema,
  FinancialAnalysisSchema,
  SentimentAnalysisSchema,
  RiskAnalysisSchema,
  CompetitiveAnalysisSchema,
  SynthesizedReportSchema,
  CriticFeedbackSchema,
};
