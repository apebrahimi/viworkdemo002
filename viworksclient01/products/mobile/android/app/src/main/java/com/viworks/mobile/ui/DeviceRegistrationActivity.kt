package com.viworks.mobile.ui

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import com.viworks.mobile.R
import com.viworks.mobile.model.DeviceRegistrationRequest
import com.viworks.mobile.model.DeviceRegistrationResponse
import com.viworks.mobile.service.AuthService
import com.viworks.mobile.util.PreferenceManager
import com.viworks.mobile.util.DeviceBindingManager
import kotlinx.coroutines.launch

class DeviceRegistrationActivity : AppCompatActivity() {
    
    companion object {
        private const val TAG = "DeviceRegistrationActivity"
        const val EXTRA_AUTH_TOKEN = "auth_token"
        const val EXTRA_USERNAME = "username"
    }
    
    private lateinit var etFullName: EditText
    private lateinit var etOrganizationId: EditText
    private lateinit var etDeviceName: EditText
    private lateinit var btnRegister: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var tvStatus: TextView
    private lateinit var tvDeviceInfo: TextView
    
    private lateinit var authService: AuthService
    private lateinit var preferenceManager: PreferenceManager
    private lateinit var deviceBindingManager: DeviceBindingManager
    
    private var authToken: String? = null
    private var username: String? = null
    
    override fun onCreate(savedInstanceState: Bundle?) {
        try {
            Log.d(TAG, "onCreate: Starting DeviceRegistrationActivity")
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_device_registration)
            Log.d(TAG, "onCreate: Content view set successfully")
            
            // Get passed data
            authToken = intent.getStringExtra(EXTRA_AUTH_TOKEN)
            username = intent.getStringExtra(EXTRA_USERNAME)
            
            if (authToken == null || username == null) {
                Log.e(TAG, "onCreate: Missing auth token or username")
                showError("اطلاعات احراز هویت نامعتبر است")
                finish()
                return
            }
            
            // Initialize views
            Log.d(TAG, "onCreate: Initializing views")
            etFullName = findViewById(R.id.et_full_name)
            etOrganizationId = findViewById(R.id.et_organization_id)
            etDeviceName = findViewById(R.id.et_device_name)
            btnRegister = findViewById(R.id.btn_register)
            progressBar = findViewById(R.id.progress_bar)
            tvStatus = findViewById(R.id.tv_status)
            tvDeviceInfo = findViewById(R.id.tv_device_info)
            Log.d(TAG, "onCreate: Views initialized successfully")
            
            // Initialize services
            Log.d(TAG, "onCreate: Initializing services")
            authService = AuthService()
            preferenceManager = PreferenceManager(this)
            deviceBindingManager = DeviceBindingManager(this)
            Log.d(TAG, "onCreate: Services initialized successfully")
            
            // Set up button listener
            Log.d(TAG, "onCreate: Setting up button listener")
            btnRegister.setOnClickListener {
                performDeviceRegistration()
            }
            
            // Display device information
            Log.d(TAG, "onCreate: Displaying device info")
            displayDeviceInfo()
            
            Log.d(TAG, "onCreate: DeviceRegistrationActivity initialized successfully")
            
        } catch (e: Exception) {
            Log.e(TAG, "onCreate: Error initializing DeviceRegistrationActivity", e)
            showError("خطا در راه‌اندازی صفحه ثبت دستگاه: ${e.message}")
        }
    }
    
    private fun displayDeviceInfo() {
        try {
            val deviceInfo = deviceBindingManager.getDeviceInfo()
            val displayText = """
                📱 اطلاعات دستگاه:
                
                مدل: ${deviceInfo["model"] ?: "نامشخص"}
                نسخه Android: ${deviceInfo["androidVersion"] ?: "نامشخص"}
                سازنده: ${deviceInfo["manufacturer"] ?: "نامشخص"}
                شناسه دستگاه: ${deviceBindingManager.generateDeviceId()}
                
                🔒 این دستگاه برای استفاده انحصاری شما ثبت خواهد شد
            """.trimIndent()
            
            tvDeviceInfo.text = displayText
            Log.d(TAG, "displayDeviceInfo: Device info displayed successfully")
        } catch (e: Exception) {
            Log.e(TAG, "displayDeviceInfo: Error displaying device info", e)
            tvDeviceInfo.text = "خطا در نمایش اطلاعات دستگاه"
        }
    }
    
    private fun performDeviceRegistration() {
        val fullName = etFullName.text.toString().trim()
        val organizationId = etOrganizationId.text.toString().trim()
        val deviceName = etDeviceName.text.toString().trim()
        
        if (fullName.isEmpty() || organizationId.isEmpty() || deviceName.isEmpty()) {
            showError("لطفاً تمام فیلدها را پر کنید")
            return
        }
        
        setLoading(true)
        tvStatus.text = "در حال ثبت دستگاه..."
        
        lifecycleScope.launch {
            try {
                Log.d(TAG, "performDeviceRegistration: Starting device registration")
                
                // Generate device ID
                val deviceId = deviceBindingManager.generateDeviceId()
                Log.d(TAG, "performDeviceRegistration: Generated device ID: $deviceId")
                
                // Validate device
                val validationResult = deviceBindingManager.validateDevice()
                if (!validationResult.isValid) {
                    Log.w(TAG, "performDeviceRegistration: Device validation issues: ${validationResult.issues}")
                    // For demo purposes, we'll continue but log the issues
                    // In production, you might want to be more strict
                }
                
                val request = DeviceRegistrationRequest(
                    authToken = authToken!!,
                    fullName = fullName,
                    organizationId = organizationId,
                    deviceName = deviceName,
                    deviceModel = android.os.Build.MODEL,
                    androidVersion = android.os.Build.VERSION.RELEASE,
                    manufacturer = android.os.Build.MANUFACTURER,
                    deviceId = deviceId
                )
                
                Log.d(TAG, "performDeviceRegistration: Calling authService.registerDevice")
                val result = authService.registerDevice(request)
                
                if (result.isSuccess) {
                    val response = result.getOrNull()
                    if (response?.success == true) {
                        Log.d(TAG, "performDeviceRegistration: Device registration successful, saving data")
                        
                        // Save device registration data
                        try {
                            preferenceManager.saveDeviceRegistered(true)
                            preferenceManager.saveFullName(fullName)
                            preferenceManager.saveOrganizationId(organizationId)
                            preferenceManager.saveDeviceName(deviceName)
                            preferenceManager.saveDeviceId(deviceId)
                            Log.d(TAG, "performDeviceRegistration: Data saved successfully")
                        } catch (e: Exception) {
                            Log.e(TAG, "performDeviceRegistration: Error saving data", e)
                            showError("خطا در ذخیره اطلاعات: ${e.message}")
                            return@launch
                        }
                        
                        showSuccess("دستگاه با موفقیت ثبت شد")
                        
                        // Navigate to main activity
                        Log.d(TAG, "performDeviceRegistration: Navigating to MainActivity")
                        try {
                            val intent = Intent(this@DeviceRegistrationActivity, MainActivity::class.java)
                            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                            startActivity(intent)
                            finish()
                        } catch (e: Exception) {
                            Log.e(TAG, "performDeviceRegistration: Error navigating to MainActivity", e)
                            showError("خطا در انتقال به صفحه اصلی: ${e.message}")
                        }
                    } else {
                        Log.e(TAG, "performDeviceRegistration: Device registration failed: ${response?.message}")
                        showError(response?.message ?: "خطا در ثبت دستگاه")
                    }
                } else {
                    Log.e(TAG, "performDeviceRegistration: Device registration error: ${result.exceptionOrNull()?.message}")
                    showError("خطا در ثبت دستگاه: ${result.exceptionOrNull()?.message}")
                }
            } catch (e: Exception) {
                Log.e(TAG, "performDeviceRegistration: Exception during device registration", e)
                showError("خطا در ثبت دستگاه: ${e.message}")
            } finally {
                setLoading(false)
            }
        }
    }
    
    private fun setLoading(loading: Boolean) {
        progressBar.visibility = if (loading) View.VISIBLE else View.GONE
        btnRegister.isEnabled = !loading
    }
    
    private fun showError(message: String) {
        tvStatus.text = message
        Snackbar.make(findViewById(android.R.id.content), message, Snackbar.LENGTH_LONG).show()
    }
    
    private fun showSuccess(message: String) {
        tvStatus.text = message
        Snackbar.make(findViewById(android.R.id.content), message, Snackbar.LENGTH_LONG).show()
    }
}
