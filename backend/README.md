FireCode Backend

Core Files
- `index.js` – starts the Express server
- `models/Post.js` – MongoDB schema for posts
- `routes/posts.js` – REST routes
- `middleware/errorHandler.js` – error handler
- `utils/aiAnalysis.js` – Ollama (`gamma3`) integration for analysis + counter-narrative
- `utils/factSearch.js` – fact search (Wikipedia + mock sources)
- `config.js` – centralised env variables (`MONGODB_URI`, `PORT`, `OLLAMA_URL`, `OLLAMA_MODEL`)

Quick Start
1. Install dependencies: `npm install`
2. Copy `.env.example` → `.env` and, if needed, adjust values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/firecode
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=gamma3
   ```
3. Make sure Ollama is running and the `gamma3` model is pulled: `ollama pull gamma3`
4. Start the server: `npm start`
5. (Optional) format code: `npm run format`
