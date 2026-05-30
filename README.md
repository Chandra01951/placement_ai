# PlacementAI – AI-Powered Student Placement Preparation Platform

## Overview

PlacementAI is a full-stack web application designed to help engineering students prepare for campus placements. It combines AI-powered tools with structured practice resources to give students a personalized, end-to-end preparation experience — from resume building to mock interviews and coding practice.

Live Demo: https://placement-ai-nine.vercel.app
Backend API: https://placementai-production.up.railway.app

---

## Features

### AI Resume Analyzer
- Upload PDF or DOCX resumes
- Get ATS (Applicant Tracking System) score out of 100
- Receive grammar, formatting, and keyword feedback
- AI-generated improved resume summary and skills section
- Identifies missing keywords for target roles

### AI Mock Interviews
- Text-based mock interview sessions
- Role-specific questions (Software Engineer, Data Analyst, etc.)
- AI evaluates answers and provides detailed feedback
- Scores each response on relevance, depth, and communication

### Coding Practice
- Built-in code editor with syntax highlighting
- Supports JavaScript, Python, Java, and C++
- Problems categorized by difficulty (Easy, Medium, Hard)
- Topics: Arrays, Strings, Linked Lists, Trees, Dynamic Programming
- AI-powered code analysis and feedback

### Aptitude Tests
- Timed tests covering Quantitative, Logical, and Verbal aptitude
- Automatic scoring and weak area identification
- Test history and performance tracking

### Company Preparation
- Company-wise hiring process breakdown
- Common interview questions per company
- Preparation roadmaps for top companies (Google, Amazon, TCS, Infosys, etc.)

### AI Career Advisor
- Skill-based career path recommendations
- Gap analysis between current skills and target role requirements
- Personalized learning roadmap generation

### Job Recommendations
- Browse job listings with AI match scores
- Filters by role, location, experience level
- Match percentage based on user profile and skills

### AI Chatbot
- 24/7 placement preparation assistant
- Answers questions about interviews, resumes, companies, and skills
- Context-aware conversations powered by Google Gemini

### Analytics Dashboard
- Visual progress charts (Recharts)
- Track scores across all modules over time
- Streak tracking and activity heatmap
- Placement readiness percentage

### Admin Panel
- Manage student accounts
- Add/edit companies and job listings
- Upload and manage aptitude questions
- View platform-wide analytics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux Toolkit, Tailwind CSS, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Authentication | JWT Access Tokens + Refresh Tokens |
| AI Provider | Google Gemini 1.5 Flash (primary), OpenAI GPT-3.5 (fallback) |
| File Storage | Cloudinary (resumes, profile pictures, certificates) |
| Real-time | Socket.io |
| Email | Nodemailer (SMTP) |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| Database Hosting | MongoDB Atlas (Free M0 cluster) |

---

## Project Structure

```
placementai/
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── cloudinary.js          # Cloudinary + Multer setup
│   ├── controllers/
│   │   ├── auth.controller.js     # Register, Login, JWT, Password reset
│   │   ├── resume.controller.js   # Upload, analyze, improve resume
│   │   ├── interview.controller.js# Mock interview sessions
│   │   └── ai.controller.js       # AI chatbot, career advisor
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verification, token generation
│   │   └── error.middleware.js    # Global error handler
│   ├── models/
│   │   ├── user.model.js          # User schema (student/admin)
│   │   ├── resume.model.js        # Resume + AI analysis results
│   │   ├── interview.model.js     # Interview session and feedback
│   │   ├── question.model.js      # Aptitude and coding questions
│   │   ├── company.model.js       # Company profiles
│   │   ├── job.model.js           # Job listings
│   │   └── testResult.model.js    # Aptitude test scores
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── resume.routes.js
│   │   ├── interview.routes.js
│   │   ├── coding.routes.js
│   │   ├── aptitude.routes.js
│   │   ├── company.routes.js
│   │   ├── job.routes.js
│   │   ├── ai.routes.js
│   │   ├── admin.routes.js
│   │   └── analytics.routes.js
│   ├── utils/
│   │   ├── ai.js                  # Gemini + OpenAI wrapper
│   │   └── email.js               # Nodemailer email sender
│   ├── server.js                  # Express app entry point
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── components/
│       │   └── common/
│       │       ├── DashboardLayout.jsx   # Sidebar + layout wrapper
│       │       ├── ScoreCircle.jsx       # Circular score display
│       │       └── LoadingScreen.jsx
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── Dashboard.jsx
│       │   ├── ResumeAnalyzer.jsx
│       │   ├── MockInterview.jsx
│       │   ├── CodingPractice.jsx
│       │   ├── AptitudeTests.jsx
│       │   ├── CompanyPrep.jsx
│       │   ├── CareerAdvisor.jsx
│       │   ├── JobRecommendations.jsx
│       │   ├── ChatbotPage.jsx
│       │   ├── AnalyticsPage.jsx
│       │   ├── ProfilePage.jsx
│       │   └── AdminPanel.jsx
│       ├── redux/
│       │   ├── store.js
│       │   └── slices/
│       │       ├── authSlice.js          # User auth state
│       │       └── uiSlice.js            # UI state (sidebar, theme)
│       ├── utils/
│       │   └── api.js                    # Axios instance + interceptors
│       └── App.jsx                       # Routes definition
│
├── railway.toml                          # Railway deployment config
├── nixpacks.toml                         # Build config for Railway
└── DEPLOY.md                             # Deployment guide
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get tokens |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/refresh | Refresh access token |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/forgot-password | Send password reset email |
| POST | /api/auth/reset-password/:token | Reset password |

### Resume
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/resume/upload | Upload and analyze resume |
| GET | /api/resume | Get all user resumes |
| GET | /api/resume/:id | Get single resume |
| POST | /api/resume/:id/improve | AI improve resume |
| DELETE | /api/resume/:id | Delete resume |

### AI Features
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/ai/chat | AI chatbot message |
| POST | /api/ai/career-advice | Career path advice |
| POST | /api/ai/analyze-code | Code analysis feedback |
| POST | /api/interview/start | Start mock interview |
| POST | /api/interview/answer | Submit answer + get feedback |

---

## Local Setup

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free)
- Google AI Studio account (for Gemini API key)

### Step 1 — Clone the repo
```bash
git clone https://github.com/Chandra01951/placement_ai.git
cd placement_ai
```

### Step 2 — Backend setup
```bash
cd backend
npm install --legacy-peer-deps
```

Create `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm start
```

### Step 3 — Frontend setup (new terminal)
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

```bash
npm run dev
```

Open http://localhost:5173

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://placement-ai-nine.vercel.app |
| Backend | Railway | https://placementai-production.up.railway.app |
| Database | MongoDB Atlas | cluster0.zxohx8n.mongodb.net |
| File Storage | Cloudinary | Cloud: dy54wrbwb |

### Deploy your own instance

**Backend (Railway):**
1. Push code to GitHub
2. Create new project on railway.app
3. Connect GitHub repo → set Root Directory to `backend`
4. Add all environment variables in Variables tab
5. Generate a public domain in Settings → Networking

**Frontend (Vercel):**
1. Create new project on vercel.com
2. Import GitHub repo → set Root Directory to `frontend`
3. Add environment variables:
   - `VITE_API_URL` = your Railway backend URL + `/api`
   - `VITE_SOCKET_URL` = your Railway backend URL
4. Deploy

---

## User Roles

### Student (default)
- Access to all preparation modules
- Personal dashboard with progress tracking
- Resume upload and AI analysis
- Mock interview sessions
- Coding practice with AI feedback
- Aptitude test taking
- Job browsing and recommendations
- AI chatbot access

### Admin
- All student features
- Manage users (view, promote, deactivate)
- Add/edit/delete companies and job listings
- Manage aptitude question bank
- View platform-wide analytics
- Promote users to admin role

To make a user admin: go to MongoDB Atlas → Collections → users → find the user document → change `role: "student"` to `role: "admin"`.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| PORT | Yes | Server port (5000) |
| MONGO_URI | Yes | MongoDB Atlas connection string |
| JWT_SECRET | Yes | Secret for signing access tokens |
| JWT_REFRESH_SECRET | Yes | Secret for signing refresh tokens |
| GEMINI_API_KEY | Yes | Google Gemini API key (get free at aistudio.google.com) |
| OPENAI_API_KEY | No | OpenAI API key (fallback AI provider) |
| CLOUDINARY_CLOUD_NAME | Yes | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Yes | Cloudinary API key |
| CLOUDINARY_API_SECRET | Yes | Cloudinary API secret |
| EMAIL_USER | No | Gmail address for sending emails |
| EMAIL_PASS | No | Gmail app password |
| CLIENT_URL | Yes | Frontend URL (for CORS and email links) |
| NODE_ENV | Yes | development or production |

---

## Built With

- React 18 + Vite
- Redux Toolkit
- Tailwind CSS
- Express.js
- Mongoose
- Socket.io
- Google Gemini AI
- Cloudinary
- JWT Authentication
- Nodemailer
- Recharts
