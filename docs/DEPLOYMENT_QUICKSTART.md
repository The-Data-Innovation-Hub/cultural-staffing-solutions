# 🚀 Quick Start Deployment Guide

## Prerequisites Checklist
- [ ] GitHub account with repository access
- [ ] Neon PostgreSQL database (✅ Already configured)
- [ ] OpenAI API key

## 15-Minute Deployment

### Step 1: Sign Up for Services (5 minutes)

1. **Vercel** (Frontend hosting):
   - Go to https://vercel.com
   - Click "Sign Up" → "Continue with GitHub"
   - Authorize Vercel to access your GitHub account

2. **Railway** (Backend hosting):
   - Go to https://railway.app
   - Click "Login" → "Login with GitHub"
   - Authorize Railway to access your GitHub account

### Step 2: Deploy Backend (5 minutes)

1. **In Railway**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `The-Data-Innovation-Hub/cultural-staffing-solutions`
   - Railway will detect the monorepo

2. **Configure Service**:
   - Click "Settings"
   - Set **Root Directory**: `backend`
   - Set **Build Command**: `npm run build`
   - Set **Start Command**: `npm start`

3. **Add Environment Variables**:
   - Click "Variables" tab
   - Add these variables:
     ```
     DATABASE_URL=<your-neon-database-url>
     SESSION_SECRET=<generate-random-32-char-string>
     JWT_SECRET=<generate-random-48-char-string>
     NODE_ENV=production
     FRONTEND_URL=https://your-app.vercel.app
     ```
   - To generate SESSION_SECRET and JWT_SECRET, run locally:
     ```bash
     # Generate SESSION_SECRET (minimum 32 characters)
     openssl rand -base64 32

     # Generate JWT_SECRET (minimum 48 characters)
     openssl rand -base64 48
     ```
   - **⚠️ CRITICAL**: The application will NOT start without a valid JWT_SECRET (minimum 32 characters)

4. **Deploy**:
   - Railway auto-deploys
   - **Copy your backend URL** (e.g., `https://cultural-staffing-backend.railway.app`)
   - Save this URL for Step 3

### Step 3: Deploy Frontend (5 minutes)

1. **In Vercel**:
   - Click "Add New..." → "Project"
   - Select `The-Data-Innovation-Hub/cultural-staffing-solutions`

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave blank, use root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add these variables:
     ```
     VITE_API_URL=https://your-backend.railway.app/api
     VITE_OPENAI_API_KEY=your_openai_api_key
     ```
   - Replace `your-backend.railway.app` with your Railway URL from Step 2

4. **Deploy**:
   - Click "Deploy"
   - Vercel builds and deploys (takes 1-2 minutes)
   - **Copy your frontend URL** (e.g., `https://cultural-staffing.vercel.app`)

### Step 4: Update Backend CORS

1. **Back in Railway**:
   - Go to your backend service → "Variables"
   - Update `FRONTEND_URL` to your Vercel URL
   - Railway will auto-redeploy

### Step 5: Test Your Deployment

1. **Test Backend**:
   ```bash
   # Health check
   curl https://your-backend.railway.app/api/health

   # Swagger docs
   open https://your-backend.railway.app/api-docs
   ```

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try logging in
   - Navigate to Admin → API Documentation
   - Verify Swagger UI loads

3. **Test Analytics Endpoints**:
   - In Swagger UI, try GET `/api/analytics/dashboard`
   - Should return data (or empty arrays if no data yet)

---

## ✅ You're Done!

Your application is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **API Docs**: `https://your-backend.railway.app/api-docs`

---

## 🔄 Automatic Deployments

Both platforms auto-deploy on git push:

```bash
git add .
git commit -m "Update application"
git push origin main
```

- Vercel: Auto-deploys frontend
- Railway: Auto-deploys backend

---

## 🌐 Add Custom Domain (Optional)

### Frontend Domain (Vercel)
1. Vercel → Your Project → Settings → Domains
2. Add domain: `app.yourcompany.com`
3. Update DNS records as shown
4. SSL auto-configured

### Backend Domain (Railway)
1. Railway → Your Service → Settings → Networking
2. Add domain: `api.yourcompany.com`
3. Update DNS records as shown
4. SSL auto-configured

Then update environment variables to use custom domains.

---

## 🆘 Troubleshooting

### Issue: "CORS Error"
**Fix**: Ensure `FRONTEND_URL` in Railway exactly matches your Vercel URL

### Issue: "Database Connection Failed"
**Fix**:
1. Check `DATABASE_URL` in Railway
2. Ensure Neon database is active (not paused)
3. Test connection: `psql $DATABASE_URL`

### Issue: "API 404 Error"
**Fix**: Ensure `VITE_API_URL` in Vercel includes `/api` path

### Issue: "Swagger Not Loading"
**Fix**:
1. Check backend is running: `curl https://your-backend.railway.app/api/health`
2. Check Swagger endpoint: `curl https://your-backend.railway.app/api-docs.json`

---

## 📊 Free Tier Limits

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains

**Railway Free Tier:**
- ✅ $5 credit/month (~500 hours)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ No included database (use Neon)

**Neon Free Tier:**
- ✅ 0.5 GB storage
- ✅ Unlimited compute time
- ✅ Auto-suspend after inactivity

---

## 🎯 Next Steps

After deployment:
- [ ] Set up GitHub Actions for CI/CD (workflows already created!)
- [ ] Configure monitoring and alerts
- [ ] Add custom domains
- [ ] Set up database backups
- [ ] Configure email notifications

---

## 📝 Environment Variables Reference

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.railway.app/api
VITE_OPENAI_API_KEY=sk-...
```

### Backend (Railway)
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=<32-char-random-string>
JWT_SECRET=<48-char-random-string>
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

---

**Need help?** See the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
