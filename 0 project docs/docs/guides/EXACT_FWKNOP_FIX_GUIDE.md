# ViWorkS Client - Fixed SPA Command

## 🚀 **The Fix Is Here!**

We've identified and fixed the issue with the fwknop command. The new version (v1.4.0) uses **exactly** the same command format that works when you run fwknop manually.

### **What Was Wrong**

The client was using the wrong command-line arguments for fwknop:
- Using `-k` and `-H` for keys instead of `--key-rijndael` and `--key-hmac`
- Missing the `-s` (Source NAT) option
- Missing the `--use-hmac` flag
- Using unsupported options like `-t` (timeout)

### **What We Fixed**

We've updated the client to use the exact same command that works for you:

```
fwknop.exe -A tcp/8443 -s -D 10.20.30.17 --key-rijndael VeryStrongSecretKey121212 --key-hmac AnotherStrongHMACKey123456 --use-hmac
```

## 📋 **Instructions**

1. **Download** the `ViWorkS-Client-v1.4.0-Windows-x64.zip` file
2. **Extract** it to any folder on your computer
3. Make sure `fwknop.exe` is in the same folder as `viworks-desktop.exe` or in the `bin` subfolder
4. **Run** `viworks-desktop.exe`
5. Enter your connection information:
   - Server: `10.20.30.17`
   - Port: `8443`
   - Key: `VeryStrongSecretKey121212`
   - HMAC: `AnotherStrongHMACKey123456`
6. Click the "🚀 Simple Connect" button

## 🔍 **What to Expect**

With this update, you should see:
1. No more `invalid option -- t` errors
2. Successful SPA packet sending
3. Port opening on the server
4. VPN connection establishing

## 🔧 **Technical Details**

We changed the fwknop command from:

```rust
cmd.args(&[
    "-A", &format!("tcp/{}", config.server_port),
    "-D", &config.server_host,
    "-k", config.fwknop_key.as_str(),
    "-H", config.fwknop_hmac.as_str(),
    "-n", "1",
    "-R",
    "-t", "1",
    "--verbose",
]);
```

To:

```rust
cmd.args(&[
    "-A", &format!("tcp/{}", config.server_port),
    "-s",
    "-D", &config.server_host,
    "--key-rijndael", config.fwknop_key.as_str(),
    "--key-hmac", config.fwknop_hmac.as_str(),
    "--use-hmac"
]);
```

This matches exactly the command that works when run manually.

---

**Version:** 1.4.0  
**Last Updated:** August 16, 2025
