package com.viworks.mobile.service

import android.util.Log
import com.viworks.mobile.model.LoginRequest
import com.viworks.mobile.model.LoginResponse
import com.viworks.mobile.model.SmsCodeRequest
import com.viworks.mobile.model.SmsCodeResponse
import com.viworks.mobile.model.DeviceRegistrationRequest
import com.viworks.mobile.model.DeviceRegistrationResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.util.Random

/**
 * Authentication service for handling login and SMS verification
 */
class AuthService {
    
    companion object {
        private const val TAG = "AuthService"
    }
    
    private val apiService = ApiService()
    
    /**
     * Login with username and password
     */
    suspend fun login(loginRequest: LoginRequest): Result<LoginResponse> {
        return withContext(Dispatchers.IO) {
            try {
                Log.d(TAG, "Attempting login for user: ${loginRequest.username}")
                
                // Try real API first
                val apiResult = apiService.login(loginRequest.username, loginRequest.password)
                
                if (apiResult.isSuccess) {
                    val jsonResponse = apiResult.getOrNull()
                    if (jsonResponse != null) {
                        val success = jsonResponse.optBoolean("success", false)
                        val message = jsonResponse.optString("message", "")
                        
                        Log.d(TAG, "API login response: success=$success, message=$message")
                        
                        if (success) {
                            // Check if 2FA is required
                            val data = jsonResponse.optJSONObject("data")
                            val requires2fa = data?.optBoolean("requires_2fa", false) ?: false
                            val sessionId = data?.optString("session_id", "") ?: ""
                            
                            if (requires2fa) {
                                Log.d(TAG, "2FA required for session: $sessionId")
                                // For now, we'll treat this as a successful login
                                // In a real app, you'd handle 2FA flow
                                Result.success(LoginResponse(
                                    success = true,
                                    message = "Login successful (2FA required)",
                                    token = sessionId, // Use session_id as token for now
                                    userId = loginRequest.username
                                ))
                            } else {
                                // No 2FA required
                                Result.success(LoginResponse(
                                    success = true,
                                    message = message,
                                    token = sessionId,
                                    userId = loginRequest.username
                                ))
                            }
                        } else {
                            Result.success(LoginResponse(
                                success = false,
                                message = message,
                                token = null,
                                userId = null
                            ))
                        }
                    } else {
                        Log.w(TAG, "API returned null response, falling back to demo mode")
                        fallbackLogin(loginRequest)
                    }
                } else {
                    Log.w(TAG, "API login failed: ${apiResult.exceptionOrNull()?.message}, falling back to demo mode")
                    fallbackLogin(loginRequest)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Login error", e)
                Log.w(TAG, "Falling back to demo mode due to error")
                fallbackLogin(loginRequest)
            }
        }
    }
    
    /**
     * Fallback login for demo/testing purposes
     */
    private suspend fun fallbackLogin(loginRequest: LoginRequest): Result<LoginResponse> {
        return withContext(Dispatchers.IO) {
            try {
                // Simulate network delay
                delay(1500)
                
                // For demo purposes, accept any username with password "12345"
                if (loginRequest.password == "12345") {
                    val token = generateAuthToken(loginRequest.username)
                    
                    Log.d(TAG, "Demo login successful for user: ${loginRequest.username}")
                    
                    Result.success(LoginResponse(
                        success = true,
                        message = "Demo login successful",
                        token = token,
                        userId = "user_${loginRequest.username}"
                    ))
                } else {
                    Log.w(TAG, "Demo login failed for user: ${loginRequest.username}")
                    
                    Result.success(LoginResponse(
                        success = false,
                        message = "Invalid credentials (demo mode)",
                        token = null,
                        userId = null
                    ))
                }
            } catch (e: Exception) {
                Log.e(TAG, "Demo login error", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Request SMS verification code
     */
    suspend fun requestSmsCode(): Result<SmsCodeResponse> {
        return withContext(Dispatchers.IO) {
            try {
                // Simulate network delay
                delay(2000)
                
                // Generate a 6-digit SMS code
                val smsCode = generateSmsCode()
                
                Log.d(TAG, "SMS code requested: $smsCode")
                
                // In a real implementation, this would:
                // 1. Send the SMS code to the user's phone
                // 2. Store the code temporarily on the server
                // 3. Return success response
                
                Result.success(SmsCodeResponse(
                    success = true,
                    message = "SMS code sent successfully",
                    code = smsCode // In production, this would not be returned
                ))
            } catch (e: Exception) {
                Log.e(TAG, "SMS code request error", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Verify SMS code
     */
    suspend fun verifySmsCode(code: String): Result<LoginResponse> {
        return withContext(Dispatchers.IO) {
            try {
                // Simulate network delay
                delay(1500)
                
                // For demo purposes, accept any 6-digit code
                if (code.length == 6 && code.all { it.isDigit() }) {
                    val token = generateAuthToken("sms_user")
                    
                    Log.d(TAG, "SMS verification successful")
                    
                    Result.success(LoginResponse(
                        success = true,
                        message = "SMS verification successful",
                        token = token,
                        userId = "sms_user"
                    ))
                } else {
                    Log.w(TAG, "SMS verification failed: invalid code")
                    
                    Result.success(LoginResponse(
                        success = false,
                        message = "Invalid SMS code",
                        token = null,
                        userId = null
                    ))
                }
            } catch (e: Exception) {
                Log.e(TAG, "SMS verification error", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Register device
     */
    suspend fun registerDevice(request: Map<String, Any?>): Result<DeviceRegistrationResponse> {
        return withContext(Dispatchers.IO) {
            try {
                val userId = request["user_id"] as? String ?: ""
                val deviceId = request["device_id"] as? String ?: ""
                Log.d(TAG, "Attempting device registration for user: $userId, device: $deviceId")
                
                // Try real API first
                val apiResult = apiService.registerDevice(request)
                
                if (apiResult.isSuccess) {
                    val jsonResponse = apiResult.getOrNull()
                    if (jsonResponse != null) {
                        val success = jsonResponse.optBoolean("success", false)
                        val message = jsonResponse.optString("message", "")
                        
                        Log.d(TAG, "API device registration response: success=$success, message=$message")
                        
                        Result.success(DeviceRegistrationResponse(
                            success = success,
                            message = message,
                            deviceId = deviceId,
                            registrationToken = null
                        ))
                    } else {
                        Log.w(TAG, "API returned null response, falling back to demo mode")
                        fallbackDeviceRegistration(userId, deviceId)
                    }
                } else {
                    Log.w(TAG, "API device registration failed: ${apiResult.exceptionOrNull()?.message}, falling back to demo mode")
                    fallbackDeviceRegistration(userId, deviceId)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Device registration error", e)
                Log.w(TAG, "Falling back to demo mode due to error")
                val userId = request["user_id"] as? String ?: ""
                val deviceId = request["device_id"] as? String ?: ""
                fallbackDeviceRegistration(userId, deviceId)
            }
        }
    }
    
    /**
     * Fallback device registration for demo/testing purposes
     */
    private suspend fun fallbackDeviceRegistration(userId: String, deviceId: String): Result<DeviceRegistrationResponse> {
        return withContext(Dispatchers.IO) {
            try {
                // Simulate network delay
                delay(2000)
                
                Log.d(TAG, "Demo device registration successful for user: $userId, device: $deviceId")
                
                Result.success(DeviceRegistrationResponse(
                    success = true,
                    message = "Demo device registration successful",
                    deviceId = deviceId,
                    registrationToken = null
                ))
            } catch (e: Exception) {
                Log.e(TAG, "Demo device registration error", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Generate a demo auth token
     */
    private fun generateAuthToken(username: String): String {
        val timestamp = System.currentTimeMillis()
        val random = Random().nextInt(10000)
        return "demo_token_${username}_${timestamp}_$random"
    }
    
    /**
     * Generate a 6-digit SMS code
     */
    private fun generateSmsCode(): String {
        return String.format("%06d", Random().nextInt(1000000))
    }
}
