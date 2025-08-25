package com.viworks.mobile.util

import android.content.Context
import android.content.SharedPreferences
import android.util.Log

object Config {
    
    private const val TAG = "Config"
    private const val PREFS_NAME = "viworks_config"
    private const val KEY_API_BASE_URL = "api_base_url"
    private const val KEY_ENVIRONMENT = "environment"
    private const val KEY_DEBUG_MODE = "debug_mode"
    
    // Environment types
    const val ENV_LOCAL = "local"
    const val ENV_DEVELOPMENT = "development"
    const val ENV_PRODUCTION = "production"
    
    // Default URLs
    private const val DEFAULT_LOCAL_URL = "http://10.0.2.2:8081" // Android emulator localhost
    private const val DEFAULT_LOCAL_DEVICE_URL = "http://192.168.1.100:8081" // Common local IP
    private const val DEFAULT_DEV_URL = "https://dev-api.viworks.com"
    private const val DEFAULT_PROD_URL = "https://api.viworks.com"
    
    private var prefs: SharedPreferences? = null
    
    fun initialize(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        Log.d(TAG, "Config initialized with environment: ${getEnvironment()}")
    }
    
    /**
     * Get the current API base URL
     */
    fun getApiBaseUrl(): String {
        val customUrl = prefs?.getString(KEY_API_BASE_URL, null)
        if (!customUrl.isNullOrEmpty()) {
            Log.d(TAG, "Using custom API URL: $customUrl")
            return customUrl
        }
        
        return when (getEnvironment()) {
            ENV_LOCAL -> {
                // For emulator, use 10.0.2.2, for physical device use local IP
                if (isEmulator()) {
                    DEFAULT_LOCAL_URL
                } else {
                    DEFAULT_LOCAL_DEVICE_URL
                }
            }
            ENV_DEVELOPMENT -> DEFAULT_DEV_URL
            ENV_PRODUCTION -> DEFAULT_PROD_URL
            else -> DEFAULT_PROD_URL
        }
    }
    
    /**
     * Get the current environment
     */
    fun getEnvironment(): String {
        return prefs?.getString(KEY_ENVIRONMENT, ENV_LOCAL) ?: ENV_LOCAL
    }
    
    /**
     * Set the environment
     */
    fun setEnvironment(environment: String) {
        prefs?.edit()?.putString(KEY_ENVIRONMENT, environment)?.apply()
        Log.d(TAG, "Environment set to: $environment")
    }
    
    /**
     * Set a custom API base URL
     */
    fun setCustomApiUrl(url: String) {
        prefs?.edit()?.putString(KEY_API_BASE_URL, url)?.apply()
        Log.d(TAG, "Custom API URL set to: $url")
    }
    
    /**
     * Clear custom API URL (use default for environment)
     */
    fun clearCustomApiUrl() {
        prefs?.edit()?.remove(KEY_API_BASE_URL)?.apply()
        Log.d(TAG, "Custom API URL cleared")
    }
    
    /**
     * Check if debug mode is enabled
     */
    fun isDebugMode(): Boolean {
        return prefs?.getBoolean(KEY_DEBUG_MODE, true) ?: true
    }
    
    /**
     * Set debug mode
     */
    fun setDebugMode(enabled: Boolean) {
        prefs?.edit()?.putBoolean(KEY_DEBUG_MODE, enabled)?.apply()
        Log.d(TAG, "Debug mode set to: $enabled")
    }
    
    /**
     * Check if running on emulator
     */
    private fun isEmulator(): Boolean {
        return try {
            android.os.Build.FINGERPRINT.startsWith("generic") ||
            android.os.Build.FINGERPRINT.startsWith("unknown") ||
            android.os.Build.MODEL.contains("google_sdk") ||
            android.os.Build.MODEL.contains("Emulator") ||
            android.os.Build.MODEL.contains("Android SDK built for x86") ||
            android.os.Build.MANUFACTURER.contains("Genymotion") ||
            (android.os.Build.BRAND.startsWith("generic") && android.os.Build.DEVICE.startsWith("generic")) ||
            "google_sdk" == android.os.Build.PRODUCT
        } catch (e: Exception) {
            Log.e(TAG, "Error checking if emulator", e)
            false
        }
    }
    
    /**
     * Get configuration info for debugging
     */
    fun getConfigInfo(): String {
        return """
            Environment: ${getEnvironment()}
            API Base URL: ${getApiBaseUrl()}
            Debug Mode: ${isDebugMode()}
            Is Emulator: ${isEmulator()}
            Custom URL Set: ${!prefs?.getString(KEY_API_BASE_URL, null).isNullOrEmpty()}
        """.trimIndent()
    }
}
