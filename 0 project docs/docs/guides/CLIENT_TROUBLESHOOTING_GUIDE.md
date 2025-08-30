# ViWorkS Client Troubleshooting Guide

## 🚨 **Your Client's Connection Issue - Step-by-Step Resolution**

### **Step 1: Use the Enhanced Diagnostic Tool**

The new version (v1.1.0) includes a powerful diagnostic tool that will help identify exactly what's wrong:

1. **Launch the application**
2. **Enter all server information** (host, port, keys, etc.)
3. **Click "🔍 Run Diagnostics"** button
4. **Review the diagnostic results** - this will show exactly what's failing

### **Step 2: Common Issues and Solutions**

#### **🔴 Issue: "Server host is empty" or "Server port is empty"**
**Solution:**
- Double-check that you've entered the server hostname/IP address
- Verify the port number is correct (usually 8443, 1194, or similar)
- Make sure there are no extra spaces

#### **🔴 Issue: "fwknop key is empty" or "fwknop HMAC is empty"**
**Solution:**
- Verify you have the correct fwknop key and HMAC from your administrator
- Check that you've copied the entire key (no missing characters)
- Ensure there are no extra spaces or line breaks

#### **🔴 Issue: "fwknop.exe not found" or "openvpn.exe not found"**
**Solution:**
- **Option 1:** Run the installer script (`install.ps1`) as Administrator
- **Option 2:** Manually copy the binaries:
  - Download `fwknop.exe` and `openvpn.exe`
  - Place them in the same folder as `viworks-desktop.exe`
  - Or create a `bin` folder and place them there

#### **🔴 Issue: "Network connectivity failed"**
**Solution:**
- Check your internet connection
- Try accessing other websites
- Check if your firewall is blocking the application
- Try running the application as Administrator

#### **🔴 Issue: "Timezone check failed"**
**Solution:**
- Contact your system administrator
- This is usually a security requirement and cannot be bypassed

#### **🔴 Issue: Connection fails at "SPA sent, probing port" step**
**Solution:**
- **Most Common Cause:** Incorrect server information
  - Double-check server hostname/IP address
  - Verify the port number
  - Confirm fwknop key and HMAC are correct
- **Network Issues:**
  - Check if you can ping the server
  - Verify your firewall isn't blocking the connection
  - Try from a different network if possible

#### **🔴 Issue: Connection fails at "Starting OpenVPN" step**
**Solution:**
- **Run as Administrator:** Right-click the application → "Run as Administrator"
- **Check Windows Firewall:** Allow the application through Windows Firewall
- **Verify OpenVPN binary:** Make sure `openvpn.exe` is present and accessible
- **Check antivirus:** Some antivirus software may block OpenVPN

### **Step 3: Advanced Troubleshooting**

#### **🔍 Using the Diagnostic Tool**

The diagnostic tool will check:
1. **Input Validation** - Are all fields filled correctly?
2. **Binary Availability** - Are required files present?
3. **Network Connectivity** - Can you reach the internet?
4. **Timezone Check** - Is your system timezone allowed?
5. **Server Reachability** - Can you reach the target server?

#### **📋 What to Send to Support**

When contacting support, include:
1. **Screenshot of the diagnostic results**
2. **Screenshot of the status log**
3. **Your server information** (host, port - but NOT the keys)
4. **Error messages** from the application
5. **Your operating system version**

### **Step 4: Manual Testing**

If the diagnostic tool doesn't help, try these manual tests:

#### **Test 1: Ping the Server**
```cmd
ping your-server-hostname.com
```

#### **Test 2: Check Port Connectivity**
```cmd
telnet your-server-hostname.com 8443
```

#### **Test 3: Verify Binary Files**
```cmd
dir fwknop.exe
dir openvpn.exe
```

### **Step 5: Common Configuration Mistakes**

#### **❌ Wrong Server Information**
- Using `localhost` instead of actual server IP
- Wrong port number (using 1194 instead of 8443)
- Typo in server hostname

#### **❌ Incorrect Keys**
- Missing characters in fwknop key or HMAC
- Copying extra spaces or line breaks
- Using old/expired keys

#### **❌ Network Issues**
- Corporate firewall blocking the connection
- VPN interfering with the connection
- Antivirus software blocking the application

### **Step 6: Getting Help**

If you're still having issues:

1. **Run the diagnostic tool** and save the results
2. **Take screenshots** of any error messages
3. **Contact your system administrator** with:
   - Diagnostic results
   - Error screenshots
   - Server hostname and port (but NOT the keys)
   - Your operating system version

### **🔧 Quick Fix Checklist**

- [ ] All server fields are filled correctly
- [ ] No extra spaces in any fields
- [ ] Running as Administrator
- [ ] Firewall allows the application
- [ ] Antivirus isn't blocking it
- [ ] Required binaries are present
- [ ] Internet connection is working
- [ ] Server is reachable

### **📞 Support Information**

**For Technical Support:**
- Include diagnostic results
- Provide error screenshots
- Mention your OS version
- **Never share your fwknop keys or HMAC**

---

**Version:** 1.1.0  
**Last Updated:** August 16, 2025  
**For:** ViWorkS VPN Client Users
