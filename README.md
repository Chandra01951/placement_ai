# 🎓 PlacementAI – AI-Powered Student Placement Preparation Platform

A full-stack MERN application that helps students prepare for campus placements using AI.

## 🚀 Features

- **AI Resume Analyzer** – ATS score, keyword suggestions, formatting feedback
- **AI Mock Interviews** – Voice/text-based interviews with scoring
- **Coding Practice** – Online code editor with AI feedback
- **Aptitude Tests** – Timed tests with weak area analysis
- **Company Prep** – Company-wise hiring process, questions, roadmaps
- **AI Career Advisor** – Skill-based career path suggestions
- **Job Recommendations** – AI match score for jobs
- **Analytics Dashboard** – Progress charts and insights
- **AI Chatbot** – 24/7 placement assistant

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Redux Toolkit, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT + Refresh Tokens |
| AI | Google Gemini API / OpenAI API |
| Storage | Cloudinary |
| Real-time | Socket.io |
| Deployment | Vercel (Frontend) + Render (Backend) + MongoDB Atlas |

## 📁 Project Structure

```
placementai/
├── backend/          # Node.js + Express API
│   ├── config/       # DB, Cloudinary config
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, error handlers
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── utils/        # Helper functions
└── frontend/         # React app
    └── src/
        ├── components/
        ├── pages/
        ├── redux/
        └── hooks/
```

## ⚡ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/placementai.git
cd placementai
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

## 🔑 Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🌐 Deployment

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Connect repo to Vercel
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy!

### Deploy Backend to Render
1. Connect GitHub repo to Render
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables

## 👥 User Roles
- **Student** – Main user, access to all prep features
- **Admin** – Manage students, companies, questions, analytics
