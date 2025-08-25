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
                        val token = jsonResponse.optString("token", "").takeIf { it.isNotEmpty() }
                        val userId = jsonResponse.optString("userId", "").takeIf { it.isNotEmpty() }
                        
                        Log.d(TAG, "API login response: success=$success, message=$message")
                        
                        Result.success(LoginResponse(
                            success = success,
                            message = message,
                            token = token,
                            userId = userId
                        ))
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
    suspend fun registerDevice(request: DeviceRegistrationRequest): Result<DeviceRegistrationResponse> {
        return withContext(Dispatchers.IO) {
            try {
                Log.d(TAG, "Attempting device registration for user: ${request.fullName}")
                
                // Try real API first
                val apiResult = apiService.registerDevice(
                    authToken = request.authToken,
                    fullName = request.fullName,
                    organizationId = request.organizationId,
                    deviceName = request.deviceName,
                    deviceId = request.deviceId,
                    deviceModel = request.deviceModel,
                    androidVersion = request.androidVersion,
                    manufacturer = request.manufacturer
                )
                
                if (apiResult.isSuccess) {
                    val jsonResponse = apiResult.getOrNull()
                    if (jsonResponse != null) {
                        val success = jsonResponse.optBoolean("success", false)
                        val message = jsonResponse.optString("message", "")
                        
                        Log.d(TAG, "API device registration response: success=$success, message=$message")
                        
                        Result.success(DeviceRegistrationResponse(
                            success = success,
                            message = message,
                            deviceId = null,
                            registrationToken = null
                        ))
                    } else {
                        Log.w(TAG, "API returned null response, falling back to demo mode")
                        fallbackDeviceRegistration(request)
                    }
                } else {
                    Log.w(TAG, "API device registration failed: ${apiResult.exceptionOrNull()?.message}, falling back to demo mode")
                    fallbackDeviceRegistration(request)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Device registration error", e)
                Log.w(TAG, "Falling back to demo mode due to error")
                fallbackDeviceRegistration(request)
            }
        }
    }
    
    /**
     * Fallback device registration for demo/testing purposes
     */
    private suspend fun fallbackDeviceRegistration(request: DeviceRegistrationRequest): Result<DeviceRegistrationResponse> {
        return withContext(Dispatchers.IO) {
            try {
                // Simulate network delay
                delay(2000)
                
                Log.d(TAG, "Demo device registration successful for: ${request.fullName}")
                
                Result.success(DeviceRegistrationResponse(
                    success = true,
                    message = "Demo device registration successful",
                    deviceId = null,
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
