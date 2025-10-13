# 🚀 Deployment Guide - Render (Backend) + Vercel (Frontend)

## Why Render?

**Render Advantages:**
- ✅ **More generous free tier** - 750 hours/month (vs Railway's $5 credit)
- ✅ **Easier setup** - No credit card required for free tier
- ✅ **Better for APIs** - Optimized for web services
- ✅ **Auto-deploy from GitHub** - Built-in CI/CD
- ✅ **Free PostgreSQL** - 90-day expiry, but free to recreate

---

## 📋 Prerequisites

- [ ] GitHub account with repository access
- [ ] Neon PostgreSQL database (✅ Already configured)
- [ ] OpenAI API key
- [ ] Render account (sign up at https://render.com)
- [ ] Vercel account (sign up at https://vercel.com)

---

## Part 1: Deploy Backend to Render (10 minutes)

### Step 1: Sign Up for Render

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub**
4. Authorize Render to access your repositories

### Step 2: Create a New Web Service

1. **In Render Dashboard**:
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub account (if not already connected)
   - Select repository: `The-Data-Innovation-Hub/cultural-staffing-solutions`

2. **Configure the Service**:
   ```
   Name: cultural-staffing-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Select Plan**:
   - Choose **"Free"** (750 hours/month, 512 MB RAM)
   - ⚠️ Free tier sleeps after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds

### Step 3: Add Environment Variables

In the **Environment** section, add these variables:

```env
DATABASE_URL=your_neon_postgresql_connection_string
SESSION_SECRET=your_secure_random_32_char_string
JWT_SECRET=your_secure_random_48_char_jwt_secret
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app.vercel.app
```

**To generate SESSION_SECRET and JWT_SECRET locally:**
```bash
# Generate SESSION_SECRET (minimum 32 characters)
openssl rand -base64 32

# Generate JWT_SECRET (minimum 48 characters)
openssl rand -base64 48
```

**⚠️ CRITICAL**: The application will NOT start without a valid JWT_SECRET (minimum 32 characters).

**Important Notes:**
- ⚠️ PORT must be `10000` on Render (they override this anyway)
- ✅ Don't include PORT in the env vars, Render sets it automatically
- ✅ Your DATABASE_URL should be your existing Neon database URL

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Run `npm install && npm run build` in `/backend`
   - Start the server with `npm start`
   - Assign a URL like: `https://cultural-staffing-backend.onrender.com`

3. **Monitor the deployment**:
   - Watch the logs in real-time
   - First deployment takes 3-5 minutes
   - Look for: "Assessment API server running on..."

### Step 5: Verify Backend Deployment

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Should return:
# {"status":"healthy","timestamp":"...","version":"1.0.0"}

# Swagger docs
curl https://your-backend.onrender.com/api-docs.json | jq .

# Or open in browser:
open https://your-backend.onrender.com/api-docs
```

**Save your Render URL** - you'll need it for the frontend!

---

## Part 2: Deploy Frontend to Vercel (5 minutes)

### Step 1: Sign Up for Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Continue with **GitHub**
4. Authorize Vercel to access your repositories

### Step 2: Import Your Project

1. **In Vercel Dashboard**:
   - Click **"Add New..."** → **"Project"**
   - Select `The-Data-Innovation-Hub/cultural-staffing-solutions`

2. **Configure Build Settings**:
   ```
   Framework Preset: Vite
   Root Directory: ./ (leave blank)
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Replace** `your-backend.onrender.com` with your actual Render URL from Part 1!

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Build your Vite app
   - Deploy to CDN
   - Assign a URL like: `https://cultural-staffing.vercel.app`

3. **Monitor deployment** (takes 1-2 minutes)

### Step 5: Update Backend CORS

1. **Go back to Render dashboard**
2. Select your backend service
3. Go to **"Environment"**
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Click **"Save Changes"**
6. Render will automatically redeploy (takes 1-2 minutes)

---

## Part 3: Test Your Deployment

### Test Backend Endpoints

```bash
# Set your backend URL
BACKEND_URL="https://your-backend.onrender.com"

# 1. Health check
curl $BACKEND_URL/api/health

# 2. Swagger documentation
curl $BACKEND_URL/api-docs.json | jq '.info'

# 3. Analytics dashboard (requires auth, will return 401)
curl $BACKEND_URL/api/analytics/dashboard
```

### Test Frontend

1. **Open your Vercel URL** in a browser
2. **Try to log in** with test credentials
3. **Navigate to Admin** → **API Documentation**
4. **Verify Swagger UI loads** and shows all 14 endpoints
5. **Test an endpoint** in Swagger UI (e.g., GET `/analytics/dashboard`)

### Test Full Stack Integration

1. Navigate to **Admin** → **Analytics Dashboard**
2. Should load without errors
3. Check browser console for any API errors
4. Verify charts and data display (or empty state if no data)

---

## 🔄 Automatic Deployments

Both platforms auto-deploy on git push:

```bash
# Make changes
git add .
git commit -m "Update application"
git push origin main

# Render: Auto-deploys backend (3-5 minutes)
# Vercel: Auto-deploys frontend (1-2 minutes)
```

**Preview Deployments:**
- Create a branch → Automatic preview URL
- Pull requests → Automatic preview deployments
- Test before merging to `main`

---

## ⚙️ Render-Specific Configuration

### Create `render.yaml` (Optional)

For more control, create a `render.yaml` file in your repo root:

```yaml
services:
  - type: web
    name: cultural-staffing-backend
    runtime: node
    region: oregon
    plan: free
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false  # Set manually in Render dashboard
      - key: SESSION_SECRET
        generateValue: true
      - key: FRONTEND_URL
        sync: false  # Set manually in Render dashboard
    healthCheckPath: /api/health
    autoDeploy: true
```

Add this file and commit:
```bash
git add render.yaml
git commit -m "Add Render configuration"
git push origin main
```

Render will detect this file and use it for deployment configuration.

---

## 🌐 Custom Domains (Optional)

### For Backend (Render)

1. **In Render Dashboard** → Your service → **Settings**
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter: `api.yourcompany.com`
5. **Update DNS records** as shown:
   ```
   Type: CNAME
   Name: api
   Value: your-service.onrender.com
   ```
6. Render auto-provisions SSL certificate (takes 5-10 minutes)

### For Frontend (Vercel)

1. **In Vercel Dashboard** → Your project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter: `app.yourcompany.com`
4. **Update DNS records** as shown:
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```
5. Vercel auto-provisions SSL certificate (instant)

**After adding custom domains**, update environment variables:
- Render: Update `FRONTEND_URL` to `https://app.yourcompany.com`
- Vercel: Update `VITE_API_URL` to `https://api.yourcompany.com/api`

---

## 🔧 Render Free Tier Limitations & Solutions

### Issue: Service Sleeps After 15 Minutes

**Problem**: Free tier services sleep after 15 min of inactivity. First request takes ~30 seconds to wake up.

**Solutions**:

1. **Keep-Alive Service (Free)** - Use cron-job.org or UptimeRobot:
   ```bash
   # Set up a ping every 14 minutes to:
   https://your-backend.onrender.com/api/health
   ```

2. **Upgrade to Starter Plan** - $7/month, no sleep:
   - 512 MB RAM (same as free)
   - No auto-sleep
   - Custom domains included

3. **Accept the cold starts** - For low-traffic apps, this is fine!

### Issue: 512 MB RAM Limit

**Problem**: Free tier limited to 512 MB RAM.

**Solutions**:
- ✅ Your backend uses ~200-300 MB, plenty of room
- ✅ PostgreSQL is external (Neon), doesn't count
- ✅ Upgrade to Starter ($7/month) for 2 GB RAM if needed

### Issue: 750 Hours/Month Limit

**Problem**: Free tier gives 750 hours/month (31.25 days).

**Solutions**:
- ✅ One service: 750 hours = 100% uptime ✨
- ⚠️ Two services: 375 hours each (15.6 days/service)
- 💡 For production, upgrade to Starter plan

---

## 💰 Cost Comparison: Render vs Railway

| Feature | Render Free | Railway Free | Winner |
|---------|-------------|--------------|---------|
| **Monthly Credit** | 750 hours | $5 (~500 hrs) | Render |
| **RAM** | 512 MB | 512 MB | Tie |
| **Auto-sleep** | Yes (15 min) | Yes (varies) | Tie |
| **PostgreSQL** | Free (90 days) | Free | Render |
| **Custom Domain** | Free | Free | Tie |
| **Setup** | Easier | Easier | Tie |
| **Best For** | APIs, web apps | Full-stack | Render for API |

**Recommendation**: **Render** for backend APIs - more hours, easier setup!

---

## 🎯 Production Upgrade Path

When ready for production:

### Render Starter Plan ($7/month per service)
- ✅ 2 GB RAM
- ✅ No auto-sleep
- ✅ Custom domains
- ✅ Automatic SSL
- ✅ Better performance

### Vercel Pro ($20/month)
- ✅ Unlimited bandwidth
- ✅ Advanced analytics
- ✅ Priority support
- ✅ Team collaboration

**Total Production Cost**: ~$27/month (Render + Vercel)

---

## 🚨 Troubleshooting

### Issue: Backend Won't Start

**Check logs in Render**:
1. Render Dashboard → Your service → Logs
2. Look for errors in build/start process

**Common fixes**:
- Ensure `build` script in `package.json`: `"build": "tsc"`
- Ensure `start` script: `"start": "node dist/server.js"`
- Verify `Root Directory` is set to `backend`

### Issue: Database Connection Error

**Error**: `error: password authentication failed`

**Fix**:
1. Check `DATABASE_URL` in Render environment variables
2. Ensure Neon database is active (not paused)
3. Verify connection string includes `?sslmode=require`

### Issue: CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Fix**:
1. In Render, update `FRONTEND_URL` environment variable
2. Ensure it exactly matches your Vercel URL (no trailing slash)
3. Redeploy backend

### Issue: Swagger UI Not Loading

**Error**: `Failed to load API definition`

**Fix**:
1. Check backend URL in frontend code
2. Verify: `VITE_API_URL=https://your-backend.onrender.com/api`
3. Test Swagger JSON: `curl https://your-backend.onrender.com/api-docs.json`

### Issue: Cold Start (Service Asleep)

**Symptom**: First request takes 30+ seconds

**This is normal for free tier!** Options:
1. Accept it (fine for development)
2. Set up keep-alive pings (free)
3. Upgrade to Starter plan ($7/month, no sleep)

---

## 📊 Deployment Checklist

### Before Deployment
- [x] Backend builds successfully: `cd backend && npm run build` ✅
- [x] Database connected and populated ✅
- [x] Environment variables documented ✅
- [ ] Render account created
- [ ] Vercel account created

### During Deployment
- [ ] Backend deployed to Render
- [ ] Backend health check passes
- [ ] Swagger docs accessible
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads correctly
- [ ] CORS configured (FRONTEND_URL updated)

### After Deployment
- [ ] Test login functionality
- [ ] Test API endpoints in Swagger UI
- [ ] Test Analytics Dashboard
- [ ] Verify all 14 endpoints work
- [ ] Set up monitoring (optional)
- [ ] Configure custom domains (optional)

---

## 🎉 You're Live!

After deployment, your app is accessible at:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com/api`
- **Swagger Docs**: `https://your-backend.onrender.com/api-docs`
- **Health Check**: `https://your-backend.onrender.com/api/health`

---

## 📝 Quick Reference

### Environment Variables

**Render (Backend)**:
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=<32-char-random>
JWT_SECRET=<48-char-random>
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Vercel (Frontend)**:
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_OPENAI_API_KEY=sk-...
```

### Useful Commands

```bash
# Generate session secret (minimum 32 characters)
openssl rand -base64 32

# Generate JWT secret (minimum 48 characters)
openssl rand -base64 48

# Test backend health
curl https://your-backend.onrender.com/api/health

# Test Swagger JSON
curl https://your-backend.onrender.com/api-docs.json

# View deployment logs
# (In Render dashboard → Logs)
```

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Your Swagger Docs**: `https://your-backend.onrender.com/api-docs`

---

**Ready to deploy? Follow the steps above and you'll be live in 15 minutes!** 🚀
