# 🔐 GitHub Secrets Setup Guide

This guide will help you set up all required secrets for automatic deployments via GitHub Actions.

---

## 📋 Required Secrets Overview

| Secret Name | Purpose | Where to Get It |
|-------------|---------|-----------------|
| `RENDER_DEPLOY_HOOK_URL` | Trigger Render deployments | Render Dashboard |
| `BACKEND_URL` | Your deployed backend URL | After Render deployment |
| `VERCEL_TOKEN` | Vercel API access | Vercel Dashboard |
| `VERCEL_ORG_ID` | Your Vercel organization | Vercel Project Settings |
| `VERCEL_PROJECT_ID` | Your Vercel project | Vercel Project Settings |
| `VITE_API_URL` | Backend API URL | Your Render URL + `/api` |
| `VITE_OPENAI_API_KEY` | OpenAI API access | OpenAI Dashboard |

---

## 🚀 Step-by-Step Setup

### Step 1: Access GitHub Secrets Settings

1. Go to your GitHub repository: `The-Data-Innovation-Hub/cultural-staffing-solutions`
2. Click **Settings** (top menu)
3. In left sidebar, click **Secrets and variables** → **Actions**
4. You'll see **Repository secrets** section

---

### Step 2: Get Render Deploy Hook

1. **Deploy backend to Render first** (follow `DEPLOYMENT_RENDER.md`)

2. **Get the deploy hook**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Select your backend service
   - Click **Settings** (left sidebar)
   - Scroll to **Deploy Hook**
   - Click **Create Deploy Hook**
   - Copy the webhook URL (looks like: `https://api.render.com/deploy/srv-xxxxx?key=xxxxx`)

3. **Add to GitHub**:
   - In GitHub Secrets page, click **New repository secret**
   - **Name**: `RENDER_DEPLOY_HOOK_URL`
   - **Value**: Paste the webhook URL
   - Click **Add secret**

---

### Step 3: Add Backend URL

1. **Copy your Render URL**:
   - In Render Dashboard → Your service
   - Copy the URL (e.g., `https://cultural-staffing-backend.onrender.com`)

2. **Add to GitHub**:
   - Click **New repository secret**
   - **Name**: `BACKEND_URL`
   - **Value**: `https://cultural-staffing-backend.onrender.com` (no trailing slash!)
   - Click **Add secret**

---

### Step 4: Get Vercel Token

1. **Create Vercel Token**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click your profile icon (bottom left)
   - Click **Settings**
   - Go to **Tokens** tab
   - Click **Create Token**
   - Name it: `GitHub Actions`
   - Select scope: **Full Account**
   - Expiration: **No Expiration** (or set expiration date)
   - Click **Create Token**
   - **Copy the token** (you'll only see it once!)

2. **Add to GitHub**:
   - Click **New repository secret**
   - **Name**: `VERCEL_TOKEN`
   - **Value**: Paste the token
   - Click **Add secret**

---

### Step 5: Get Vercel Org ID and Project ID

#### Option A: From Vercel Dashboard (Easier)

1. **Deploy to Vercel manually first** (follow `DEPLOYMENT_RENDER.md`)

2. **Get Project ID**:
   - Go to your project in Vercel Dashboard
   - Click **Settings**
   - Under **General**, find **Project ID**
   - Copy it (looks like: `prj_xxxxxxxxxxxxxxxxxxxxx`)

3. **Get Org ID**:
   - In the same Settings page
   - Find **Team ID** or **Organization ID**
   - Copy it (looks like: `team_xxxxxxxxxxxxxxxxxxxxx`)

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Link to your project
vercel link

# Get project and org IDs
vercel project ls
```

4. **Add to GitHub**:

   **Project ID**:
   - Click **New repository secret**
   - **Name**: `VERCEL_PROJECT_ID`
   - **Value**: Paste the project ID
   - Click **Add secret**

   **Org ID**:
   - Click **New repository secret**
   - **Name**: `VERCEL_ORG_ID`
   - **Value**: Paste the org/team ID
   - Click **Add secret**

---

### Step 6: Add API URLs

1. **Backend API URL**:
   - Click **New repository secret**
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com/api` (note the `/api` at the end!)
   - Click **Add secret**

2. **OpenAI API Key** (if using AI features):
   - Get key from [OpenAI Dashboard](https://platform.openai.com/api-keys)
   - Click **New repository secret**
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: Paste your OpenAI key (starts with `sk-`)
   - Click **Add secret**

---

## ✅ Verify All Secrets Are Set

You should now have **7 secrets** total:

```
✅ RENDER_DEPLOY_HOOK_URL
✅ BACKEND_URL
✅ VERCEL_TOKEN
✅ VERCEL_ORG_ID
✅ VERCEL_PROJECT_ID
✅ VITE_API_URL
✅ VITE_OPENAI_API_KEY
```

**Check in GitHub**:
- Go to Settings → Secrets and variables → Actions
- You should see all 7 secrets listed
- You can't view the values (for security), but you can update or delete them

---

## 🧪 Test Your Setup

### Test Backend Deployment

1. Make a small change to backend:
   ```bash
   # Add a comment to backend/src/server.ts
   echo "// Test deployment" >> backend/src/server.ts
   ```

2. Commit and push:
   ```bash
   git add backend/src/server.ts
   git commit -m "Test: Trigger backend deployment"
   git push origin main
   ```

3. **Watch GitHub Actions**:
   - Go to **Actions** tab in your repository
   - You should see "Deploy Backend to Render" workflow running
   - Click on it to watch live logs
   - Should complete in ~3-5 minutes

### Test Frontend Deployment

1. Make a small change to frontend:
   ```bash
   # Add a comment to src/App.tsx
   echo "// Test deployment" >> src/App.tsx
   ```

2. Commit and push:
   ```bash
   git add src/App.tsx
   git commit -m "Test: Trigger frontend deployment"
   git push origin main
   ```

3. **Watch GitHub Actions**:
   - Go to **Actions** tab
   - You should see "Deploy Frontend to Vercel" workflow running
   - Should complete in ~1-2 minutes

---

## 🔧 Managing Secrets

### Update a Secret

1. Go to Settings → Secrets and variables → Actions
2. Find the secret you want to update
3. Click **Update**
4. Enter new value
5. Click **Update secret**

### Delete a Secret

1. Go to Settings → Secrets and variables → Actions
2. Find the secret you want to delete
3. Click **Remove**
4. Confirm deletion

### Rotate Secrets (Security Best Practice)

**Recommended rotation schedule**:
- `VERCEL_TOKEN`: Every 90 days
- `RENDER_DEPLOY_HOOK_URL`: When compromised
- `VITE_OPENAI_API_KEY`: Every 90 days or when compromised

---

## 🐛 Troubleshooting

### "Secret not found" Error

**Symptoms**: Workflow fails with error about missing secret

**Solutions**:
1. Check secret name is spelled exactly right (case-sensitive)
2. Ensure secret is added to **repository** secrets, not environment secrets
3. Re-add the secret if it was recently deleted

### Render Deploy Hook Not Working

**Symptoms**: Workflow triggers but Render doesn't deploy

**Solutions**:
1. Verify `RENDER_DEPLOY_HOOK_URL` is complete URL (with `?key=` part)
2. Check Render service is active (not paused)
3. Try regenerating deploy hook in Render dashboard

### Vercel Deployment Fails

**Symptoms**: "Project not found" or "Unauthorized"

**Solutions**:
1. Verify `VERCEL_TOKEN` is valid (not expired)
2. Check `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` are correct
3. Ensure Vercel token has correct scopes/permissions
4. Try creating a new token

### Wrong Backend URL

**Symptoms**: Frontend can't connect to backend

**Solutions**:
1. Check `VITE_API_URL` includes `/api` at the end
2. Verify `BACKEND_URL` doesn't have trailing slash
3. Ensure URLs use `https://` not `http://`
4. Check Render URL is the correct service

---

## 🔒 Security Best Practices

### Do's ✅

- ✅ Use GitHub Secrets for all sensitive data
- ✅ Rotate tokens regularly (every 90 days)
- ✅ Use different secrets for staging/production
- ✅ Review workflow logs before making repos public
- ✅ Limit token permissions to what's needed

### Don'ts ❌

- ❌ Never commit secrets to repository
- ❌ Don't share secrets in pull requests
- ❌ Don't echo secrets in workflow logs
- ❌ Don't use the same secrets across multiple projects
- ❌ Don't grant tokens more permissions than needed

---

## 📝 Secret Values Reference

Here's what your secret values should look like:

```bash
# Render
RENDER_DEPLOY_HOOK_URL=https://api.render.com/deploy/srv-xxxxx?key=xxxxx
BACKEND_URL=https://cultural-staffing-backend.onrender.com

# Vercel
VERCEL_TOKEN=vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_ORG_ID=team_xxxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxxxxxxxxxxxxxxx

# API Configuration
VITE_API_URL=https://cultural-staffing-backend.onrender.com/api
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important**:
- No quotes around values
- No spaces before/after values
- No trailing slashes (except for paths)
- Complete URLs with `https://`

---

## ✅ Completion Checklist

Before pushing code to trigger deployments:

- [ ] All 7 secrets added to GitHub
- [ ] Backend deployed to Render manually (first time)
- [ ] Frontend deployed to Vercel manually (first time)
- [ ] Render deploy hook obtained and added
- [ ] Vercel token created and added
- [ ] Org ID and Project ID obtained and added
- [ ] Backend URL and API URL configured correctly
- [ ] OpenAI key added (if using AI features)
- [ ] Test deployment triggered successfully
- [ ] Verified deployed apps work

---

## 🆘 Need Help?

**Can't find something?**
- Check platform dashboards carefully
- Settings are usually in project/service Settings page
- API tokens are in account/profile Settings

**Still stuck?**
- Review deployment logs in GitHub Actions
- Check Render/Vercel dashboard logs
- Verify you completed manual deployments first
- Ensure you have owner/admin access to repos and services

---

## 📚 Related Documentation

- [GitHub Actions Workflows](../.github/workflows/README.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Render Deployment](./DEPLOYMENT_RENDER.md)
- [Platform Comparison](./DEPLOYMENT_PLATFORM_COMPARISON.md)

---

**Once all secrets are set up, automatic deployments will work on every push to `main`!** 🎉
