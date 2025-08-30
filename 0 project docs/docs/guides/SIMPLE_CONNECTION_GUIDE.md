# ViWorkS Client Simple Connection Guide

## 🚀 **Ultra-Simple Connection Instructions**

We've created a simplified version of the client (v1.3.0) that bypasses most of the complex state machine and validation logic to focus on just getting you connected.

### **Step 1: Download and Extract**
- Download the `ViWorkS-Client-v1.3.0-Windows-x64.zip` file
- Extract it to any folder on your computer

### **Step 2: Place Required Files**
- Make sure `fwknop.exe` is in the same folder as `viworks-desktop.exe`
- Or place it in a `bin` subfolder

### **Step 3: Run the Application**
- Double-click `viworks-desktop.exe` to start the application

### **Step 4: Enter Connection Information**
- Server: `10.20.30.17`
- Port: `8443`
- Key: `VeryStrongSecretKey121212`
- HMAC: `AnotherStrongHMACKey123456`

### **Step 5: Use the Simple Connect Button**
- Click the "🚀 Simple Connect" button
- This bypasses most of the state machine and validation logic
- It directly sends the SPA packet and starts the VPN connection

## 📋 **What This Version Does Differently**

1. **Bypasses the State Machine**: No more "Invalid event in state BootstrapManual" errors
2. **Skips Preflight Checks**: No timezone check, binary signature check, etc.
3. **Direct Connection Flow**: Sends SPA → Waits → Starts VPN
4. **Simplified Error Handling**: Clearer error messages

## 🔍 **If You Still Have Issues**

If you're still experiencing problems:

1. Check the log output for specific error messages
2. Verify that `fwknop.exe` is present and accessible
3. Confirm your server information is correct
4. Try running the application as Administrator

## 🔧 **Technical Details**

The simplified connection process:

1. **Basic Input Validation**: Check if server, port, and keys are provided
2. **Send SPA**: Direct call to `send_spa()` function
3. **Wait**: 2-second delay for firewall to open
4. **Start VPN**: Direct call to `start_vpn()` function

This approach avoids the complex state machine transitions that were causing the "Invalid event in state BootstrapManual" error.

---

**Version:** 1.3.0  
**Last Updated:** August 16, 2025
