# 🔧 Manual GitHub Secrets Setup

Since GitHub CLI is not installed, you need to manually add these secrets to your GitHub repository.

## 📋 Steps to Add GitHub Secrets

1. **Go to your GitHub repository:** https://github.com/apebrahimi/viworkdemo002
2. **Click on "Settings" tab**
3. **Click on "Secrets and variables" → "Actions"**
4. **Click "New repository secret"**
5. **Add these 3 secrets:**

### Secret 1: DROPLET_IP
- **Name:** `DROPLET_IP`
- **Value:** `64.227.46.188`

### Secret 2: DROPLET_USER
- **Name:** `DROPLET_USER`
- **Value:** `root`

### Secret 3: SSH_PRIVATE_KEY
- **Name:** `SSH_PRIVATE_KEY`
- **Value:** (Copy the entire content below)
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABA/PLe61M
HIYACSzwV1VEBqAAAAGAAAAAEAAAAzAAAAC3NzaC1lZDI1NTE5AAAAICZjb3X0Q/x/6oxE
MM1jyTMy5Xpvxh2B3OV/pS32FCIaAAAAsPtfXk7HSrMxirFwWJQa2AOYCnht9fqfPn7ak+
WSvy8Or3Etm0ERJEgAFYjafObdrXnw+D42vWYOia7kj8b9jl4CaYDdx3qn16OBhcrh/fhd
x9Z813uLrpAidWhyM/Eqiq03n1DxctPYPV09GAgKaOtK/CDCtZi86gaxhVEkCd/NEiNiuW
8PLOp1F1yolfZ46jjbQSPny/+GsX4v605pGmqLiJ8AibsnWmKo8b3bvzUP
-----END OPENSSH PRIVATE KEY-----
```

## ✅ After Adding Secrets

1. **Push the workflows to GitHub:**
   ```bash
   git add .
   git commit -m "Add CI/CD workflows"
   git push
   ```

2. **Go to Actions tab** in your GitHub repository

3. **Run the "Test Deployment Setup" workflow** to verify everything works

4. **Start using automated deployments!**

## 🚀 Quick Test

After setting up secrets, you can test the connection by running:
```bash
./test-ci-cd-setup.sh
```

## 📞 Need Help?

If you encounter any issues:
1. Check that all 3 secrets are added correctly
2. Verify the SSH key content is complete (including the BEGIN and END lines)
3. Make sure your droplet IP is correct: `64.227.46.188`
