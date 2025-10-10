# ✅ Production Deployment Setup - Complete Guide

## 🎯 Your Deployment Information

### Live URLs
- **Backend**: https://css-clinify.onrender.com
- **Frontend**: https://cultural-staffing-solutions.vercel.app

### API Endpoints
- **Health Check**: https://css-clinify.onrender.com/api/health
- **Swagger Docs**: https://css-clinify.onrender.com/api-docs
- **Analytics API**: https://css-clinify.onrender.com/api/analytics

### Frontend Pages
- **Home**: https://cultural-staffing-solutions.vercel.app
- **Admin Dashboard**: https://cultural-staffing-solutions.vercel.app/admin
- **API Docs**: https://cultural-staffing-solutions.vercel.app/admin/api-docs

---

## ⚙️ Configuration Tasks

### ✅ Task 1: Update Render Environment Variables

1. Go to: https://dashboard.render.com
2. Click on: **css-clinify**
3. Click: **Environment** (left sidebar)
4. Update or add:
   ```
   FRONTEND_URL=https://cultural-staffing-solutions.vercel.app
   ```
5. Click **Save Changes**
6. Wait for automatic redeploy (~2 minutes)

### ✅ Task 2: Update Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click on: **cultural-staffing-solutions**
3. Click: **Settings** → **Environment Variables**
4. Update or add:
   ```
   VITE_API_URL=https://css-clinify.onrender.com/api
   ```
   ⚠️ **Must include `/api` at the end!**

5. Click **Save**
6. Go to **Deployments** tab
7. Click ⋯ on latest deployment → **Redeploy**

---

## 🔑 GitHub Secrets Setup

### Get These Values First

#### 1. Render Deploy Hook
- **Render Dashboard** → **css-clinify** → **Settings**
- Scroll to **Deploy Hook**
- Click **Create Deploy Hook**
- Copy the URL (looks like: `https://api.render.com/deploy/srv-xxx?key=xxx`)

#### 2. Vercel Token
- **Vercel Dashboard** → Profile Icon → **Settings** → **Tokens**
- Click **Create Token**
- Name: `GitHub Actions`
- Scope: Full Account
- Click **Create** and copy the token

#### 3. Vercel Project & Org IDs
- **Vercel Dashboard** → **cultural-staffing-solutions** → **Settings**
- Copy **Project ID**: `prj_xxxxx`
- Copy **Team/Org ID**: `team_xxxxx`

### Add to GitHub

Go to: https://github.com/The-Data-Innovation-Hub/cultural-staffing-solutions/settings/secrets/actions

Add these 7 secrets:

| Secret Name | Value |
|-------------|-------|
| `RENDER_DEPLOY_HOOK_URL` | [Your Render deploy hook URL] |
| `BACKEND_URL` | `https://css-clinify.onrender.com` |
| `VERCEL_TOKEN` | [Your Vercel token] |
| `VERCEL_ORG_ID` | [Your Vercel org/team ID] |
| `VERCEL_PROJECT_ID` | [Your Vercel project ID] |
| `VITE_API_URL` | `https://css-clinify.onrender.com/api` |
| `VITE_OPENAI_API_KEY` | [Your OpenAI key] (optional) |

---

## 🧪 Testing Your Deployments

### Test Backend (Open in Browser)

**Important**: First request may take 30-60 seconds (cold start on free tier)

1. **Health Check**:
   ```
   https://css-clinify.onrender.com/api/health
   ```
   Expected: `{"status":"healthy","timestamp":"...","version":"1.0.0"}`

2. **Swagger Documentation**:
   ```
   https://css-clinify.onrender.com/api-docs
   ```
   Expected: Interactive API documentation with 14 endpoints

3. **Analytics Dashboard**:
   ```
   https://css-clinify.onrender.com/api/analytics/dashboard
   ```
   Expected: `401 Unauthorized` (correct - needs authentication)

### Test Frontend (Open in Browser)

1. **Home Page**:
   ```
   https://cultural-staffing-solutions.vercel.app
   ```
   Expected: Site loads without errors

2. **Admin Section**:
   ```
   https://cultural-staffing-solutions.vercel.app/admin
   ```
   Expected: Admin pages load

3. **API Documentation**:
   ```
   https://cultural-staffing-solutions.vercel.app/admin/api-docs
   ```
   Expected: Swagger UI embedded in your app

   **Check**:
   - Swagger UI loads
   - Shows "Analytics API Documentation"
   - Lists all 14 endpoints
   - No CORS errors in browser console

---

## 🔧 Verify CORS Configuration

### Check Browser Console

1. Open: https://cultural-staffing-solutions.vercel.app/admin/api-docs
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Look for errors

**Expected**: No CORS errors

**If you see CORS errors**:
- Verify `FRONTEND_URL` in Render is exactly: `https://cultural-staffing-solutions.vercel.app`
- No trailing slash!
- Redeploy backend after changing

---

## 🚀 Test Automatic Deployment

Once GitHub secrets are added:

```bash
# Make a small change
echo "// Test deployment" >> backend/src/server.ts

# Commit and push
git add backend/src/server.ts
git commit -m "Test: Trigger automatic deployment"
git push origin main

# Watch GitHub Actions
# https://github.com/The-Data-Innovation-Hub/cultural-staffing-solutions/actions
```

**Expected**:
- "Deploy Backend to Render" workflow starts
- Builds successfully (~2 min)
- Triggers Render deployment
- Health checks pass
- Green checkmark ✅

---

## ⚠️ Important Notes

### Render Free Tier - Cold Starts

**What happens**: Your backend sleeps after 15 minutes of inactivity

**Impact**:
- First request after sleep: 30-60 seconds to wake up
- Subsequent requests: Normal speed

**Solutions**:
1. **Accept it** - Fine for development/demo
2. **Use UptimeRobot** - Free pings every 5 minutes to keep it awake
3. **Upgrade to Starter** - $7/month, no sleep

### Database Connection

Your backend is connected to **Neon PostgreSQL**:
- ✅ All 14 analytics tables created
- ✅ Sample data populated
- ✅ Connection tested and working

---

## 📊 Deployment Status Checklist

### Environment Configuration
- [ ] Render `FRONTEND_URL` updated with Vercel URL
- [ ] Render `DATABASE_URL` set (Neon connection)
- [ ] Render `SESSION_SECRET` set
- [ ] Render `NODE_ENV=production` set
- [ ] Vercel `VITE_API_URL` updated with Render URL
- [ ] Vercel `VITE_OPENAI_API_KEY` set (optional)

### GitHub Secrets (for Auto-Deploy)
- [ ] `RENDER_DEPLOY_HOOK_URL` added
- [ ] `BACKEND_URL` added
- [ ] `VERCEL_TOKEN` added
- [ ] `VERCEL_ORG_ID` added
- [ ] `VERCEL_PROJECT_ID` added
- [ ] `VITE_API_URL` added
- [ ] `VITE_OPENAI_API_KEY` added (optional)

### Testing
- [ ] Backend health endpoint works
- [ ] Swagger docs accessible
- [ ] Frontend loads without errors
- [ ] No CORS errors in console
- [ ] API Documentation page in admin works
- [ ] GitHub Actions test passed

---

## 🎯 Quick Command Reference

### Test Backend
```bash
# Health check (may take 30-60 sec on first request)
curl https://css-clinify.onrender.com/api/health

# Swagger JSON
curl https://css-clinify.onrender.com/api-docs.json | jq .

# Analytics (will return 401 - expected)
curl https://css-clinify.onrender.com/api/analytics/dashboard
```

### Test Frontend
```bash
# Check site loads
curl -I https://cultural-staffing-solutions.vercel.app

# Or just open in browser
open https://cultural-staffing-solutions.vercel.app
```

---

## 🐛 Troubleshooting

### Backend Returns 503
**Cause**: Service is waking up from sleep
**Fix**: Wait 30-60 seconds and try again

### CORS Errors
**Cause**: `FRONTEND_URL` mismatch
**Fix**:
1. Check Render env var is: `https://cultural-staffing-solutions.vercel.app`
2. No trailing slash
3. Redeploy backend

### Swagger UI Shows "Failed to load API definition"
**Cause**: Wrong API URL in Vercel
**Fix**:
1. Check Vercel env var: `https://css-clinify.onrender.com/api`
2. Must include `/api`
3. Redeploy frontend

### GitHub Actions Fails
**Cause**: Missing or wrong secrets
**Fix**:
1. Verify all 7 secrets added
2. Check names are exactly right (case-sensitive)
3. Regenerate tokens if expired

---

## 📚 Next Steps

1. **Configure environment variables** (Steps 1-2 above)
2. **Get credentials** (Render hook, Vercel token/IDs)
3. **Add GitHub secrets** (all 7)
4. **Test deployments** (open URLs in browser)
5. **Push a change** to test automatic deployment

---

## 🆘 Need Help?

**Documentation**:
- Render deployment: `docs/DEPLOYMENT_RENDER.md`
- GitHub secrets: `docs/GITHUB_SECRETS_SETUP.md`
- Workflows: `.github/workflows/README.md`

**Platform Dashboards**:
- Render: https://dashboard.render.com
- Vercel: https://vercel.com/dashboard
- GitHub Actions: https://github.com/The-Data-Innovation-Hub/cultural-staffing-solutions/actions

---

## ✨ Your Application is Live!

**Congratulations! Your full-stack application is deployed and running in production!** 🎉

Once you complete the configuration above, you'll have:
- ✅ Live backend API on Render
- ✅ Live frontend on Vercel
- ✅ Automatic deployments via GitHub Actions
- ✅ Complete analytics system
- ✅ Swagger API documentation

**Start configuring now and your app will be fully operational!** 🚀
