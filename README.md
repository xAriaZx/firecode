🔥 FireCode - Disinformation Detection System

Real-time disinformation detection and counter-narrative generation system

📋 Overview

FireCode is a comprehensive system designed to detect disinformation in real-time and generate fact-based counter-narratives. Built for hackathons and educational purposes, it demonstrates modern approaches to combating misinformation using AI and fact-checking.

🎯 Key Features

- ✅ Real-time disinformation detection using NLP and pattern matching
- ✅ Counter-narrative generation with fact-based responses
- ✅ Multi-source fact checking (Wikipedia, NewsAPI, reliable sources)
- ✅ Interactive dashboard with analytics and filtering
- ✅ Topic categorization (politics, health, science, technology, etc.)
- ✅ Severity assessment (low, medium, high risk)
- ✅ Real-time updates and monitoring

Architecture

Backend: Node.js + Express + Mongoose + MongoDB  
Frontend: React + Vite + Recharts  
AI/ML: Ollama integration with fallback pattern matching  
APIs: Wikipedia, NewsAPI, fact-checking sources

📁 Project Structure

```
firecode/
├── backend/
│   ├── models/
│   │   └── Post.js              # Enhanced post model with full schema
│   ├── routes/
│   │   └── posts.js             # Complete API endpoints
│   ├── utils/
│   │   ├── aiAnalysis.js        # AI analysis and counter-narrative generation
│   │   └── factSearch.js        # Multi-source fact checking
│   ├── middleware/
│   │   └── errorHandler.js      # Error handling middleware
│   ├── config.js                # Configuration management
│   ├── index.js                 # Express server setup
│   ├── package.json             # Backend dependencies
│   ├── .env.example             # Environment variables template
│   └── .env                     # Environment configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx    # Main dashboard component
│   │   │   ├── PostStream.jsx   # Real-time post stream
│   │   │   ├── FilterPanel.jsx  # Advanced filtering
│   │   │   ├── Analytics.jsx    # Data visualization
│   │   │   └── CounterNarratives.jsx # Counter-narrative display
│   │   ├── App.jsx              # Main app component
│   │   └── index.js             # React entry point
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite configuration
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

🚀 Quick Start

Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Ollama (for AI analysis)
- Git

Installation

1. Install Ollama
   ```bash
   # Windows (using winget)
   winget install Ollama.Ollama
   
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. Download AI Model
   ```bash
   # Start Ollama service
   ollama serve
   
   # In another terminal, pull the model
   ollama pull llama3.2
   # or try: ollama pull gemma2
   ```

3. Clone the repository
   ```bash
   git clone <repository-url>
   cd firecode
   ```

4. Setup Backend
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and Ollama settings
   ```

5. Setup Frontend
   ```bash
   cd ../frontend
   npm install
   ```

6. Start MongoDB
   ```bash
   # If using local MongoDB
   mongod
   ```

5. Run the Application
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

6. Access the Application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000


```env
MONGODB_URI=mongodb://localhost:27017/firecode
PORT=5000
NEWSAPI_KEY=your_newsapi_key_here  # Optional
OPENAI_API_KEY=your_openai_key_here  # Optional
```

```env
VITE_API_URL=http://localhost:5000/api
```

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create and analyze new post
- `GET /api/posts/:id` - Get specific post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/analytics/stats` - Get analytics data

```javascript
POST /api/posts
{
  "text": "NASA never landed on the moon. It was all filmed in a studio."
}

{
  "_id": "...",
  "text": "NASA never landed on the moon...",
  "isFake": true,
  "fakeProbability": 0.92,
  "topic": "space",
  "entity": "NASA",
  "counterNarrative": "NASA's Apollo missions are well-documented...",
  "factSources": [...],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

- Statistics Cards
   - Total posts analyzed
   - Disinformation detected
   - Counter-narratives generated
   - Detection accuracy

- Post Stream
   - Real-time post monitoring
   - Severity indicators
   - Probability visualization
   - Counter-narrative display

3. Filter Panel
   - Severity filtering (high/medium/low)
   - Topic categorization
   - Time range selection

4. Analytics
   - Risk distribution charts
   - Topic analysis
   - Hourly activity graphs
   - Quick statistics

5. Counter-Narratives
   - Fact-based responses
   - Source attribution
   - Confidence indicators
   - Copy-to-clipboard functionality

The system uses a multi-layered approach for disinformation detection:

1. Pattern Matching - Identifies common disinformation indicators
2. Topic Extraction - Categorizes content by subject matter
3. Entity Recognition - Extracts key entities and mentions
4. Sentiment Analysis - Analyzes emotional tone
5. Fact Verification - Cross-references with reliable sources
6. Counter-Narrative Generation - Creates evidence-based responses

The system includes realistic mock data for demonstration:

- Moon landing conspiracy theories
- Vaccine misinformation
- Climate change denial
- Flat Earth claims
- 5G health concerns

- [ ] Integration with real social media APIs
- [ ] Advanced ML models (BERT, GPT integration)
- [ ] Multi-language support
- [ ] User authentication and roles
- [ ] Real-time notifications
- [ ] Export and reporting features
- [ ] Mobile responsive design
- [ ] API rate limiting and caching

1. Update topic keywords in `backend/utils/aiAnalysis.js`
2. Add fact sources in `backend/utils/factSearch.js`
3. Update counter-narrative templates

1. Modify `analyzeText()` function in `aiAnalysis.js`
2. Add new pattern matching rules
3. Integrate external AI services (OpenAI, Hugging Face)

This project is created for educational and hackathon purposes. Feel free to use and modify as needed.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

For questions or issues, please create an issue in the repository.