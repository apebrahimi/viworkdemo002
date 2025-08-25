package com.viworks.mobile.service

import android.util.Log
import com.viworks.mobile.model.SignalData
import com.viworks.mobile.model.VerificationCode
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import java.util.Random

/**
 * Mock implementation of API service for testing without a backend
 */
class MockApiService {
    
    companion object {
        private const val TAG = "MockApiService"
    }
    
    /**
     * Generate a mock verification code
     */
    suspend fun getVerificationCode(_requestId: String, _signalData: SignalData): Result<VerificationCode> {
        return withContext(Dispatchers.IO) {
            try {
                // Simulate network delay
                delay(1500)
                
                // Generate random 6-digit code
                val random = Random()
                val code = (0..5).map { random.nextInt(10) }.joinToString("")
                
                // Set expiration time to 5 minutes from now
                val expiresAt = System.currentTimeMillis() + (5 * 60 * 1000)
                
                Log.d(TAG, "Generated mock verification code: $code")
                
                Result.success(VerificationCode(code, expiresAt))
            } catch (e: Exception) {
                Log.e(TAG, "Error generating mock code", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Mock sending signals to the server
     */
    suspend fun sendSignals(signalData: SignalData): Result<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                // Simulate network delay
                delay(1000)
                
                Log.d(TAG, "Mock sending signals: ${signalData.deviceId}")
                
                Result.success(true)
            } catch (e: Exception) {
                Log.e(TAG, "Error in mock send signals", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Mock confirmation of verification
     */
    suspend fun confirmVerification(requestId: String, approved: Boolean): Result<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                // Simulate network delay
                delay(1000)
                
                Log.d(TAG, "Mock confirm verification: $requestId, approved: $approved")
                
                Result.success(true)
            } catch (e: Exception) {
                Log.e(TAG, "Error in mock confirm verification", e)
                Result.failure(e)
            }
        }
    }
}
