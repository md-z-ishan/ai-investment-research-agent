# Multi-Agent LangGraph Architecture

InvestIQ AI relies on a modular state machine engineered with LangGraph.js to coordinate data scrapers, quantitative analysts, and edit reviews.

---

## 🧠 System Architecture Diagram

This flowchart maps the execution lifecycle, showing parallel analyst execution, Critic review retry loops, and final verdict compilation:

```mermaid
graph TD
    %% Define Nodes
    START([START]) --> Router[Router / Validator Node]
    Router -->|Public Ticker Validated| DataCollector[Data Collector Node]
    Router -->|Private / Non-existent Entity| ErrorEnd([ROUTER_ERROR])
    
    DataCollector -->|Parallel Scraping Feeds| FinAnalyst[Financial Analyst Node]
    DataCollector -->|Parallel Scraping Feeds| SentAnalyst[Sentiment Analyst Node]
    DataCollector -->|Parallel Scraping Feeds| RiskAnalyst[Risk Analyst Node]
    DataCollector -->|Parallel Scraping Feeds| CompAnalyst[Competitive Moat Node]
    
    FinAnalyst --> Synth[Thesis Synthesizer Node]
    SentAnalyst --> Synth
    RiskAnalyst --> Synth
    CompAnalyst --> Synth
    
    Synth --> Critic[Skeptical Critic Node]
    
    Critic -->|Discrepancies Found & Attempt < 2| Synth
    Critic -->|Report Verified / Attempt >= 2| Scorer[Deterministic Scoring Node]
    
    Scorer --> END([END])
    
    %% Style highlights
    classDef specialist fill:#1f2937,stroke:#6366f1,stroke-width:2px,color:#fff;
    classDef core fill:#0b0f19,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef engine fill:#111827,stroke:#10b981,stroke-width:2px,color:#fff;
    
    class FinAnalyst,SentAnalyst,RiskAnalyst,CompAnalyst specialist;
    class Router,DataCollector,Synth,Critic core;
    class Scorer engine;
```

---

## 📂 LangGraph State Annotation Channels

The shared state object acts as the Annotation Root, accumulating analyst variables as nodes converge:

| State Key | Type | Description |
| :--- | :--- | :--- |
| `companyName` | `string` | Normalized target search name entered by the investor. |
| `symbol` | `string` | Resolved market ticker symbol (e.g. `AAPL`, `NVDA`). |
| `rawData` | `object` | Raw inputs containing financials overview, news articles list, and Tavily competitors snippets. |
| `financialAnalysis` | `object` | Financial strength rating, PE/EPS metrics, and growth pros/cons. |
| `sentimentAnalysis` | `object` | Headline sentiment score, bias rating (Positive/Neutral), and pros/cons. |
| `riskAnalysis` | `object` | Risk volatility score (0-100), key flags list, and mitigation drivers. |
| `competitiveAnalysis`| `object` | Economic Moat score (0-100), peer benchmarks list, and barriers list. |
| `synthesizedReport` | `object` | Thesis summary and consolidated analyst category text blocks. |
| `criticFeedback` | `object` | Skeptic edit comments list and execution loop counter. |
| `progressLog` | `array` | Incremental streaming records displaying active agent actions. |
| `error` | `string/null` | Error intercept messages halting graph execution. |
