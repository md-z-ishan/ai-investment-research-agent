# 🚀 InvestIQ AI - Multi-Agent Investment Research Platform

An institutional-grade, AI-driven financial research platform that orchestrates an advanced multi-agent LangGraph workflow. Using real-time financial market metrics, news feeds, and Google Gemini AI, it generates deterministic investment verdicts (`INVEST` / `WATCH` / `PASS`) with confidence scores, opposing thesis toggles, follow-up Q&A copilot capabilities, and interactive data visualisations.

---

## 🎨 Architectural Overview

```
                      ┌────────────────────────┐
                      │     React Client       │
                      └───────────┬────────────┘
                                  │
                       SSE Stream (EventSource)
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │    Express Server      │
                      └───────────┬────────────┘
                                  │
                         [24h LRU Cache Check]
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │   LangGraph Workflow   │
                      └───────────┬────────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │   Router Agent    │ (Ticker Validation)
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │  Data Collector   │ (Parallel Fetch: Alpha Vantage,
                        └─────────┬─────────┘  NewsAPI, Tavily Search)
                                  │
            ┌─────────────────────┼─────────────────────┬─────────────────────┐
            ▼                     ▼                     ▼                     ▼
┌───────────────────────┐ ┌───────────────┐ ┌───────────────────────┐ ┌───────────────┐
│   Financial Analyst   │ │   Sentiment   │ │     Risk Analyst      │ │  Competitive  │
│                       │ │    Analyst    │ │                       │ │    Analyst    │
└───────────┬───────────┘ └───────┬───────┘ └───────────┬───────────┘ └───────┬───────┘
            │                     │                     │                     │
            └─────────────────────┼─────────────────────┴─────────────────────┘
                                  │ (Parallel Convergence)
                                  ▼
                        ┌───────────────────┐
                        │    Synthesizer    │ (Thesis Draft)
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
    ┌──────────────────►│   Skeptical Critic│ (Contradiction Audit)
    │                   └─────────┬─────────┘
    │ (Retry Loop Back)           │
    │ └───────────────────────────┤ (Approved?)
    │                             │
    ▼                             ▼
┌───────────────────┐     ┌───────────────────┐
│  Devil's Advocate │     │  Scoring Engine   │ (Deterministic Index Grade)
│  (Thesis Inversion│     └─────────┬─────────┘
└───────────────────┘               │
                                    ▼
                          ┌───────────────────┐
                          │   RAG Chat Box    │ (Interactive Follow-up)
                          └───────────────────┘
```

---

## ✨ Standout Features

### 1. Multi-Agent Reasoning Graph (LangGraph)
- **Router Agent:** Validates entity queries, maps ticker symbols, and intercepts private company lookups.
- **Parallel Specialists:** Employs 4 domain agents auditing Financials, Sentiment, Risk, and Competition Moats concurrently.
- **Synthesizer & Critic Loop:** Consolidates analysis briefs and triggers a correction feedback cycle (max 1 retry loop) if contradictions are detected.
- **Scoring Engine:** Deterministically calculates a weighted final index: 35% Financials, 25% Sentiment, 20% Safety (100 - Risk), and 20% Competitive Moat.

### 2. 😈 Devil's Advocate Toggle (Thesis Inversion)
- Flipping the verdict card triggers an animated keyframe shift to reveal the **Opposing Thesis**.
- This section aggregates critic node check warnings and high-severity risk parameters to present the worst-case scenario.

### 3. 💬 InvestIQ AI Copilot (RAG Chat Box)
- Enables interactive follow-up Q&A directly on the results screen.
- User questions are processed in real-time, grounded strictly in the generated report metrics and news feeds.

### 4. Live Server-Sent Events (SSE) Streaming
- Direct streaming of agent state logs (`[Router] Mapping ticker...`, `[Financial Analyst] Evaluating EPS...`) to the frontend for a smooth, high-fidelity loading experience.

### 5. Smart LRU & 24h Expiry Caching
- Backend caches completed company reports for 24 hours. Cached queries are served instantly, streaming mocked timeline sequences quickly for optimal user experience.

### 6. Premium Responsive Dashboard
- Frosted glassmorphism panels using tailored HSL color indicators (Emerald green for `INVEST`, Orange for `WATCH`, Rose red for `PASS`).
- **Vector Benchmarks:** Recharts-powered Radar Charts mapping agent scorecard dimensions.
- Citations log indexing references and a collapsible Raw Payload inspector.

---

## ⚙️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Recharts, Framer Motion, React Icons
- **Backend:** Node.js, Express, LangGraph (`@langchain/langgraph`), Google Gemini SDK (`@google/genai`)
- **Data APIs:** Alpha Vantage, NewsAPI, Tavily Search, Yahoo Finance, GNews

---

## 🔑 Environment Variables

### Backend Configuration (`/Backend/.env`)
```env
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Core APIs (Google AI Studio & Tavily Search)
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_search_api_key

# Secondary Data Sources
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
NEWS_API_KEY=your_news_api_key
GNEWS_API_KEY=your_gnews_api_key
```

### Frontend Configuration (`/Frontend/client/.env`)
```env
VITE_API_URL=http://localhost:5001
```

---

## 🚀 Local Installation

### 1. Start Backend Server
```bash
cd Backend
npm install
npm run dev
```
Runs at `http://localhost:5001`.

### 2. Start Frontend Server
```bash
cd Frontend/client
npm install
npm run dev
```
Runs at `http://localhost:5173`.

### 3. Running Unit Tests
```bash
cd Backend
npm test
```

---

## 📚 Extended Documentation
For deep-dive architecture details, actual execution runs, and cloud hosting setup:
- **[Architecture Design](file:///Users/mdzishan/Desktop/InvestIQ%20AI%20By%20Zishan/docs/architecture.md):** Detail maps of the LangGraph node network and state channels.
- **[Execution Runs Logs](file:///Users/mdzishan/Desktop/InvestIQ%20AI%20By%20Zishan/docs/execution_runs.md):** Actual execution streams and scoring outputs for AAPL, NVDA, and TSLA.
- **[Deployment Configurations](file:///Users/mdzishan/Desktop/InvestIQ%20AI%20By%20Zishan/docs/deployment.md):** Step-by-step setup guides for Render, Railway, and Vercel hosting.

---

## 👨‍💻 Authorship
Redesigned and optimized for high-performance investment analysis by Ram Kumar & Pair-Programmed with Antigravity AI.
