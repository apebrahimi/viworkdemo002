package com.viworks.mobile.util

import android.content.Context
import android.os.Build
import android.util.Log
import java.security.MessageDigest
import java.util.*

class DeviceBindingManager(private val context: Context) {
    
    companion object {
        private const val TAG = "DeviceBindingManager"
    }
    
    /**
     * Generate a unique device identifier that's consistent for this device
     */
    fun generateDeviceId(): String {
        return try {
            val deviceInfo = StringBuilder().apply {
                append(Build.MANUFACTURER)
                append(Build.MODEL)
                append(Build.PRODUCT)
                append(Build.DEVICE)
                append(Build.BOARD)
                append(Build.BRAND)
                append(Build.FINGERPRINT)
            }.toString()
            
            // Create a hash of the device info
            val digest = MessageDigest.getInstance("SHA-256")
            val hash = digest.digest(deviceInfo.toByteArray())
            android.util.Base64.encodeToString(hash, android.util.Base64.NO_WRAP).take(32)
        } catch (e: Exception) {
            Log.e(TAG, "Error generating device ID", e)
            // Fallback to a simple device ID
            "${Build.MANUFACTURER}_${Build.MODEL}_${Build.ID}".hashCode().toString()
        }
    }
    
    /**
     * Check if the current device matches the stored device ID
     */
    fun isDeviceBound(storedDeviceId: String?): Boolean {
        return try {
            if (storedDeviceId.isNullOrEmpty()) {
                Log.d(TAG, "No stored device ID found")
                return false
            }
            
            val currentDeviceId = generateDeviceId()
            val isBound = storedDeviceId == currentDeviceId
            
            Log.d(TAG, "Device binding check: stored=$storedDeviceId, current=$currentDeviceId, bound=$isBound")
            isBound
        } catch (e: Exception) {
            Log.e(TAG, "Error checking device binding", e)
            false
        }
    }
    
    /**
     * Get device information for registration
     */
    fun getDeviceInfo(): Map<String, String> {
        return try {
            mapOf(
                "manufacturer" to Build.MANUFACTURER,
                "model" to Build.MODEL,
                "product" to Build.PRODUCT,
                "device" to Build.DEVICE,
                "board" to Build.BOARD,
                "brand" to Build.BRAND,
                "fingerprint" to Build.FINGERPRINT,
                "androidVersion" to Build.VERSION.RELEASE,
                "sdkVersion" to Build.VERSION.SDK_INT.toString(),
                "buildId" to Build.ID
            )
        } catch (e: Exception) {
            Log.e(TAG, "Error getting device info", e)
            mapOf(
                "manufacturer" to "Unknown",
                "model" to "Unknown",
                "androidVersion" to "Unknown"
            )
        }
    }
    
    /**
     * Validate device for security requirements
     */
    fun validateDevice(): DeviceValidationResult {
        return try {
            val issues = mutableListOf<String>()
            
            // Check if device is rooted (basic check)
            if (isDeviceRooted()) {
                issues.add("Device appears to be rooted")
            }
            
            // Check Android version
            if (Build.VERSION.SDK_INT < 23) {
                issues.add("Android version too old (minimum 6.0 required)")
            }
            
            // Check if device has basic security features
            if (!hasBasicSecurityFeatures()) {
                issues.add("Device lacks basic security features")
            }
            
            DeviceValidationResult(
                isValid = issues.isEmpty(),
                issues = issues
            )
        } catch (e: Exception) {
            Log.e(TAG, "Error validating device", e)
            DeviceValidationResult(
                isValid = false,
                issues = listOf("Error validating device: ${e.message}")
            )
        }
    }
    
    private fun isDeviceRooted(): Boolean {
        return try {
            // Basic root detection - check for common root indicators
            val paths = arrayOf(
                "/system/app/Superuser.apk",
                "/sbin/su",
                "/system/bin/su",
                "/system/xbin/su",
                "/data/local/xbin/su",
                "/data/local/bin/su",
                "/system/sd/xbin/su",
                "/system/bin/failsafe/su",
                "/data/local/su"
            )
            
            paths.any { path ->
                try {
                    java.io.File(path).exists()
                } catch (e: Exception) {
                    false
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error checking root status", e)
            false
        }
    }
    
    private fun hasBasicSecurityFeatures(): Boolean {
        return try {
            // Check if device has basic security features
            Build.VERSION.SDK_INT >= 23 // Android 6.0+
        } catch (e: Exception) {
            Log.e(TAG, "Error checking security features", e)
            false
        }
    }
}

data class DeviceValidationResult(
    val isValid: Boolean,
    val issues: List<String>
)
