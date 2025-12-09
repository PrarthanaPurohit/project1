# Vercel Deployment Guide

This guide will help you deploy the MERN Showcase Platform to Vercel.

## Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. MongoDB Atlas database (already configured)

## Deployment Steps

### Part 1: Push Code to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `showcase`
   - Make it Public or Private
   - Don't initialize with README
   - Click "Create repository"

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/showcase.git
   git branch -M main
   git push -u origin main
   ```

### Part 2: Deploy Backend to Vercel

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository:**
   - Select your GitHub repository `showcase`
   - Click "Import"

3. **Configure Backend Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/showcase?retryWrites=true&w=majority
   JWT_SECRET=your_strong_jwt_secret_here
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the deployment URL (e.g., `https://showcase-backend.vercel.app`)

### Part 3: Deploy Frontend to Vercel

1. **Create New Project:**
   - Go back to Vercel Dashboard
   - Click "Add New" → "Project"
   - Select the same `showcase` repository

2. **Configure Frontend Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build/client`
   - **Install Command:** `npm install`

3. **Add Environment Variables:**
   ```
   VITE_API_URL=https://YOUR_BACKEND_URL.vercel.app/api
   VITE_NODE_ENV=production
   ```
   Replace `YOUR_BACKEND_URL` with your backend deployment URL from Part 2.

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be live at `https://showcase-frontend.vercel.app`

### Part 4: Update Backend CORS

After deploying the frontend, update your backend to allow the frontend URL:

1. Edit `backend/server.js` and update CORS configuration:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://YOUR_FRONTEND_URL.vercel.app'
     ],
     credentials: true
   }));
   ```

2. Commit and push:
   ```bash
   git add backend/server.js
   git commit -m "Update CORS for production"
   git push
   ```

3. Vercel will automatically redeploy the backend.

## Post-Deployment

### Seed the Database

Run the seed script to add initial admin user and sample data:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to your backend project
cd backend
vercel link

# Run seed command
vercel env pull .env.local
node scripts/seed.js --with-samples
```

### Test Your Deployment

1. **Frontend:** Visit your frontend URL
2. **Backend API:** Visit `https://YOUR_BACKEND_URL.vercel.app/`
3. **Login:** Use `admin` / `admin123`

## Important Notes

### File Uploads

⚠️ **Vercel has read-only filesystem!** Uploaded images won't persist between deployments.

**Solutions:**
1. **Use Cloudinary (Recommended):**
   - Sign up at https://cloudinary.com
   - Update `backend/utils/imageProcessor.js` to use Cloudinary
   - Add Cloudinary credentials to Vercel environment variables

2. **Use AWS S3:**
   - Set up S3 bucket
   - Update image processor to upload to S3

3. **Use Vercel Blob Storage:**
   - Use `@vercel/blob` package
   - Update image handling code

### Environment Variables

Never commit `.env` files! Always use Vercel's environment variables dashboard.

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Backend Issues

**Problem:** API not responding
- Check Vercel logs: `vercel logs YOUR_BACKEND_URL`
- Verify environment variables are set correctly
- Check MongoDB connection string

**Problem:** CORS errors
- Ensure frontend URL is in CORS whitelist
- Check that credentials are enabled

### Frontend Issues

**Problem:** API calls failing
- Verify `VITE_API_URL` points to correct backend URL
- Check browser console for errors
- Ensure backend is deployed and running

**Problem:** Build fails
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Try building locally: `npm run build`

## Alternative: Deploy Backend Elsewhere

If you prefer, deploy the backend to:
- **Render:** https://render.com (Free tier available)
- **Railway:** https://railway.app (Free tier available)
- **Heroku:** https://heroku.com (Paid)

Then deploy only the frontend to Vercel.

## Support

For issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Check deployment logs in Vercel dashboard
3. Review MongoDB Atlas connection settings

---

**Your app will be live at:**
- Frontend: `https://YOUR_PROJECT.vercel.app`
- Backend: `https://YOUR_BACKEND.vercel.app`

🎉 Happy deploying!
