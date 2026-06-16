# 🔍 CodeSense — AI-Powered Code Review Tool

<div align="center">

![CodeSense](https://img.shields.io/badge/CodeSense-AI%20Code%20Review-6366f1?style=for-the-badge&logo=openai&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=flat-square&logo=python&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)

**A full-stack AI code review platform that analyzes your code for bugs, style, performance, and security issues.**

</div>

---

## ✨ Features

- 🖊️ **Browser-based Code Editor** — Powered by CodeMirror 6 with syntax highlighting for 6+ languages
- 🤖 **AI-Powered Reviews** — Leverages OpenAI GPT-4o-mini for intelligent code analysis
- 🐍 **Python Preprocessing** — AST parsing and linting before AI review for richer feedback
- 🔐 **Secure Authentication** — JWT + bcrypt with persistent session management
- 🛡️ **Rate Limiting** — Prevents API abuse with configurable request limits
- 📊 **Review Dashboard** — Track your code quality scores over time
- 🎨 **Premium Dark UI** — Glassmorphism design with smooth animations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, CodeMirror 6, React Router, Axios |
| **Backend** | Node.js, Express, Mongoose, JWT, bcrypt |
| **Preprocessor** | Python 3, Flask, AST module |
| **Database** | MongoDB |
| **AI** | OpenAI GPT-4o-mini API |

## 📁 Project Structure

```
CodeSense/
├── frontend/          # React + Vite frontend
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route pages
│       ├── context/      # React context (auth)
│       └── utils/        # API utilities
├── backend/           # Node.js + Express API
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth & rate limiting
│   ├── models/          # Mongoose schemas
│   └── routes/          # API routes
└── python-service/    # Python Flask preprocessor
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- OpenAI API Key (optional — works with mock reviews without one)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/CodeSense.git
cd CodeSense

# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install

# Python service
cd ../python-service
pip install -r requirements.txt
```

### 2. Configure Environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/codesense
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
PYTHON_SERVICE_URL=http://localhost:5050
```

### 3. Start All Services

```bash
# Terminal 1 — Python Preprocessor
cd python-service && python app.py

# Terminal 2 — Backend API
cd backend && npm run dev

# Terminal 3 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user profile |
| POST | `/api/review` | ✅ | Submit code for AI review |
| GET | `/api/review/history` | ✅ | Get user's past reviews |
| GET | `/api/review/:id` | ✅ | Get single review |

## 🔒 Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens with **7-day expiry**
- **Rate limiting**: 10 reviews / 15 min, 100 API calls / 15 min
- Input validation on all endpoints
- CORS restricted to frontend origin

## 📄 License

MIT License — feel free to use this for your portfolio!
