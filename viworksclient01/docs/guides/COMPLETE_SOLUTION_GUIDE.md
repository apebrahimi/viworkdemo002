# ViWorkS Client - Complete Solution Guide (v1.6.0)

## 🎉 **Complete End-to-End Solution**

We've created a complete solution that handles both the SPA and OpenVPN connection in one seamless process. This version (v1.6.0) includes:

1. **Correct fwknop SPA command** - Using the exact format that works
2. **Universal OpenVPN launcher** - Works across different Windows versions
3. **Comprehensive logging** - Both in the UI and in log files
4. **Detailed diagnostics** - For troubleshooting connection issues

## 🛠️ **What We Fixed**

### **1. Fixed fwknop Command Format**
- Now using the exact command that works for your client:
```
fwknop.exe -A tcp/8443 -s -D 10.20.30.17 --key-rijndael VeryStrongSecretKey121212 --key-hmac AnotherStrongHMACKey123456 --use-hmac
```

### **2. Universal OpenVPN Launcher**
- Created a batch file approach that works across all Windows versions
- Tries multiple OpenVPN locations automatically
- Captures all output to log files for troubleshooting

### **3. Enhanced UI with Logs**
- Added connection logs panel to the UI
- Shows OpenVPN output in real-time
- Provides detailed diagnostics

## 📋 **Instructions for Your Client**

### **Step 1: Download and Install**
1. Download the `ViWorkS-Client-v1.6.0-Windows-x64.zip` file
2. Extract it to any folder on your computer
3. Make sure `fwknop.exe` is in the same folder as `viworks-desktop.exe` or in the `bin` subfolder
4. Make sure `openvpn.exe` is available (either in the same folder, in `bin` subfolder, or installed at `C:\Program Files\OpenVPN\bin\openvpn.exe`)

### **Step 2: Run the Application**
1. Run `viworks-desktop.exe` as Administrator
2. Enter your connection information:
   - Server: `10.20.30.17`
   - Port: `8443`
   - Key: `VeryStrongSecretKey121212`
   - HMAC: `AnotherStrongHMACKey123456`

### **Step 3: Connect**
1. Click the "🚀 Simple Connect" button
2. The application will:
   - Send the SPA packet using the correct format
   - Launch OpenVPN in a separate window
   - Show connection logs in the UI

### **Step 4: Monitor the Connection**
1. Check the "📊 Connection Logs" panel for status updates
2. If OpenVPN is running, you'll see its output in the logs
3. You can click "🔄 Refresh Logs" to update the display

## 🔍 **Troubleshooting**

If you encounter issues:

1. Click "🔍 Run Diagnostics" to check all components
2. Check the log files in the temp directory (shown in the logs panel)
3. Make sure OpenVPN is installed correctly
4. Try running the application as Administrator
5. Check if the port is open using `Test-NetConnection 10.20.30.17 -p 8443`

## 🔧 **Technical Details**

### **1. How the Connection Works**

1. **SPA Process**:
   - Client sends SPA packet using fwknop
   - Server opens the port (8443)
   - Client verifies the port is open

2. **OpenVPN Process**:
   - Client creates a temporary OpenVPN config file
   - Client creates a batch file to launch OpenVPN
   - Batch file tries multiple OpenVPN locations
   - OpenVPN connects to the server through the opened port
   - All output is captured to log files

### **2. Log Files**

The client creates the following log files in the temp directory:

1. `connection_log.txt` - Basic connection information
2. `openvpn_output.log` - Output from the OpenVPN process

These logs are displayed in the UI and can be refreshed as needed.

---

**Version:** 1.6.0  
**Last Updated:** August 16, 2025
