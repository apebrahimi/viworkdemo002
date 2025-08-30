# 🔧 Update SSH Key for GitHub Actions

The test failed because your original SSH key has a passphrase, but GitHub Actions can't handle passphrases automatically. I've created a new SSH key without a passphrase specifically for GitHub Actions.

## 📋 Update Your GitHub Secret

### **1. Go to your GitHub repository:**
https://github.com/apebrahimi/viworkdemo002

### **2. Update the SSH_PRIVATE_KEY secret:**
1. Click on **"Settings"** tab
2. Click on **"Secrets and variables"** → **"Actions"**
3. Find the **"SSH_PRIVATE_KEY"** secret
4. Click the **pencil icon** to edit it
5. **Replace** the entire content with the new key below:

### **New SSH_PRIVATE_KEY Value:**
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACAAgZIwEDO6TUok2xAxb8aid61CyGcuc4uFxM3Pj82PFwAAAKDjmdDt45nQ
7QAAAAtzc2gtZWQyNTUxOQAAACAAgZIwEDO6TUok2xAxb8aid61CyGcuc4uFxM3Pj82PFw
AAAEAApqfy6EfHq/OAa/KAXB4ulp4LvdwowkfY6dudUcy5AwCBkjAQM7pNSiTbEDFvxqJ3
rULIZy5zi4XEzc+PzY8XAAAAFmdpdGh1Yi1hY3Rpb25zQHZpd29ya3MBAgMEBQYH
-----END OPENSSH PRIVATE KEY-----
```

### **3. Click "Update secret"**

## ✅ **What Changed**

- **Old key:** Had a passphrase (caused the timeout)
- **New key:** No passphrase (works with GitHub Actions)
- **Security:** Both keys are equally secure, but the new one is specifically for automation

## 🧪 **Test Again**

After updating the secret:

1. Go to **Actions** tab
2. Click **"Test Deployment Setup"**
3. Click **"Run workflow"**
4. Click **"Run workflow"** again to confirm

## 🔒 **Security Note**

The new SSH key:
- ✅ Is specifically created for GitHub Actions
- ✅ Has no passphrase (required for automation)
- ✅ Is already added to your droplet
- ✅ Is separate from your personal SSH key
- ✅ Can be revoked/replaced anytime

## 🚀 **Expected Result**

The test should now pass and show:
- ✅ SSH connection successful
- ✅ Docker and Docker Compose working
- ✅ Application directory ready
- ✅ Web endpoints accessible

## 📞 **If It Still Fails**

If the test still fails after updating the SSH key, check:
1. The secret was updated correctly
2. The entire key content was copied (including BEGIN and END lines)
3. No extra spaces or characters were added

---

**After updating the secret, run the test workflow again!** 🎯
