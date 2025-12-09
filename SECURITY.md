# Security Guidelines

## ✅ Current Security Status

Your MongoDB credentials are **SAFE** and not tracked by git.

## 🔒 What's Protected

1. **`.env` files** - Listed in `.gitignore`, never committed
2. **MongoDB credentials** - Only in local `.env` file
3. **JWT secrets** - Only in local `.env` file
4. **Uploads folder** - User-uploaded files not tracked

## ⚠️ Important Reminders

### Never Commit These Files:
- `backend/.env`
- `frontend/.env`
- `backend/uploads/*`
- Any file with real credentials

### Before Pushing to Git:
```bash
# Always check what you're committing
git status

# Make sure .env is NOT listed
git ls-files | grep .env

# If .env appears, remove it immediately:
git rm --cached backend/.env
git rm --cached frontend/.env
```

## 🔐 MongoDB Security

### Current Credentials Location:
- **File:** `backend/.env` (NOT in git ✅)
- **Status:** Protected by `.gitignore`

### Rotate Your Password If:
- You accidentally committed `.env` to git
- You shared your screen with `.env` visible
- You suspect unauthorized access

### How to Rotate MongoDB Password:
1. Go to MongoDB Atlas dashboard
2. Database Access → Edit User
3. Change password
4. Update `backend/.env` with new password
5. Restart your backend server

## 🛡️ Additional Security Steps

### 1. Use Strong JWT Secret
Replace the default JWT secret in `backend/.env`:
```bash
# Generate a strong secret (run in terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Then update in `backend/.env`:
```env
JWT_SECRET=<paste-generated-secret-here>
```

### 2. Environment-Specific Configs

**Development** (current):
```env
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
```

**Production** (when deploying):
- Use environment variables in hosting platform
- Never hardcode credentials in code
- Use secrets management (Heroku Config Vars, Vercel Env Variables, etc.)

### 3. MongoDB Atlas Security

Recommended settings in MongoDB Atlas:
- ✅ Enable IP Whitelist (restrict access)
- ✅ Use strong passwords (16+ characters)
- ✅ Enable database auditing
- ✅ Regular backups enabled
- ✅ Use least-privilege user accounts

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use environment variables (not .env files) in production
- [ ] Enable MongoDB IP whitelist
- [ ] Use HTTPS for all connections
- [ ] Set NODE_ENV=production
- [ ] Review and limit CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts

## 🚨 If Credentials Are Exposed

If you accidentally commit credentials:

1. **Immediately rotate all secrets:**
   - Change MongoDB password
   - Generate new JWT secret
   - Update `.env` file

2. **Remove from git history:**
   ```bash
   # Remove file from git history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: rewrites history)
   git push origin --force --all
   ```

3. **Notify your team** if it's a shared repository

## 📚 Resources

- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## ✨ Current Status Summary

✅ `.env` files are in `.gitignore`  
✅ MongoDB credentials are NOT in git  
✅ `.env.example` has placeholder values  
✅ Uploads folder is ignored  
⚠️ Remember to use strong JWT secret  
⚠️ Rotate credentials before production  

Your secrets are safe! 🔒
