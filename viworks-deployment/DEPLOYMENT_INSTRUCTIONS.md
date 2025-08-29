# 🚀 DigitalOcean Deployment Instructions

## 📋 **Current Status**

✅ **Separate repositories created** in `viworks-deployment/` folder:
- `viworks-backend/` - Clean Rust backend
- `viworks-frontend/` - Clean Next.js frontend

## 🎯 **Step-by-Step Instructions**

### **Step 1: Create GitHub Repositories**

1. **Go to GitHub** and create two new repositories:
   - Repository name: `viworks-backend`
   - Repository name: `viworks-frontend`
   - Make them **public** (easier for DigitalOcean)
   - **Don't** initialize with README, .gitignore, or license

### **Step 2: Push Backend to GitHub**

```bash
# Navigate to backend folder
cd viworks-backend

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/viworks-backend.git

# Push to GitHub
git push -u origin master
```

### **Step 3: Push Frontend to GitHub**

```bash
# Navigate to frontend folder
cd ../viworks-frontend

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/viworks-frontend.git

# Push to GitHub
git push -u origin master
```

### **Step 4: Deploy Backend to DigitalOcean**

1. **Go to DigitalOcean App Platform**
2. **Click "Create App"**
3. **Connect to GitHub**:
   - Select **GitHub** as provider
   - Choose **viworks-backend** repository
   - Select **master** branch
4. **Leave "Source directories" EMPTY** (don't add any paths)
5. **Click "Next"**
6. **DigitalOcean will automatically detect**:
   - `.do/app.yaml` configuration
   - Rust environment
   - Build settings
7. **Click "Create Resources"**

### **Step 5: Deploy Frontend to DigitalOcean**

1. **Click "Create App"** again
2. **Connect to GitHub**:
   - Select **GitHub** as provider
   - Choose **viworks-frontend** repository
   - Select **master** branch
3. **Leave "Source directories" EMPTY** (don't add any paths)
4. **Click "Next"**
5. **Update Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://viworks-backend-{BACKEND_APP_ID}.ondigitalocean.app`
   - `NEXT_PUBLIC_WS_URL`: `wss://viworks-backend-{BACKEND_APP_ID}.ondigitalocean.app`
6. **Click "Create Resources"**

## 🔧 **Important Notes**

### **Source Directories**
- **Leave EMPTY** - Don't add any paths
- DigitalOcean will use the root of each repository
- The `.do/app.yaml` files are already configured correctly

### **Repository Structure**
Each repository should contain:
```
viworks-backend/
├── .do/app.yaml          # DigitalOcean config
├── Cargo.toml            # Rust dependencies
├── Dockerfile            # Container build
└── src/                  # Source code

viworks-frontend/
├── .do/app.yaml          # DigitalOcean config
├── package.json          # Node.js dependencies
├── Dockerfile            # Container build
└── src/                  # Source code
```

### **Environment Variables**
After deployment, update the frontend environment variables with the correct backend URLs.

## 🎉 **Expected Results**

- **Backend URL**: `https://viworks-backend-{APP_ID}.ondigitalocean.app`
- **Frontend URL**: `https://viworks-frontend-{APP_ID}.ondigitalocean.app`
- **Health Check**: `https://viworks-backend-{APP_ID}.ondigitalocean.app/health`

## 🆘 **Troubleshooting**

If you get errors:
1. **Make sure repositories are public**
2. **Don't add source directories**
3. **Use master branch** (not main)
4. **Check that `.do/app.yaml` files exist in each repository**

---

**Status**: Ready for GitHub push and DigitalOcean deployment
