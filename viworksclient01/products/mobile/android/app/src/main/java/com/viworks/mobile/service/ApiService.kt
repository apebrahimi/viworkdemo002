package com.viworks.mobile.service

import android.util.Log
import com.viworks.mobile.model.VerificationCode
import com.viworks.mobile.model.VerificationRequest
import com.viworks.mobile.model.SignalData
import com.viworks.mobile.util.Config
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.CertificatePinner
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import java.security.KeyStore
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManagerFactory
import javax.net.ssl.X509TrustManager

class ApiService {
    
    companion object {
        private const val TAG = "ApiService"
        private const val AUTH_ENDPOINT = "/api/v1/auth"
        private const val ADMIN_ENDPOINT = "/api/v1/admin"
    }
    
    private val client: OkHttpClient by lazy {
        val builder = OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
        
        // Certificate pinning disabled for now - using standard SSL validation
        // if (Config.getEnvironment() == Config.ENV_PRODUCTION) {
        //     builder.certificatePinner(
        //         CertificatePinner.Builder()
        //             .add("walrus-app-5hly8.ondigitalocean.app", "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")
        //             .build()
        //     )
        // }
        
        builder.build()
    }
    
    /**
     * Get the current base URL
     */
    private fun getBaseUrl(): String {
        val baseUrl = Config.getApiBaseUrl()
        Log.d(TAG, "Using API base URL: $baseUrl")
        return baseUrl
    }
    
    /**
     * Login with username and password
     */
    suspend fun login(username: String, password: String): Result<JSONObject> {
        return withContext(Dispatchers.IO) {
            try {
                val jsonBody = JSONObject().apply {
                    put("username", username)
                    put("password", password)
                }
                
                val requestBody = jsonBody.toString()
                    .toRequestBody("application/json".toMediaType())
                
                val request = Request.Builder()
                    .url("${getBaseUrl()}$AUTH_ENDPOINT/login")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .build()
                
                Log.d(TAG, "Making login request to: ${request.url}")
                
                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    val responseBody = response.body?.string()
                    Log.d(TAG, "Login response: $responseBody")
                    
                    if (!responseBody.isNullOrEmpty()) {
                        val jsonResponse = JSONObject(responseBody)
                        Result.success(jsonResponse)
                    } else {
                        Result.failure(IOException("Empty response body"))
                    }
                } else {
                    val errorBody = response.body?.string()
                    Log.e(TAG, "Login failed: ${response.code} - $errorBody")
                    Result.failure(IOException("Login failed: ${response.code}"))
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception during login", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Register device
     */
    suspend fun registerDevice(
        authToken: String,
        fullName: String,
        organizationId: String,
        deviceName: String,
        deviceId: String,
        deviceModel: String,
        androidVersion: String,
        manufacturer: String
    ): Result<JSONObject> {
        return withContext(Dispatchers.IO) {
            try {
                val jsonBody = JSONObject().apply {
                    put("fullName", fullName)
                    put("organizationId", organizationId)
                    put("deviceName", deviceName)
                    put("deviceId", deviceId)
                    put("deviceModel", deviceModel)
                    put("androidVersion", androidVersion)
                    put("manufacturer", manufacturer)
                }
                
                val requestBody = jsonBody.toString()
                    .toRequestBody("application/json".toMediaType())
                
                val request = Request.Builder()
                    .url("${getBaseUrl()}$AUTH_ENDPOINT/register-device")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .build()
                
                Log.d(TAG, "Making device registration request to: ${request.url}")
                
                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    val responseBody = response.body?.string()
                    Log.d(TAG, "Device registration response: $responseBody")
                    
                    if (!responseBody.isNullOrEmpty()) {
                        val jsonResponse = JSONObject(responseBody)
                        Result.success(jsonResponse)
                    } else {
                        Result.failure(IOException("Empty response body"))
                    }
                } else {
                    val errorBody = response.body?.string()
                    Log.e(TAG, "Device registration failed: ${response.code} - $errorBody")
                    Result.failure(IOException("Device registration failed: ${response.code}"))
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception during device registration", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Register device with the server (new format)
     */
    suspend fun registerDevice(request: Map<String, Any?>): Result<JSONObject> {
        return withContext(Dispatchers.IO) {
            try {
                val jsonBody = JSONObject()
                
                // Add all fields from the request map
                request.forEach { (key, value) ->
                    when (value) {
                        is String -> jsonBody.put(key, value)
                        is Boolean -> jsonBody.put(key, value)
                        is Int -> jsonBody.put(key, value)
                        is Long -> jsonBody.put(key, value)
                        is Double -> jsonBody.put(key, value)
                        is Map<*, *> -> {
                            val nestedJson = JSONObject()
                            (value as Map<String, Any>).forEach { (nestedKey, nestedValue) ->
                                nestedJson.put(nestedKey, nestedValue.toString())
                            }
                            jsonBody.put(key, nestedJson)
                        }
                        null -> jsonBody.put(key, JSONObject.NULL)
                        else -> jsonBody.put(key, value.toString())
                    }
                }
                
                val requestBody = jsonBody.toString()
                    .toRequestBody("application/json".toMediaType())
                
                val request = Request.Builder()
                    .url("${getBaseUrl()}$AUTH_ENDPOINT/register-device")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .build()
                
                Log.d(TAG, "Making device registration request to: ${request.url}")
                Log.d(TAG, "Request body: $requestBody")
                
                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    val responseBody = response.body?.string()
                    Log.d(TAG, "Device registration response: $responseBody")
                    
                    if (!responseBody.isNullOrEmpty()) {
                        val jsonResponse = JSONObject(responseBody)
                        Result.success(jsonResponse)
                    } else {
                        Result.failure(IOException("Empty response body"))
                    }
                } else {
                    val errorBody = response.body?.string()
                    Log.e(TAG, "Device registration failed: ${response.code} - $errorBody")
                    Result.failure(IOException("Device registration failed: ${response.code}"))
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception during device registration", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Register device with the server (legacy format)
     */
    suspend fun registerDevice(userId: String, deviceId: String, fcmToken: String?, deviceInfo: Map<String, String>): Result<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val jsonBody = JSONObject().apply {
                    put("user_id", userId)
                    put("device_id", deviceId)
                    put("fcm_token", fcmToken)
                    put("device_info", JSONObject().apply {
                        put("model", deviceInfo["model"] ?: "")
                        put("os", deviceInfo["os"] ?: "")
                        put("app_version", deviceInfo["app_version"] ?: "")
                    })
                }
                
                val requestBody = jsonBody.toString()
                    .toRequestBody("application/json".toMediaType())
                
                val request = Request.Builder()
                    .url("${getBaseUrl()}$AUTH_ENDPOINT/register-device")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .build()
                
                Log.d(TAG, "Making device registration request to: ${request.url}")
                
                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    val responseBody = response.body?.string()
                    Log.d(TAG, "Device registration response: $responseBody")
                    
                    if (!responseBody.isNullOrEmpty()) {
                        val jsonResponse = JSONObject(responseBody)
                        val success = jsonResponse.optBoolean("success", false)
                        
                        if (success) {
                            Log.d(TAG, "Device registered successfully")
                            Result.success(true)
                        } else {
                            val message = jsonResponse.optString("message", "Unknown error")
                            Result.failure(IOException("API error: $message"))
                        }
                    } else {
                        Result.failure(IOException("Empty response body"))
                    }
                } else {
                    val errorBody = response.body?.string()
                    Log.e(TAG, "Device registration failed: ${response.code} - $errorBody")
                    Result.failure(IOException("Device registration failed: ${response.code}"))
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception during device registration", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Get verification code from the server
     */
    suspend fun getVerificationCode(requestId: String, signalData: SignalData): Result<VerificationCode> {
        return withContext(Dispatchers.IO) {
            try {
                val jsonBody = JSONObject().apply {
                    put("request_id", requestId)
                    put("device_id", signalData.deviceId)
                    put("location", JSONObject().apply {
                        put("latitude", signalData.latitude)
                        put("longitude", signalData.longitude)
                    })
                    put("network_info", JSONObject().apply {
                        put("ip", signalData.ip)
                        put("carrier", signalData.carrier)
                        put("network_type", signalData.networkType)
                    })
                    put("device_integrity_token", signalData.deviceIntegrityToken)
                }
                
                val requestBody = jsonBody.toString()
                    .toRequestBody("application/json".toMediaType())
                
                val request = Request.Builder()
                    .url("${getBaseUrl()}$AUTH_ENDPOINT/verification-code")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .build()
                
                Log.d(TAG, "Making verification code request to: ${request.url}")
                
                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    val responseBody = response.body?.string()
                    Log.d(TAG, "Verification code response: $responseBody")
                    
                    if (!responseBody.isNullOrEmpty()) {
                        val jsonResponse = JSONObject(responseBody)
                        val success = jsonResponse.optBoolean("success", false)
                        
                        if (success) {
                            val code = jsonResponse.optString("code", "")
                            val expiresAt = jsonResponse.optLong("expiresAt", 0)
                            
                            Result.success(VerificationCode(code, expiresAt))
                        } else {
                            val message = jsonResponse.optString("message", "Unknown error")
                            Result.failure(IOException("API error: $message"))
                        }
                    } else {
                        Result.failure(IOException("Empty response body"))
                    }
                } else {
                    val errorBody = response.body?.string()
                    Log.e(TAG, "Error getting verification code: ${response.code} - $errorBody")
                    Result.failure(IOException("API error: ${response.code}"))
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception during API call", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Send device signals to the server
     */
    suspend fun sendSignals(signalData: SignalData): Result<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val jsonBody = JSONObject().apply {
                    put("deviceId", signalData.deviceId)
                    put("location", JSONObject().apply {
                        put("latitude", signalData.latitude)
                        put("longitude", signalData.longitude)
                    })
                    put("networkInfo", JSONObject().apply {
                        put("ip", signalData.ip)
                        put("carrier", signalData.carrier)
                        put("networkType", signalData.networkType)
                    })
                    put("deviceIntegrity", signalData.deviceIntegrityToken)
                }
                
                val requestBody = jsonBody.toString()
                    .toRequestBody("application/json".toMediaType())
                
                val request = Request.Builder()
                    .url("${getBaseUrl()}$AUTH_ENDPOINT/verification-code")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .build()
                
                Log.d(TAG, "Making signals request to: ${request.url}")
                
                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    Log.d(TAG, "Signals sent successfully")
                    Result.success(true)
                } else {
                    val errorBody = response.body?.string()
                    Log.e(TAG, "Error sending signals: ${response.code} - $errorBody")
                    Result.failure(IOException("API error: ${response.code}"))
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception during API call", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Confirm verification request
     */
    suspend fun confirmVerification(requestId: String, approved: Boolean, deviceId: String): Result<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val jsonBody = JSONObject().apply {
                    put("request_id", requestId)
                    put("approved", approved)
                    put("device_id", deviceId)
                }
                
                val requestBody = jsonBody.toString()
                    .toRequestBody("application/json".toMediaType())
                
                val request = Request.Builder()
                    .url("${getBaseUrl()}$AUTH_ENDPOINT/confirm-verification")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .build()
                
                Log.d(TAG, "Making verification confirm request to: ${request.url}")
                
                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    val responseBody = response.body?.string()
                    Log.d(TAG, "Verification confirm response: $responseBody")
                    
                    if (!responseBody.isNullOrEmpty()) {
                        val jsonResponse = JSONObject(responseBody)
                        val success = jsonResponse.optBoolean("success", false)
                        
                        if (success) {
                            Log.d(TAG, "Verification confirmed successfully")
                            Result.success(true)
                        } else {
                            val message = jsonResponse.optString("message", "Unknown error")
                            Result.failure(IOException("API error: $message"))
                        }
                    } else {
                        Result.failure(IOException("Empty response body"))
                    }
                } else {
                    val errorBody = response.body?.string()
                    Log.e(TAG, "Error confirming verification: ${response.code} - $errorBody")
                    Result.failure(IOException("API error: ${response.code}"))
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception during API call", e)
                Result.failure(e)
            }
        }
    }
    
    /**
     * Get verification requests from admin endpoint
     */
    suspend fun getVerificationRequests(): Result<List<VerificationRequest>> {
        return withContext(Dispatchers.IO) {
            try {
                val request = Request.Builder()
                    .url("${getBaseUrl()}$ADMIN_ENDPOINT/verification-requests")
                    .get()
                    .addHeader("Content-Type", "application/json")
                    .build()
                
                Log.d(TAG, "Making verification requests request to: ${request.url}")
                
                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    val responseBody = response.body?.string()
                    Log.d(TAG, "Verification requests response: $responseBody")
                    
                    if (!responseBody.isNullOrEmpty()) {
                        val jsonResponse = JSONObject(responseBody)
                        val success = jsonResponse.optBoolean("success", false)
                        
                        if (success) {
                            val requestsArray = jsonResponse.optJSONArray("requests")
                            val requests = mutableListOf<VerificationRequest>()
                            
                            if (requestsArray != null) {
                                for (i in 0 until requestsArray.length()) {
                                    val requestObj = requestsArray.getJSONObject(i)
                                    val verificationRequest = VerificationRequest(
                                        id = requestObj.optString("id"),
                                        code = requestObj.optString("code"),
                                        deviceId = requestObj.optString("device_id"),
                                        userId = requestObj.optString("user_id"),
                                        ipAddress = requestObj.optString("ip_address"),
                                        locationLat = requestObj.optDouble("location_lat"),
                                        locationLng = requestObj.optDouble("location_lng"),
                                        createdAt = requestObj.optString("created_at"),
                                        expiresAt = requestObj.optLong("expires_at"),
                                        completed = requestObj.optBoolean("completed"),
                                        approved = if (requestObj.has("approved")) requestObj.optBoolean("approved") else null
                                    )
                                    requests.add(verificationRequest)
                                }
                            }
                            
                            Log.d(TAG, "Retrieved ${requests.size} verification requests")
                            Result.success(requests)
                        } else {
                            val message = jsonResponse.optString("message", "Unknown error")
                            Result.failure(IOException("API error: $message"))
                        }
                    } else {
                        Result.failure(IOException("Empty response body"))
                    }
                } else {
                    val errorBody = response.body?.string()
                    Log.e(TAG, "Error getting verification requests: ${response.code} - $errorBody")
                    Result.failure(IOException("API error: ${response.code}"))
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception during API call", e)
                Result.failure(e)
            }
        }
    }
}
