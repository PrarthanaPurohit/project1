# Vercel Deployment Checklist

## ✅ Pre-Deployment

- [x] MongoDB credentials secured (not in git)
- [x] `.env` files in `.gitignore`
- [x] CORS configured for production
- [x] Vercel config files created
- [ ] Code pushed to GitHub

## 📦 Backend Deployment

- [ ] Create Vercel project for backend
- [ ] Set root directory to `backend`
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=your_mongodb_connection_string`
  - [ ] `JWT_SECRET=your_strong_secret`
  - [ ] `JWT_EXPIRE=7d`
  - [ ] `MAX_FILE_SIZE=5242880`
  - [ ] `UPLOAD_PATH=./uploads`
- [ ] Deploy backend
- [ ] Copy backend URL

## 🎨 Frontend Deployment

- [ ] Create Vercel project for frontend
- [ ] Set root directory to `frontend`
- [ ] Add environment variables:
  - [ ] `VITE_API_URL=https://your-backend-url.vercel.app/api`
  - [ ] `VITE_NODE_ENV=production`
- [ ] Deploy frontend
- [ ] Copy frontend URL

## 🔧 Post-Deployment

- [ ] Update backend `FRONTEND_URL` environment variable with frontend URL
- [ ] Test login functionality
- [ ] Test API endpoints
- [ ] Seed database with admin user
- [ ] Test image uploads (note: Vercel has limitations)

## ⚠️ Important Notes

### File Uploads
Vercel has a read-only filesystem. For production, you need to:
- Use Cloudinary for image storage
- Or use AWS S3
- Or use Vercel Blob Storage

### Environment Variables
Backend needs:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
FRONTEND_URL=https://your-frontend.vercel.app
```

Frontend needs:
```
VITE_API_URL=https://your-backend.vercel.app/api
VITE_NODE_ENV=production
```

## 🚀 Quick Deploy Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy via Vercel Dashboard
# Visit https://vercel.com/dashboard
# Import your GitHub repository
# Follow the steps in VERCEL_DEPLOYMENT.md

# 3. Or use Vercel CLI
npm install -g vercel
vercel login
cd backend && vercel
cd ../frontend && vercel
```

## 📝 URLs After Deployment

- **Frontend:** https://__________.vercel.app
- **Backend:** https://__________.vercel.app
- **Admin Login:** admin / admin123

---

See `VERCEL_DEPLOYMENT.md` for detailed instructions!
