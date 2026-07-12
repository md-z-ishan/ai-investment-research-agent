# 🤖 LLM Chat Session Logs & AI Assistance Transparency

This document is included for full transparency — as required by the assignment bonus criteria.
It outlines where and how LLM tools (Claude, ChatGPT) were consulted during this project.

> ⚠️ No API keys, passwords, or sensitive credentials are included in this document.

---

## 1. Architecture Planning Stage

### Question Asked to ChatGPT (GPT-4o):
> *"I want to build a multi-agent investment research system. Should I use LangChain agents or LangGraph? What are the trade-offs?"*

**AI Response Summary:**
- LangChain agents are simpler for linear chains; LangGraph gives you explicit state machine control
- For parallel analyst nodes + a critic loop, LangGraph's `StateGraph` is a better fit
- Suggested using `addNode` + `addEdge` to wire specialist agents

**My Decision:**  
I went with LangGraph after reading both options. The critic retry loop and parallel node convergence made LangGraph the clear choice — I designed the graph topology myself using the state channel concept.

---

## 2. SSE Streaming Implementation

### Question Asked to Claude:
> *"How do I stream LangGraph node execution events to a React frontend using Server-Sent Events?"*

**AI Response Summary:**
- Use `res.setHeader('Content-Type', 'text/event-stream')` on Express
- Flush events using `res.write('data: ...\n\n')`
- On the frontend, use `EventSource` API to receive the stream

**My Decision:**  
I implemented the full SSE pipeline myself. The AI gave me the general pattern, but I wrote all the node-level event emission logic, the frontend `useResearchStream` hook, and the progress parsing logic independently.

---

## 3. Scoring Algorithm Design

### Question Asked to ChatGPT:
> *"What weighting system makes sense for an investment scoring index combining financials, sentiment, risk, and competitive moat?"*

**AI Response Summary:**
- Academic research typically weights financials heaviest (~35%)
- Sentiment is a leading indicator, worth ~20–25%
- Risk should be an inverse penalty (~20%)
- Competitive moat (qualitative) ~20%

**My Decision:**  
I validated this against standard CFA framework references and decided on: **35% Financial + 25% Sentiment + 20% Safety + 20% Moat**. The actual weighted calculation formula in `buildGraph.js` was written by me.

---

## 4. CORS & Deployment Configuration

### Question Asked to Claude:
> *"What's the best way to configure CORS for a Node.js/Express API deployed on Render with a Vercel frontend?"*

**AI Response Summary:**
- Allow the specific Vercel origin using `cors({ origin: [...] })`
- Don't use wildcard `*` in production with credentials
- Use environment variables for origin configuration

**My Decision:**  
I applied this in `server.js` with a custom origin-matching function that supports comma-separated origins from env, plus hardcoded fallback for the Vercel URL.

---

## 5. Devil's Advocate Toggle (Frontend)

### Question Asked to Claude:
> *"How do I implement a flip-card animation in React with CSS keyframes that shows a counter-thesis on the back?"*

**AI Response Summary:**
- Use `perspective` + `rotateY(180deg)` CSS 3D transform
- Manage open/closed state with React `useState`
- Use `backface-visibility: hidden` for clean flip

**My Decision:**  
I designed the full flip card UI, chose what content goes on the "back" (opposing thesis from critic node), and styled it to match the glassmorphism design system.

---

## 6. RAG Copilot Chat Box

### Question Asked to ChatGPT:
> *"How do I ground an LLM Q&A chat to a specific research report context — like only answer questions about this specific company report?"*

**AI Response Summary:**
- Inject the report data as a system prompt prefix
- Use instruction like "Only answer based on the following research context"
- Return a polite "out of scope" response for unrelated questions

**My Decision:**  
I implemented this in `chatController.js` with a structured context block that injects the full synthesized report, financials, risk analysis, and sentiment data as a grounding context into the Gemini prompt.

---

## Summary

| Area | AI Tool Used | What I Did Myself |
|---|---|---|
| LangGraph architecture | ChatGPT (decision guidance) | Full graph topology, state channels, node logic |
| SSE Streaming | Claude (API pattern) | Hook, event parsing, error fallback |
| Scoring algorithm | ChatGPT (weighting research) | Formula, normalization, confidence bands |
| CORS setup | Claude (configuration) | Multi-origin resolver, env fallback |
| Flip card animation | Claude (CSS pattern) | Design, content mapping, integration |
| RAG Chat grounding | ChatGPT (prompt strategy) | Context injection, API wiring, error handling |

---

*Prepared by: **MD ZISHAN***  
*Date: July 2026*
