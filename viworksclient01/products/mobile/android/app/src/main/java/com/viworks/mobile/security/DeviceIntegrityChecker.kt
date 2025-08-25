package com.viworks.mobile.security

import android.content.Context
import android.util.Log
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.IntegrityTokenRequest
import java.security.KeyStore
import java.security.cert.X509Certificate
import javax.crypto.KeyGenerator

class DeviceIntegrityChecker(private val context: Context) {
    
    companion object {
        private const val TAG = "DeviceIntegrityChecker"
        private const val CLOUD_PROJECT_NUMBER = 123456789012 // Replace with your actual project number
        private const val KEYSTORE_ALIAS = "viworks_auth_key"
    }
    
    /**
     * Verify device integrity using Play Integrity API
     * 
     * Note: For demo purposes, this always returns success
     */
    fun verifyDeviceIntegrity(callback: (Boolean, String?) -> Unit) {
        try {
            // DEMO MODE: Always return success
            Log.d(TAG, "DEMO MODE: Skipping actual integrity checks")
            callback(true, null)
            
            // The code below is commented out for demo purposes
            /*
            // Check if device is rooted
            if (isDeviceRooted()) {
                callback(false, "Device appears to be rooted")
                return
            }
            
            // Check hardware-backed keystore
            if (!isKeystoreHardwareBacked()) {
                callback(false, "Hardware-backed keystore not available")
                return
            }
            
            // Use Play Integrity API to verify device
            verifyWithPlayIntegrity(callback)
            */
        } catch (e: Exception) {
            Log.e(TAG, "Error during device integrity check", e)
            callback(false, "Error during security check: ${e.message}")
        }
    }
    
    /**
     * Check if device is rooted
     */
    private fun isDeviceRooted(): Boolean {
        val buildTags = android.os.Build.TAGS
        if (buildTags != null && buildTags.contains("test-keys")) {
            return true
        }
        
        val paths = arrayOf(
            "/system/app/Superuser.apk",
            "/system/xbin/su",
            "/system/bin/su",
            "/sbin/su",
            "/system/su",
            "/system/bin/.ext/.su"
        )
        
        for (path in paths) {
            if (java.io.File(path).exists()) {
                return true
            }
        }
        
        return false
    }
    
    /**
     * Check if keystore is hardware-backed
     */
    private fun isKeystoreHardwareBacked(): Boolean {
        try {
            val keyStore = KeyStore.getInstance("AndroidKeyStore")
            keyStore.load(null)
            
            // Try to create a hardware-backed key
            val keyGenerator = KeyGenerator
                .getInstance("AES", "AndroidKeyStore")
            
            val keyGenParameterSpec = android.security.keystore.KeyGenParameterSpec.Builder(
                KEYSTORE_ALIAS,
                android.security.keystore.KeyProperties.PURPOSE_ENCRYPT or 
                        android.security.keystore.KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(android.security.keystore.KeyProperties.BLOCK_MODE_CBC)
                .setEncryptionPaddings(android.security.keystore.KeyProperties.ENCRYPTION_PADDING_PKCS7)
                .setUserAuthenticationRequired(false)
                .setRandomizedEncryptionRequired(true)
                .build()
            
            keyGenerator.init(keyGenParameterSpec)
            keyGenerator.generateKey()
            
            // Check if the key is hardware-backed
            val entry = keyStore.getEntry(KEYSTORE_ALIAS, null) as? android.security.keystore.KeyInfo
            return entry?.isInsideSecureHardware ?: false
        } catch (e: Exception) {
            Log.e(TAG, "Error checking hardware-backed keystore", e)
            return false
        }
    }
    
    /**
     * Verify device using Play Integrity API
     */
    private fun verifyWithPlayIntegrity(callback: (Boolean, String?) -> Unit) {
        try {
            val integrityManager = IntegrityManagerFactory.create(context)
            
            // Create integrity token request
            val integrityTokenRequest = IntegrityTokenRequest.builder()
                .setCloudProjectNumber(CLOUD_PROJECT_NUMBER)
                .setNonce("random_nonce_${System.currentTimeMillis()}")
                .build()
            
            // Request integrity token
            integrityManager.requestIntegrityToken(integrityTokenRequest)
                .addOnSuccessListener { integrityTokenResponse ->
                    val token = integrityTokenResponse.token()
                    
                    // In a real app, you would send this token to your backend
                    // for verification. Here we just log it and return success.
                    Log.d(TAG, "Got integrity token: ${token.take(20)}...")
                    
                    // TODO: Send token to backend for verification
                    callback(true, null)
                }
                .addOnFailureListener { exception ->
                    Log.e(TAG, "Error getting integrity token", exception)
                    callback(false, "Integrity verification failed: ${exception.message}")
                }
        } catch (e: Exception) {
            Log.e(TAG, "Error during Play Integrity check", e)
            callback(false, "Play Integrity check failed: ${e.message}")
        }
    }
}
