# 🚀 PlacementAI – Deployment Guide

## Step-by-Step Deployment

---

## 1. Setup MongoDB Atlas (Free)

1. Go to https://cloud.mongodb.com
2. Create a free account → New Project → Build a Cluster (Free M0)
3. Create a database user (save username & password)
4. Add IP 0.0.0.0/0 (allow all — for development)
5. Click "Connect" → "Connect your application" → Copy the URI
6. Your URI looks like: `mongodb+srv://user:pass@cluster.mongodb.net/placementai`

---

## 2. Get Gemini API Key (Free)

1. Go to https://aistudio.google.com
2. Click "Get API Key" → Create API Key
3. Copy the key — this powers all AI features

---

## 3. Setup Cloudinary (Free)

1. Go to https://cloudinary.com → Sign up free
2. Dashboard → Copy: Cloud Name, API Key, API Secret

---

## 4. Deploy Backend to Render (Free)

1. Push your code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=<your_atlas_uri>
   JWT_SECRET=your_random_secret_here_make_it_long
   JWT_REFRESH_SECRET=another_random_secret_here
   GEMINI_API_KEY=<your_gemini_key>
   CLOUDINARY_CLOUD_NAME=<your_cloud_name>
   CLOUDINARY_API_KEY=<your_key>
   CLOUDINARY_API_SECRET=<your_secret>
   CLIENT_URL=https://your-frontend.vercel.app
   ```
6. Click "Create Web Service"
7. Wait 2-3 minutes → Your backend URL: `https://placementai-xxx.onrender.com`

---

## 5. Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_SOCKET_URL=https://your-backend.onrender.com
   ```
5. Click "Deploy"
6. Your frontend URL: `https://placementai.vercel.app`

---

## 6. Update Backend CLIENT_URL

After getting your Vercel URL, go to Render → your service → Environment → update:
```
CLIENT_URL=https://placementai.vercel.app
```

---

## 7. Create Admin Account

1. Register normally on the site
2. In MongoDB Atlas, go to Collections → users → find your document
3. Change `role: "student"` to `role: "admin"`
4. Now you have admin access at `/admin`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| AI not working | Check GEMINI_API_KEY is set correctly in Render env vars |
| File upload fails | Check Cloudinary credentials |
| Login not working | Check JWT_SECRET is set, check CORS CLIENT_URL matches your Vercel URL |
| Backend not starting | Check Render logs, verify MONGO_URI is correct |
| "Network Error" in frontend | Verify VITE_API_URL points to your Render backend URL |

---

## Free Tier Limits

| Service | Free Limit |
|---------|-----------|
| MongoDB Atlas | 512MB storage |
| Render | 750 hrs/month (spins down after 15 min inactivity — first request is slow) |
| Vercel | Unlimited for personal projects |
| Cloudinary | 25GB storage, 25GB bandwidth |
| Gemini API | 15 requests/min free |

---

## Quick Commands

```bash
# Install all dependencies
npm run install:all

# Run both backend and frontend locally
npm run dev

# Or run separately:
npm run dev:backend   # runs on port 5000
npm run dev:frontend  # runs on port 5173
```

Access locally:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/health
