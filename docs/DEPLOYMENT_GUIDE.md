# Deployment Guide - Cultural Staffing Solutions

## 📋 Overview

This guide covers deploying the full-stack application with:
- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + PostgreSQL
- **Database**: Neon PostgreSQL (already configured)

---

## 🎯 Recommended Deployment Strategy

### Option 1: Vercel (Frontend) + Railway (Backend) ⭐ Recommended
- **Best for**: Quick deployment, automatic deployments, free tier
- **Frontend**: Vercel (Free tier: unlimited bandwidth, automatic HTTPS)
- **Backend**: Railway (Free tier: $5 credit/month, PostgreSQL included)
- **Database**: Neon PostgreSQL (already configured)

### Option 2: Azure Static Web Apps (Full Stack)
- **Best for**: Enterprise deployment, Azure integration
- **Includes**: Frontend hosting, serverless API, automatic CI/CD
- **Database**: Neon PostgreSQL (external)

### Option 3: Render (Full Stack)
- **Best for**: Simple all-in-one deployment
- **Frontend & Backend**: Render (Free tier available)
- **Database**: Neon PostgreSQL (already configured)

---

## 🚀 Deployment Instructions - Vercel + Railway (Recommended)

### Prerequisites
- [x] GitHub account
- [x] Neon database already configured
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Railway account (sign up at https://railway.app)

---

## Part 1: Backend Deployment (Railway)

### Step 1: Prepare Backend for Deployment

1. **Add a `Procfile` for Railway** (if needed):
```bash
web: npm start
```

2. **Verify `package.json` scripts** (already configured):
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

3. **Add a `.railwayignore` file**:
```
node_modules/
*.log
.env
.env.local
test-*.sh
```

### Step 2: Deploy to Railway

1. **Go to [Railway.app](https://railway.app)** and sign in with GitHub

2. **Create a New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select `The-Data-Innovation-Hub/cultural-staffing-solutions`

3. **Configure Backend Service**:
   - Railway will detect the monorepo
   - Set **Root Directory**: `/backend`
   - Set **Build Command**: `npm run build`
   - Set **Start Command**: `npm start`

4. **Add Environment Variables** in Railway:
   ```
   DATABASE_URL=your_neon_database_url
   SESSION_SECRET=your_secure_random_string_here
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**:
   - Railway will automatically build and deploy
   - You'll get a URL like: `https://your-app.railway.app`

6. **Note the Backend URL** for frontend configuration

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Update environment variables** for production:

Create `.env.production` in the root:
```env
VITE_API_URL=https://your-backend.railway.app/api
VITE_OPENAI_API_KEY=your_openai_key_here
```

2. **Verify `package.json` scripts** (already configured):
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign in with GitHub

2. **Import Your Repository**:
   - Click "Add New..." → "Project"
   - Select `The-Data-Innovation-Hub/cultural-staffing-solutions`

3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./ ` (leave as root, NOT `/backend`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables** in Vercel:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_OPENAI_API_KEY=your_openai_key_here
   ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

After deployment, update Railway backend environment variables:
```
FRONTEND_URL=https://your-app.vercel.app
```

This ensures the backend accepts requests from your frontend domain.

---

## Part 3: Database Configuration (Already Done ✅)

Your Neon PostgreSQL database is already set up! Just ensure:

1. **Connection String** is added to Railway environment variables
2. **SSL Mode** is set to `require` (already in your connection string)
3. **All 14 analytics tables** are created (✅ completed)

---

## 🔄 Automatic Deployments (CI/CD)

Both Vercel and Railway automatically deploy when you push to GitHub:

1. **Push to `main` branch** → Automatically deploys to production
2. **Push to other branches** → Creates preview deployments
3. **Pull Requests** → Automatic preview URLs for testing

---

## 🌐 Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to your project → Settings → Domains
2. Add your custom domain (e.g., `app.culturalstaffing.com`)
3. Update DNS records as instructed
4. Vercel automatically provisions SSL certificates

### For Backend (Railway):
1. Go to your service → Settings → Networking
2. Add custom domain (e.g., `api.culturalstaffing.com`)
3. Update DNS records as instructed
4. Railway automatically provisions SSL certificates

---

## 🔐 Production Environment Variables Checklist

### Backend (Railway)
- [x] `DATABASE_URL` - Your Neon PostgreSQL connection string
- [ ] `SESSION_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `FRONTEND_URL` - Your Vercel frontend URL

### Frontend (Vercel)
- [ ] `VITE_API_URL` - Your Railway backend URL + `/api`
- [ ] `VITE_OPENAI_API_KEY` - Your OpenAI API key

---

## 🧪 Testing Deployment

After deployment, test these endpoints:

### Backend Health Check
```bash
curl https://your-backend.railway.app/api/health
```

### Swagger Documentation
Visit: `https://your-backend.railway.app/api-docs`

### Frontend
Visit: `https://your-app.vercel.app`

### Test Analytics Endpoints
```bash
# Replace with your backend URL
curl https://your-backend.railway.app/api/analytics/dashboard?period=current-month
```

---

## 📊 Monitoring & Logs

### Railway (Backend)
- View logs in Railway dashboard
- Monitor CPU, memory, and network usage
- Set up alerts for errors

### Vercel (Frontend)
- View deployment logs
- Monitor Core Web Vitals
- View analytics and usage

---

## 🚨 Troubleshooting

### Issue: CORS Errors
**Solution**: Ensure `FRONTEND_URL` in Railway matches your Vercel domain exactly

### Issue: Database Connection Errors
**Solution**:
1. Check `DATABASE_URL` in Railway
2. Ensure Neon database is active
3. Verify SSL mode is `require`

### Issue: API 404 Errors
**Solution**: Ensure `VITE_API_URL` in Vercel includes `/api` path

### Issue: Swagger UI Not Loading
**Solution**: Check that backend is accessible at `/api-docs.json`

---

## 💰 Cost Estimates

### Free Tier Usage
- **Vercel**: Free tier includes:
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Automatic HTTPS
  - Custom domains

- **Railway**: Free tier includes:
  - $5 credit/month (~500 hours)
  - Automatic HTTPS
  - Custom domains
  - PostgreSQL database (or use Neon)

- **Neon**: Free tier includes:
  - 0.5 GB storage
  - Unlimited compute time
  - Auto-suspend after inactivity

### Estimated Monthly Cost
- **Development**: $0/month (within free tiers)
- **Light Production**: $0-10/month
- **Full Production**: $20-50/month (depending on traffic)

---

## 🎯 Next Steps

1. [ ] Sign up for Vercel account
2. [ ] Sign up for Railway account
3. [ ] Deploy backend to Railway
4. [ ] Deploy frontend to Vercel
5. [ ] Update environment variables
6. [ ] Test all endpoints
7. [ ] Set up custom domain (optional)
8. [ ] Configure monitoring and alerts

---

## 📝 Alternative: One-Click Deployment Scripts

I can create automated deployment scripts for:
- Railway CLI deployment
- Vercel CLI deployment
- GitHub Actions CI/CD pipeline

Would you like me to create these scripts?

---

## 🆘 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **Project Swagger Docs**: Your deployed backend URL + `/api-docs`

---

## ✅ Deployment Checklist

Before deploying:
- [ ] All environment variables documented
- [ ] Database migrations complete
- [ ] All tests passing
- [ ] Swagger documentation complete
- [ ] Build succeeds locally (`npm run build`)
- [ ] No sensitive data in repository

After deploying:
- [ ] Health endpoint responds
- [ ] Swagger UI accessible
- [ ] Frontend loads correctly
- [ ] Authentication works
- [ ] All 14 analytics endpoints tested
- [ ] Database connections verified
- [ ] Monitoring set up

---

**Ready to deploy?** Let me know if you'd like me to create the deployment automation scripts or help with any specific step!
