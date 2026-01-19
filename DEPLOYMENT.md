# Deployment Guide: Render (Backend) + Vercel (Frontend)

This guide provides detailed step-by-step instructions for deploying the AI Interview Answer Evaluator application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Deployment to Render](#backend-deployment-to-render)
- [Frontend Deployment to Vercel](#frontend-deployment-to-vercel)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Troubleshooting](#troubleshooting)
- [Testing Production Deployment](#testing-production-deployment)

---

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
4. **OpenRouter API Key** - Get a free API key from [openrouter.ai](https://openrouter.ai)

---

## Backend Deployment to Render

### Step 1: Prepare Your Repository

1. Push your code to GitHub (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Interview Answer Evaluator"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Create a Web Service on Render

**IMPORTANT**: Before creating the service, ensure your `render.yaml` file is committed and pushed to your repository. This ensures Render uses the correct Python version (3.11.9) from the start.

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** button in the top right
3. Select **"Web Service"**
4. Connect your GitHub repository:
   - If first time: Click **"Connect GitHub"** and authorize Render
   - Select your repository from the list
5. Fill in the service configuration:

**Basic Settings:**
- **Name**: `interview-evaluator-api` (or your preferred name)
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` (important: set this to backend folder)

**Build & Deploy Settings:**
- **Runtime**: `Python 3`
- **Python Version**: `3.11.9` ⚠️ **CRITICAL**: Select Python 3.11.9, NOT 3.13
  - Exact version: **Python 3.11.9**
  - If `render.yaml` exists, it should auto-detect
  - If not, manually select from the dropdown: **Python 3.11.9**
- **Build Command**: 
```bash
pip install --upgrade pip && pip install -r requirements.txt
```
- **Start Command**:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Note**: Render automatically provides a `$PORT` environment variable. The `--port $PORT` is required.

### Step 3: Configure Environment Variables on Render

In the Render dashboard, navigate to your service → **"Environment"** tab and add:

| Key | Value | Description |
|-----|-------|-------------|
| `OPENROUTER_API_KEY` | `your_actual_api_key_here` | Your OpenRouter API key |
| `MODEL_NAME` | `openai/gpt-3.5-turbo` | (Optional) Model to use |

**Steps:**
1. Click **"Add Environment Variable"**
2. Add each variable above
3. Save changes

### Step 4: Create Render Configuration File (Optional but Recommended)

Create a `render.yaml` file in your project root for infrastructure-as-code:

```yaml
services:
  - type: web
    name: interview-evaluator-api
    runtime: python
    pythonVersion: 3.11.9
    plan: free
    buildCommand: pip install --upgrade pip && pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: OPENROUTER_API_KEY
        sync: false  # Set this manually in dashboard
      - key: MODEL_NAME
        value: openai/gpt-3.5-turbo
    rootDir: backend
```

**Important**: The `pythonVersion: 3.11.9` ensures Render uses Python 3.11.9, which has better pre-built wheel support for pydantic packages. This prevents Rust compilation errors that occur with Python 3.13.

### Step 5: Deploy

1. Click **"Create Web Service"** in Render
2. Render will:
   - Clone your repository
   - Install dependencies
   - Start your FastAPI application
3. Wait for deployment to complete (typically 2-5 minutes)
4. Your backend URL will be: `https://interview-evaluator-api.onrender.com` (or your custom name)

### Step 6: Verify Backend Deployment

1. Check the **"Logs"** tab for any errors
2. Visit your service URL + `/docs` to see the API documentation:
   ```
   https://your-service-name.onrender.com/docs
   ```
3. Test the health endpoint:
   ```
   https://your-service-name.onrender.com/health
   ```
   Should return: `{"status": "healthy"}`

### Important Notes for Render Backend

- **Free tier limitations**: Services spin down after 15 minutes of inactivity. First request after spin-down takes 30-60 seconds.
- **Upgrade**: Paid plans keep services running 24/7
- **CORS**: The backend is configured to accept requests from any origin (`allow_origins=["*"]`). In production, update this to your frontend URL.

---

## Frontend Deployment to Vercel

### Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

Or use the web interface (no CLI needed).

### Step 2: Prepare Frontend Configuration

1. Ensure your `frontend/package.json` has the build script (already included):
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

2. Create/update `.env.local` in the frontend directory with your Render backend URL:
```bash
NEXT_PUBLIC_API_URL=https://your-render-service-name.onrender.com
```

**Important**: Don't commit `.env.local` to git. Use Vercel's environment variables instead.

### Step 3: Deploy via Vercel Dashboard (Recommended for First Time)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository:
   - Select your repository
   - Click **"Import"**

4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` (important!)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. **Environment Variables**:
   - Click **"Environment Variables"**
   - Add:
     - **Name**: `NEXT_PUBLIC_API_URL`
     - **Value**: `https://your-render-service-name.onrender.com`
     - **Environment**: Select all (Production, Preview, Development)
   - Click **"Add"**

6. Click **"Deploy"**

### Step 4: Deploy via Vercel CLI (Alternative)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (for first deployment)
- Project name? `interview-evaluator-frontend` (or your choice)
- Directory? `./` (frontend directory)
- Override settings? **No**

4. Add environment variable:
```bash
vercel env add NEXT_PUBLIC_API_URL
```
- Enter value: `https://your-render-service-name.onrender.com`
- Select environments: Production, Preview, Development

5. Redeploy to apply environment variables:
```bash
vercel --prod
```

### Step 5: Verify Frontend Deployment

1. Vercel provides a URL like: `https://your-project-name.vercel.app`
2. Visit the URL and test the application
3. Check browser console for any errors
4. Test the evaluation flow end-to-end

### Step 6: Set Up Custom Domain (Optional)

1. In Vercel dashboard → Your project → **"Settings"** → **"Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel automatically provisions SSL certificates

---

## Post-Deployment Configuration

### Update Backend CORS (Important for Production)

After deploying the frontend, update the backend CORS configuration:

**File**: `backend/main.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "https://your-custom-domain.com",
        "http://localhost:3000",  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then redeploy the backend to Render.

### Update Frontend API URL (If Backend URL Changed)

1. In Vercel dashboard → Your project → **"Settings"** → **"Environment Variables"**
2. Update `NEXT_PUBLIC_API_URL` with the new backend URL
3. Redeploy or wait for automatic redeployment

---

## Troubleshooting

### Backend Issues

**Problem**: Service fails to start
- **Solution**: Check Render logs. Common issues:
  - Missing environment variables → Add `OPENROUTER_API_KEY`
  - Wrong start command → Ensure `--port $PORT` is included
  - Wrong root directory → Set to `backend` in Render settings

**Problem**: Build fails with Rust compilation errors (pydantic-core)
- **Solution**: 
  - Ensure Python version is 3.11.9 (not 3.13)
  - Set `pythonVersion: 3.11.9` in render.yaml or manually select Python 3.11.9 in Render dashboard
  - Update requirements.txt to use newer versions with better wheel support
  - The error "Read-only file system" happens when pydantic-core tries to compile from source - using Python 3.11.9 with pre-built wheels fixes this

**Problem**: `TypeError: OpenAIChatModel.__init__() got an unexpected keyword argument 'base_url'`
- **Solution**: 
  - This error occurs with newer versions of pydantic-ai (≥1.0.0)
  - Use the provider pattern instead: create `OpenAIProvider` with `base_url` and `api_key`, then pass it to `OpenAIModel`
  - See updated code in `backend/agents/interview_evaluator.py`

**Problem**: `Unknown keyword arguments: 'result_type'`
- **Solution**: 
  - In newer versions of pydantic-ai (≥1.0.0), `result_type` has been renamed to `output_type`
  - Change `result_type=YourModel` to `output_type=YourModel` in Agent initialization
  - See updated code in `backend/agents/interview_evaluator.py`

**Problem**: Render still using Python 3.13 despite configuration
- **Solution**: 
  - If using render.yaml, ensure it's in the root directory
  - Manually set Python version in Render dashboard: Settings → Python Version → Select **3.11.9** (exact version)
  - Also create `backend/runtime.txt` with `python-3.11.9` as additional safeguard

**Problem**: CORS errors in browser
- **Solution**: Update CORS origins in `backend/main.py` to include your frontend URL

**Problem**: "502 Bad Gateway" or timeout
- **Solution**: 
  - Free tier services spin down after inactivity
  - First request after spin-down takes time (normal on free tier)
  - Upgrade to paid plan for 24/7 availability

**Problem**: Module import errors
- **Solution**: Ensure `rootDir` is set to `backend` in Render settings

### Frontend Issues

**Problem**: "Failed to fetch" or API errors
- **Solution**: 
  - Check `NEXT_PUBLIC_API_URL` environment variable is set correctly
  - Ensure backend is running (check Render dashboard)
  - Verify CORS configuration allows your frontend domain

**Problem**: Build fails on Vercel
- **Solution**: 
  - Check build logs in Vercel dashboard
  - Ensure `rootDir` is set to `frontend`
  - Verify `package.json` has correct build scripts
  - Check Node.js version compatibility

**Problem**: Environment variables not working
- **Solution**: 
  - Variables starting with `NEXT_PUBLIC_` are exposed to browser
  - Must redeploy after adding/changing environment variables
  - Check variable names match exactly (case-sensitive)

**Problem**: Blank page or 404
- **Solution**: 
  - Verify `rootDir` is set to `frontend` in Vercel settings
  - Check Next.js build completed successfully
  - Verify `app` directory structure is correct

### General Issues

**Problem**: Changes not reflecting after deployment
- **Solution**: 
  - Clear browser cache
  - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
  - Check deployment logs for build errors
  - Verify code is pushed to the correct branch

**Problem**: API key errors
- **Solution**: 
  - Verify `OPENROUTER_API_KEY` is set in Render environment variables
  - Check API key is valid and has credits
  - Review backend logs for specific error messages

---

## Testing Production Deployment

### 1. Test Backend API

```bash
# Health check
curl https://your-backend.onrender.com/health

# Test evaluation endpoint
curl -X POST https://your-backend.onrender.com/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Tell me about yourself",
    "job_role": "Software Engineer",
    "answer": "I am a software engineer with 5 years of experience..."
  }'
```

### 2. Test Frontend

1. Visit your Vercel URL
2. Fill out the evaluation form
3. Submit and verify:
   - Loading state appears
   - Results display correctly
   - All sections (score, strengths, weaknesses, tips, improved answer) show
   - No console errors

### 3. Monitor Logs

**Render Logs:**
- Dashboard → Your service → **"Logs"** tab
- Monitor for errors or slow responses

**Vercel Logs:**
- Dashboard → Your project → **"Deployments"** → Click deployment → **"Functions"** tab
- Check for runtime errors

---

## Quick Reference Commands

### Render (Backend)

**Manual Deploy (via Git push):**
```bash
git add .
git commit -m "Deploy to production"
git push origin main
# Render auto-deploys on push
```

**Check Service Status:**
```bash
# Visit Render dashboard or use their CLI
render services list
```

### Vercel (Frontend)

**Deploy to Production:**
```bash
cd frontend
vercel --prod
```

**Preview Deployment:**
```bash
vercel
```

**View Logs:**
```bash
vercel logs [project-url]
```

**Link Local Project:**
```bash
vercel link
```

---

## Production Checklist

Before going live, ensure:

- [ ] Backend deployed and accessible on Render
- [ ] Frontend deployed and accessible on Vercel
- [ ] Environment variables configured on both platforms
- [ ] CORS configured to allow frontend domain
- [ ] API documentation accessible (`/docs` endpoint)
- [ ] Health endpoint responding
- [ ] End-to-end evaluation flow tested
- [ ] Error handling working correctly
- [ ] Loading states functioning
- [ ] Mobile responsiveness verified
- [ ] Custom domain configured (if applicable)

---

## Cost Estimation

### Free Tier (Sufficient for Development/Demo)

**Render (Backend):**
- Free tier: 750 hours/month
- Spins down after 15 min inactivity
- Sufficient for demo/small projects

**Vercel (Frontend):**
- Free tier: Unlimited static deployments
- 100GB bandwidth/month
- Perfect for frontend hosting

### Paid Options (For Production)

**Render:**
- Starter: $7/month - Always-on service
- Professional: $25/month - Better performance

**Vercel:**
- Pro: $20/month - Enhanced features, analytics
- Enterprise: Custom pricing

---

## Support Resources

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **Next.js Documentation**: https://nextjs.org/docs
- **OpenRouter Documentation**: https://openrouter.ai/docs

---

## Next Steps After Deployment

1. Set up monitoring (optional):
   - Use Render's built-in metrics
   - Add Vercel Analytics
   - Set up error tracking (Sentry, etc.)

2. Configure custom domains:
   - Backend: `api.yourdomain.com`
   - Frontend: `yourdomain.com`

3. Set up CI/CD (optional):
   - Automatic deployments on git push (already configured)
   - Add tests to deployment pipeline

4. Optimize performance:
   - Enable Vercel Edge Functions
   - Add caching strategies
   - Optimize bundle sizes

---

**Last Updated**: 2024

For issues or questions, refer to the main [README.md](./README.md) or the troubleshooting section above.
