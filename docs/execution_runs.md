# Agent Execution Runs Documentation

This document logs actual research trials executed across the LangGraph multi-agent pipeline, demonstrating routing validation, parallel metrics scraping, syntheses, and scoring indices.

---

## 🍏 Trial 1: Apple Inc. (AAPL)

- **Target Query:** "Apple"
- **Ticker Resolved:** `AAPL`
- **Scoring Output:**
  - **Final Rating:** `84 / 100`
  - **Verdict Action:** `INVEST`
  - **Confidence Rating:** `90%`

### Streamed Agent Stepper Logs:
```json
[
  { "node": "Router", "message": "Routing and validating request for company: \"Apple\"..." },
  { "node": "Router", "message": "Company validated. Ticker resolved to: AAPL. Routing to Data Collector." },
  { "node": "Data Collector", "message": "Fetching real-time financials, news and web context for: \"Apple\"..." },
  { "node": "Data Collector", "message": "Financials resolved from Yahoo Finance. Fetched 2 articles and competitor profiles." },
  { "node": "Competitive Analyst", "message": "Analyzing moat structure and benchmarking against major competitors for AAPL..." },
  { "node": "Competitive Analyst", "message": "Competitive analysis complete for AAPL. Moat Score: 90/100." },
  { "node": "Financial Analyst", "message": "Analyzing balance sheet and income statement metrics for AAPL..." },
  { "node": "Financial Analyst", "message": "Financial analysis complete for AAPL. Score: 88/100." },
  { "node": "Risk Analyst", "message": "Conducting risk assessment across regulatory, market, and balance sheet categories for AAPL..." },
  { "node": "Risk Analyst", "message": "Risk analysis complete for AAPL. Risk Score: 25/100." },
  { "node": "Sentiment Analyst", "message": "Analyzing recent news headlines and sentiment context for AAPL..." },
  { "node": "Sentiment Analyst", "message": "Sentiment analysis complete for AAPL. Rating: Positive (80/100)." },
  { "node": "Synthesizer", "message": "Synthesizing analyst insights and compiling unified investment report for AAPL..." },
  { "node": "Synthesizer", "message": "Unified report synthesis complete. Routing to Critic for validation." },
  { "node": "Critic", "message": "Critic node verifying report consistency for AAPL (Verification Attempt #1)..." },
  { "node": "Critic", "message": "Verification successful. Proceeding to final scoring." },
  { "node": "Scoring Engine", "message": "Determining final investment recommendation index for AAPL..." },
  { "node": "Scoring Engine", "message": "Analysis finalized. Verdict: INVEST (84/100), Confidence: 90%." }
]
```

---

## 🟢 Trial 2: Nvidia Corporation (NVDA)

- **Target Query:** "Nvidia"
- **Ticker Resolved:** `NVDA`
- **Scoring Output:**
  - **Final Rating:** `88 / 100`
  - **Verdict Action:** `INVEST`
  - **Confidence Rating:** `95%`

### Streamed Agent Stepper Logs:
```json
[
  { "node": "Router", "message": "Routing and validating request for company: \"Nvidia\"..." },
  { "node": "Router", "message": "Company validated. Ticker resolved to: NVDA. Routing to Data Collector." },
  { "node": "Data Collector", "message": "Fetching real-time financials, news and web context for: \"Nvidia\"..." },
  { "node": "Data Collector", "message": "Financials resolved from Yahoo Finance. Fetched 2 articles and competitor profiles." },
  { "node": "Competitive Analyst", "message": "Analyzing moat structure and benchmarking against major competitors for NVDA..." },
  { "node": "Competitive Analyst", "message": "Competitive analysis complete for NVDA. Moat Score: 94/100." },
  { "node": "Financial Analyst", "message": "Analyzing balance sheet and income statement metrics for NVDA..." },
  { "node": "Financial Analyst", "message": "Financial analysis complete for NVDA. Score: 92/100." },
  { "node": "Risk Analyst", "message": "Conducting risk assessment across regulatory, market, and balance sheet categories for NVDA..." },
  { "node": "Risk Analyst", "message": "Risk analysis complete for NVDA. Risk Score: 45/100." },
  { "node": "Sentiment Analyst", "message": "Analyzing recent news headlines and sentiment context for NVDA..." },
  { "node": "Sentiment Analyst", "message": "Sentiment analysis complete for NVDA. Rating: Very Positive (95/100)." },
  { "node": "Synthesizer", "message": "Synthesizing analyst insights and compiling unified investment report for NVDA..." },
  { "node": "Synthesizer", "message": "Unified report synthesis complete. Routing to Critic for validation." },
  { "node": "Critic", "message": "Critic node verifying report consistency for NVDA (Verification Attempt #1)..." },
  { "node": "Critic", "message": "Verification successful. Proceeding to final scoring." },
  { "node": "Scoring Engine", "message": "Determining final investment recommendation index for NVDA..." },
  { "node": "Scoring Engine", "message": "Analysis finalized. Verdict: INVEST (88/100), Confidence: 95%." }
]
```

---

## 🟡 Trial 3: Tesla Inc. (TSLA)

- **Target Query:** "Tesla"
- **Ticker Resolved:** `TSLA`
- **Scoring Output:**
  - **Final Rating:** `62 / 100`
  - **Verdict Action:** `WATCH`
  - **Confidence Rating:** `82%`

### Streamed Agent Stepper Logs:
```json
[
  { "node": "Router", "message": "Routing and validating request for company: \"Tesla\"..." },
  { "node": "Router", "message": "Company validated. Ticker resolved to: TSLA. Routing to Data Collector." },
  { "node": "Data Collector", "message": "Fetching real-time financials, news and web context for: \"Tesla\"..." },
  { "node": "Data Collector", "message": "Financials resolved from Yahoo Finance. Fetched 2 articles and competitor profiles." },
  { "node": "Competitive Analyst", "message": "Analyzing moat structure and benchmarking against major competitors for TSLA..." },
  { "node": "Competitive Analyst", "message": "Competitive analysis complete for TSLA. Moat Score: 72/100." },
  { "node": "Financial Analyst", "message": "Analyzing balance sheet and income statement metrics for TSLA..." },
  { "node": "Financial Analyst", "message": "Financial analysis complete for TSLA. Score: 62/100." },
  { "node": "Risk Analyst", "message": "Conducting risk assessment across regulatory, market, and balance sheet categories for TSLA..." },
  { "node": "Risk Analyst", "message": "Risk analysis complete for TSLA. Risk Score: 65/100." },
  { "node": "Sentiment Analyst", "message": "Analyzing recent news headlines and sentiment context for TSLA..." },
  { "node": "Sentiment Analyst", "message": "Sentiment analysis complete for TSLA. Rating: Mixed (48/100)." },
  { "node": "Synthesizer", "message": "Synthesizing analyst insights and compiling unified investment report for TSLA..." },
  { "node": "Synthesizer", "message": "Unified report synthesis complete. Routing to Critic for validation." },
  { "node": "Critic", "message": "Critic node verifying report consistency for TSLA (Verification Attempt #1)..." },
  { "node": "Critic", "message": "Verification successful. Proceeding to final scoring." },
  { "node": "Scoring Engine", "message": "Determining final investment recommendation index for TSLA..." },
  { "node": "Scoring Engine", "message": "Analysis finalized. Verdict: WATCH (62/100), Confidence: 82%." }
]
```
