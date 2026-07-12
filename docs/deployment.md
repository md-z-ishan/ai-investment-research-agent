# 🌐 Deployment Guide (Render, Railway, Vercel)

This guide documents the procedures for deploying the **InvestIQ AI** platform (Express Backend + Vite React Frontend) to production hosting providers.

---

## 🛠️ Option 1: Render Infrastructure-as-Code (Recommended)

Render allows you to deploy the entire project monorepo using the pre-configured [render.yaml](file:///Users/mdzishan/Desktop/InvestIQ%20AI%20By%20Zishan/render.yaml) blueprint file at the root.

### Deployment Steps:
1. Push your repository to GitHub / GitLab.
2. Go to the **Render Dashboard** and click **New > Blueprint**.
3. Select your repository. Render will automatically parse the [render.yaml](file:///Users/mdzishan/Desktop/InvestIQ%20AI%20By%20Zishan/render.yaml) file and provision:
   - A Node.js Web Service for the Backend.
   - A Static Site for the Frontend.
4. Render will prompt you to enter the environment variables:
   - `GEMINI_API_KEY` (Your Google Gemini key)
   - `TAVILY_API_KEY` (Your Tavily AI search key)
   - `ALPHA_VANTAGE_API_KEY` (Your Alpha Vantage financials key)
   - `NEWS_API_KEY` (Your NewsAPI key)
   - `GNEWS_API_KEY` (Your GNews key)
5. After the backend service builds, copy its domain URL (e.g. `https://investiq-backend.onrender.com`).
6. Navigate to the Frontend Static Site settings in Render, update the `VITE_API_URL` environment variable to point to your backend Render URL, and trigger a redeploy.

---

## ⚡ Option 2: Railway Deployment

Railway is excellent for deploying Node.js apps with minimal configuration.

### 1. Backend Setup:
1. Click **New Project** on Railway and select your GitHub repository.
2. Under **Root Directory**, set it to `Backend`.
3. In **Variables**, add all keys from `/Backend/.env.example`:
   - `PORT` = `5001` (Railway binds to `PORT` automatically, but setting it explicitly is recommended).
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = Set to your React App's URL.
   - `GEMINI_API_KEY` = Your Gemini Key.
   - `TAVILY_API_KEY`, `ALPHA_VANTAGE_API_KEY`, `NEWS_API_KEY`, `GNEWS_API_KEY`.
4. Railway will automatically detect `package.json` and launch the server using `npm start`.

### 2. Frontend Setup:
1. Click **New Project** or add a new service in your existing project, selecting the same repository.
2. Under **Root Directory**, set it to `Frontend/client`.
3. Add the following build configurations:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** static host mapping (Railway defaults to static server routing, or you can host it as a Web Service).
4. Add the environment variable:
   - `VITE_API_URL` = Your Backend Railway service URL.

---

## 🚀 Option 3: Split Deployment (Vercel + Railway)

For optimal load speeds, host the React frontend on **Vercel** and the Express backend on **Railway** or **Render**.

### Frontend on Vercel:
1. Import the repository into **Vercel**.
2. Set the **Framework Preset** to `Vite`.
3. Set the **Root Directory** to `Frontend/client`.
4. Set the **Environment Variables**:
   - `VITE_API_URL` = `https://your-backend-service.railway.app`
5. Click **Deploy**. Vercel will build the assets and handle routing for the static app.
