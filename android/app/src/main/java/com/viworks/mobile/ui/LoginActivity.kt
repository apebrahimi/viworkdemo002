package com.viworks.mobile.ui

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.provider.Telephony
import android.telephony.SmsManager
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import com.viworks.mobile.R
import com.viworks.mobile.model.LoginRequest
import com.viworks.mobile.model.LoginResponse
import com.viworks.mobile.service.AuthService
import com.viworks.mobile.util.PreferenceManager
import com.viworks.mobile.util.DeviceBindingManager
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    
    companion object {
        private const val TAG = "LoginActivity"
        private const val SMS_PERMISSION_REQUEST = 100
        private const val SMS_READ_PERMISSION_REQUEST = 101
    }
    
    private lateinit var etUsername: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: Button
    private lateinit var btnSmsLogin: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var tvStatus: TextView
    
    private lateinit var authService: AuthService
    private lateinit var preferenceManager: PreferenceManager
    private lateinit var deviceBindingManager: DeviceBindingManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        try {
            Log.d(TAG, "onCreate: Starting LoginActivity")
            super.onCreate(savedInstanceState)
            Log.d(TAG, "onCreate: Setting content view")
            setContentView(R.layout.activity_login)
            Log.d(TAG, "onCreate: Content view set successfully")
            
            // Initialize views
            Log.d(TAG, "onCreate: Initializing views")
            etUsername = findViewById(R.id.et_username)
            etPassword = findViewById(R.id.et_password)
            btnLogin = findViewById(R.id.btn_login)
            btnSmsLogin = findViewById(R.id.btn_sms_login)
            progressBar = findViewById(R.id.progress_bar)
            tvStatus = findViewById(R.id.tv_status)
            Log.d(TAG, "onCreate: Views initialized successfully")
            
            // Initialize services
            Log.d(TAG, "onCreate: Initializing services")
            authService = AuthService()
            preferenceManager = PreferenceManager(this)
            deviceBindingManager = DeviceBindingManager(this)
            Log.d(TAG, "onCreate: Services initialized successfully")
            
            // Check if user is already logged in
            Log.d(TAG, "onCreate: Checking if user is logged in")
            if (preferenceManager.getAuthToken() != null) {
                Log.d(TAG, "onCreate: Auth token found, checking device binding")
                
                // Check device binding before proceeding
                if (checkDeviceBinding()) {
                    Log.d(TAG, "onCreate: Device binding valid, starting MainActivity")
                    startMainActivity()
                    return
                } else {
                    Log.d(TAG, "onCreate: Device binding failed, clearing data and staying on login")
                    // Device binding failed, clear data and stay on login
                    preferenceManager.clearAll()
                    showError("دستگاه تغییر کرده است. لطفاً مجدداً وارد شوید.")
                }
            }
            
            // Set up button listeners
            Log.d(TAG, "onCreate: Setting up button listeners")
            btnLogin.setOnClickListener {
                performLogin()
            }
            
            btnSmsLogin.setOnClickListener {
                requestSmsLogin()
            }
            
            // Request SMS permissions
            Log.d(TAG, "onCreate: Requesting SMS permissions")
            requestSmsPermissions()
            
            Log.d(TAG, "onCreate: LoginActivity initialized successfully")
            
        } catch (e: Exception) {
            Log.e(TAG, "onCreate: Error initializing LoginActivity", e)
            // Show a simple error message
            try {
                setContentView(R.layout.activity_login)
                val errorText = findViewById<TextView>(R.id.tv_status)
                errorText?.text = "خطا در راه‌اندازی برنامه: ${e.message}"
            } catch (e2: Exception) {
                Log.e(TAG, "onCreate: Failed to show error message", e2)
            }
        }
    }
    
    private fun performLogin() {
        val username = etUsername.text.toString().trim()
        val password = etPassword.text.toString().trim()
        
        if (username.isEmpty() || password.isEmpty()) {
            showError(getString(R.string.login_please_enter_both))
            return
        }
        
        setLoading(true)
        tvStatus.text = getString(R.string.login_authenticating)
        
        lifecycleScope.launch {
            try {
                val loginRequest = LoginRequest(username, password)
                val result = authService.login(loginRequest)
                
                if (result.isSuccess) {
                    val loginResponse = result.getOrNull()
                    if (loginResponse?.success == true) {
                        // Save auth token
                        loginResponse.token?.let { token ->
                            preferenceManager.saveAuthToken(token)
                        }
                        preferenceManager.saveUsername(username)
                        
                        showSuccess(getString(R.string.login_successful))
                        
                        // Check if device is registered
                        if (preferenceManager.isDeviceRegistered()) {
                            startMainActivity()
                        } else {
                            // First time user - go to device registration
                            startDeviceRegistration()
                        }
                    } else {
                        showError(loginResponse?.message ?: getString(R.string.login_failed))
                    }
                } else {
                    showError("${getString(R.string.login_failed)}: ${result.exceptionOrNull()?.message}")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Login error", e)
                showError("Login error: ${e.message}")
            } finally {
                setLoading(false)
            }
        }
    }
    
    private fun requestSmsLogin() {
        if (!hasSmsPermissions()) {
            requestSmsPermissions()
            return
        }
        
        setLoading(true)
        tvStatus.text = getString(R.string.login_requesting_sms)
        
        lifecycleScope.launch {
            try {
                val result = authService.requestSmsCode()
                
                if (result.isSuccess) {
                    showSuccess(getString(R.string.login_sms_sent))
                    // Start listening for SMS
                    startSmsListener()
                } else {
                    showError("خطا در ارسال پیامک: ${result.exceptionOrNull()?.message}")
                }
            } catch (e: Exception) {
                Log.e(TAG, "SMS login error", e)
                showError("SMS login error: ${e.message}")
            } finally {
                setLoading(false)
            }
        }
    }
    
    private fun startSmsListener() {
        // In a real implementation, you would:
        // 1. Register a broadcast receiver for SMS_RECEIVED
        // 2. Parse the incoming SMS for the verification code
        // 3. Automatically submit the code
        
        // For demo purposes, show a message
        showSuccess(getString(R.string.login_sms_sent_detail))
    }
    
    private fun hasSmsPermissions(): Boolean {
        return ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.RECEIVE_SMS
        ) == PackageManager.PERMISSION_GRANTED &&
        ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.READ_SMS
        ) == PackageManager.PERMISSION_GRANTED
    }
    
    private fun requestSmsPermissions() {
        val permissions = arrayOf(
            Manifest.permission.RECEIVE_SMS,
            Manifest.permission.READ_SMS
        )
        
        ActivityCompat.requestPermissions(
            this,
            permissions,
            SMS_PERMISSION_REQUEST
        )
    }
    
    private fun startMainActivity() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
    
    private fun startDeviceRegistration() {
        val currentUsername = etUsername.text.toString().trim()
        val intent = Intent(this, DeviceRegistrationActivity::class.java).apply {
            putExtra(DeviceRegistrationActivity.EXTRA_AUTH_TOKEN, preferenceManager.getAuthToken())
            putExtra(DeviceRegistrationActivity.EXTRA_USERNAME, currentUsername)
        }
        startActivity(intent)
        finish()
    }
    
    private fun setLoading(loading: Boolean) {
        progressBar.visibility = if (loading) View.VISIBLE else View.GONE
        btnLogin.isEnabled = !loading
        btnSmsLogin.isEnabled = !loading
    }
    
    private fun showError(message: String) {
        tvStatus.text = message
        Snackbar.make(findViewById(android.R.id.content), message, Snackbar.LENGTH_LONG).show()
    }
    
    private fun showSuccess(message: String) {
        tvStatus.text = message
        Snackbar.make(findViewById(android.R.id.content), message, Snackbar.LENGTH_LONG).show()
    }
    
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        
        when (requestCode) {
            SMS_PERMISSION_REQUEST -> {
                if (grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {
                    showSuccess(getString(R.string.login_sms_permissions_granted))
                } else {
                    showError(getString(R.string.login_sms_permissions_required))
                }
            }
        }
    }

    private fun checkDeviceBinding(): Boolean {
        // Device binding check disabled for demo
        Log.d(TAG, "checkDeviceBinding: Device binding check disabled for demo")
        return true
    }
}
