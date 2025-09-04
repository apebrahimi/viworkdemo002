# GitHub Secrets Setup Guide

## 🎯 **REQUIRED GITHUB SECRETS**

To enable the GitHub Actions deployment to work, you need to configure the following secrets in your GitHub repository.

### **📋 Secrets to Add:**

1. **`DIGITALOCEAN_HOST`**
   - Value: `64.227.46.188`

2. **`DIGITALOCEAN_USERNAME`**
   - Value: `root`

3. **`DIGITALOCEAN_SSH_KEY`**
   - Value: (Copy the entire private key below)

---

## 🔑 **SSH PRIVATE KEY**

Copy this entire private key (including the BEGIN and END lines):

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACAmY2919EP8f+qMRDDNY8kzMuV6b8Ydgdzlf6Ut9hQiGgAAAKgTwe+0E8Hv
tAAAAAtzc2gtZWQyNTUxOQAAACAmY2919EP8f+qMRDDNY8kzMuV6b8Ydgdzlf6Ut9hQiGg
AAAEA57ilnN/8/EUTrLCqQLWcCXgN81hnerjChWAgCz8078iZjb3X0Q/x/6oxEMM1jyTMy
5Xpvxh2B3OV/pS32FCIaAAAAJGFib2xmYXpsQEFib2xmYXpscy1NYWNCb29rLVByby5sb2
NhbAE=
-----END OPENSSH PRIVATE KEY-----
```

---

## 📝 **STEP-BY-STEP SETUP**

### **Step 1: Navigate to Repository Secrets**
1. Go to: https://github.com/apebrahimi/viworkdemo002/settings/secrets/actions
2. Click **"New repository secret"**

### **Step 2: Add DIGITALOCEAN_HOST**
1. **Name**: `DIGITALOCEAN_HOST`
2. **Secret**: `64.227.46.188`
3. Click **"Add secret"**

### **Step 3: Add DIGITALOCEAN_USERNAME**
1. **Name**: `DIGITALOCEAN_USERNAME`
2. **Secret**: `root`
3. Click **"Add secret"**

### **Step 4: Add DIGITALOCEAN_SSH_KEY**
1. **Name**: `DIGITALOCEAN_SSH_KEY`
2. **Secret**: (Copy the entire private key from above)
3. Click **"Add secret"**

---

## ✅ **VERIFICATION**

After adding all three secrets, you should see:
- `DIGITALOCEAN_HOST`
- `DIGITALOCEAN_USERNAME`
- `DIGITALOCEAN_SSH_KEY`

In your repository secrets list.

---

## 🚀 **TESTING THE DEPLOYMENT**

Once the secrets are configured:

1. **Trigger the workflow** by pushing a small change:
   ```bash
   git commit --allow-empty -m "Test deployment with secrets"
   git push origin main
   ```

2. **Monitor the deployment** at:
   https://github.com/apebrahimi/viworkdemo002/actions

3. **Expected result**: The deployment should now complete successfully!

---

## 🔒 **SECURITY NOTES**

- **SSH Key**: This is your private key - keep it secure
- **GitHub Secrets**: Are encrypted and only accessible to the repository
- **Access Control**: Only repository collaborators can view/use these secrets

---

## 🎉 **SUCCESS INDICATORS**

When the deployment works, you should see:
- ✅ **Build phase**: Completes successfully
- ✅ **Deploy phase**: Completes successfully  
- ✅ **Health check**: Passes successfully
- ✅ **Backend Agent**: Running on the server

---

## 📞 **TROUBLESHOOTING**

If you encounter issues:

1. **Check secret names**: Must be exactly as shown above
2. **Check SSH key**: Must include BEGIN and END lines
3. **Check server access**: Ensure the server is accessible
4. **Check logs**: Review GitHub Actions logs for specific errors

---

**Once these secrets are configured, the GitHub Actions deployment will work perfectly!** 🚀
