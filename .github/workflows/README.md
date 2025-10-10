# GitHub Actions Workflows

This directory contains automated CI/CD workflows for deploying the Cultural Staffing Solutions application.

---

## 📋 Available Workflows

### 1. `deploy-backend.yml` - Backend Deployment to Render

**Triggers**:
- Push to `main` branch (when backend files change)
- Manual dispatch via GitHub Actions UI

**What it does**:
1. ✅ Checks out code
2. ✅ Sets up Node.js 18
3. ✅ Installs dependencies
4. ✅ Builds TypeScript backend
5. ✅ Runs tests
6. ✅ Triggers Render deployment
7. ✅ Waits for deployment to complete
8. ✅ Verifies health endpoint
9. ✅ Tests Swagger documentation
10. ✅ Tests analytics endpoints

**Required Secrets**:
- `RENDER_DEPLOY_HOOK_URL` - Your Render deploy hook URL
- `BACKEND_URL` - Your deployed backend URL (e.g., `https://your-app.onrender.com`)

**Duration**: ~3-5 minutes

---

### 2. `deploy-frontend.yml` - Frontend Deployment to Vercel

**Triggers**:
- Push to `main` branch (when frontend files change)
- Manual dispatch via GitHub Actions UI

**What it does**:
1. ✅ Checks out code
2. ✅ Sets up Node.js 18
3. ✅ Installs Vercel CLI
4. ✅ Pulls Vercel environment config
5. ✅ Builds production bundle
6. ✅ Deploys to Vercel
7. ✅ Runs smoke tests
8. ✅ Comments deployment URL on PRs

**Required Secrets**:
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `VITE_API_URL` - Backend API URL
- `VITE_OPENAI_API_KEY` - OpenAI API key

**Duration**: ~1-2 minutes

---

## 🔐 Setting Up GitHub Secrets

### Step 1: Get Your Render Deploy Hook

1. Go to **Render Dashboard** → Your Service
2. Click **Settings** → **Deploy Hook**
3. Copy the webhook URL (looks like `https://api.render.com/deploy/srv-xxx?key=xxx`)
4. Add to GitHub:
   - Go to your repo → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: Your webhook URL
   - Click **Add secret**

### Step 2: Add Your Backend URL

1. After deploying to Render, copy your backend URL
2. Add to GitHub:
   - Name: `BACKEND_URL`
   - Value: `https://your-app.onrender.com` (without trailing slash)

### Step 3: Get Your Vercel Credentials

1. **Vercel Token**:
   - Go to **Vercel Dashboard** → **Settings** → **Tokens**
   - Create a new token
   - Copy and add as `VERCEL_TOKEN` secret

2. **Vercel Org & Project IDs**:
   - Deploy to Vercel once manually
   - Go to **Project Settings** → **General**
   - Copy **Project ID** → Add as `VERCEL_PROJECT_ID`
   - Copy **Team/Org ID** → Add as `VERCEL_ORG_ID`

### Step 4: Add Environment Variables

Add these secrets for Vercel:
- `VITE_API_URL` - Your Render backend URL + `/api` (e.g., `https://your-app.onrender.com/api`)
- `VITE_OPENAI_API_KEY` - Your OpenAI API key

---

## 🚀 How Deployments Work

### Automatic Deployments

When you push to `main`:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions will automatically:
1. **Backend**: Trigger Render deployment (if backend changed)
2. **Frontend**: Build and deploy to Vercel (if frontend changed)
3. **Tests**: Run health checks and verification
4. **Notify**: Show success/failure in GitHub Actions tab

### Manual Deployments

Trigger manually from GitHub:

1. Go to **Actions** tab in your repository
2. Select a workflow (`Deploy Backend to Render` or `Deploy Frontend to Vercel`)
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

---

## 📊 Monitoring Deployments

### View Deployment Status

1. Go to **Actions** tab in your GitHub repository
2. See all workflow runs with status indicators:
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed
   - 🟡 Yellow dot = In progress

### View Deployment Logs

1. Click on any workflow run
2. Click on the job (e.g., "deploy")
3. See detailed logs for each step
4. Expand steps to see full output

### Deployment Notifications

You can set up notifications:
- **Email**: GitHub sends emails for failed workflows
- **Slack**: Integrate with Slack for notifications
- **Discord**: Use webhooks for Discord notifications

---

## 🔧 Workflow Configuration

### Backend Workflow Paths

The backend workflow only runs when these files change:
- `backend/**` - Any file in backend directory
- `render.yaml` - Render configuration
- `.github/workflows/deploy-backend.yml` - The workflow itself

### Frontend Workflow Paths

The frontend workflow runs for all changes EXCEPT:
- `backend/**`
- `docs/**`
- `**.md` (Markdown files)

---

## 🐛 Troubleshooting

### Backend Deployment Fails

**Error**: "Deployment hook failed"
- **Fix**: Check `RENDER_DEPLOY_HOOK_URL` is correct
- **Fix**: Ensure Render service is active

**Error**: "Health check failed"
- **Fix**: Wait longer (Render cold starts take ~30 sec)
- **Fix**: Check backend logs in Render dashboard
- **Fix**: Verify `BACKEND_URL` secret is correct

**Error**: "Build failed"
- **Fix**: Check backend builds locally: `cd backend && npm run build`
- **Fix**: Verify all dependencies in `package.json`

### Frontend Deployment Fails

**Error**: "Vercel token invalid"
- **Fix**: Regenerate token in Vercel dashboard
- **Fix**: Update `VERCEL_TOKEN` secret

**Error**: "Build failed"
- **Fix**: Check frontend builds locally: `npm run build`
- **Fix**: Verify environment variables are set

**Error**: "Project not found"
- **Fix**: Verify `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID`
- **Fix**: Deploy once manually to create project

---

## 📝 Customization

### Change Deployment Triggers

Edit the `on:` section:

```yaml
on:
  push:
    branches:
      - main          # Deploy on push to main
      - production    # Also deploy on push to production
  pull_request:       # Run on pull requests (without deploying)
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
```

### Add Deployment Environments

Add environment-specific deployments:

```yaml
jobs:
  deploy-staging:
    environment: staging
    # ... deployment steps

  deploy-production:
    environment: production
    needs: deploy-staging  # Runs after staging
    # ... deployment steps
```

### Add Slack Notifications

Add a step to notify Slack:

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "Deployment ${{ job.status }}"
      }
```

---

## 🎯 Best Practices

### 1. Branch Protection

Enable branch protection for `main`:
- Require status checks to pass before merging
- Require pull request reviews
- Enable GitHub Actions as required check

### 2. Environment Variables

Store all secrets in GitHub Secrets:
- ✅ Never commit `.env` files
- ✅ Use different secrets for staging/production
- ✅ Rotate secrets regularly

### 3. Deployment Verification

Always include health checks:
- ✅ Test critical endpoints after deployment
- ✅ Verify database connectivity
- ✅ Check API documentation is accessible

### 4. Rollback Strategy

Keep previous deployments:
- Vercel keeps all deployments (instant rollback)
- Render keeps recent deployments
- Tag releases in Git for reference

---

## 📚 Additional Resources

### GitHub Actions
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

### Deployment Platforms
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Deploy Hooks Guide](https://render.com/docs/deploy-hooks)

### Project Documentation
- [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md)
- [Render Deployment](../docs/DEPLOYMENT_RENDER.md)
- [Quick Start](../docs/DEPLOYMENT_QUICKSTART.md)

---

## ✅ Quick Start Checklist

To enable automatic deployments:

- [ ] Deploy backend to Render manually (first time)
- [ ] Deploy frontend to Vercel manually (first time)
- [ ] Get Render deploy hook URL
- [ ] Get Vercel token, org ID, and project ID
- [ ] Add all required secrets to GitHub
- [ ] Push to `main` branch
- [ ] Watch GitHub Actions for deployment status
- [ ] Verify deployed apps work correctly

---

## 🆘 Need Help?

If deployments aren't working:

1. **Check workflow logs** in GitHub Actions tab
2. **Verify secrets** are correctly set
3. **Test locally** - ensure builds work on your machine
4. **Check platform status**:
   - [Render Status](https://status.render.com)
   - [Vercel Status](https://www.vercel-status.com)
   - [GitHub Status](https://www.githubstatus.com)

---

**Happy deploying! 🚀**
