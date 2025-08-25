package com.viworks.mobile.util

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Log
import androidx.security.crypto.EncryptedSharedPreferences
import java.security.KeyStore

class PreferenceManager(private val context: Context) {
    
    companion object {
        private const val TAG = "PreferenceManager"
        private const val PREF_NAME = "viworks_secure_prefs"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USERNAME = "username"
        private const val KEY_DEVICE_ID = "device_id"
        private const val KEY_FCM_TOKEN = "fcm_token"
        private const val KEY_API_TOKEN = "api_token"
        private const val KEY_AUTH_TOKEN = "auth_token"
        private const val KEY_DEVICE_REGISTERED = "device_registered"
        private const val KEY_FULL_NAME = "full_name"
        private const val KEY_ORGANIZATION_ID = "organization_id"
        private const val KEY_DEVICE_NAME = "device_name"
    }
    
    private val sharedPreferences: SharedPreferences by lazy {
        // For demo purposes, use regular shared preferences
        context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }
    
    fun saveUserId(userId: String) {
        sharedPreferences.edit().putString(KEY_USER_ID, userId).apply()
    }
    
    fun getUserId(): String? {
        return sharedPreferences.getString(KEY_USER_ID, null)
    }
    
    fun saveUsername(username: String) {
        sharedPreferences.edit().putString(KEY_USERNAME, username).apply()
    }
    
    fun getUsername(): String? {
        return sharedPreferences.getString(KEY_USERNAME, null)
    }
    
    fun saveDeviceId(deviceId: String) {
        sharedPreferences.edit().putString(KEY_DEVICE_ID, deviceId).apply()
    }
    
    fun getDeviceId(): String? {
        return sharedPreferences.getString(KEY_DEVICE_ID, null)
    }
    
    fun saveFcmToken(token: String) {
        sharedPreferences.edit().putString(KEY_FCM_TOKEN, token).apply()
    }
    
    fun getFcmToken(): String? {
        return sharedPreferences.getString(KEY_FCM_TOKEN, null)
    }
    
    fun saveApiToken(token: String) {
        sharedPreferences.edit().putString(KEY_API_TOKEN, token).apply()
    }
    
    fun getApiToken(): String? {
        return sharedPreferences.getString(KEY_API_TOKEN, null)
    }
    
    fun saveAuthToken(token: String) {
        sharedPreferences.edit().putString(KEY_AUTH_TOKEN, token).apply()
    }
    
    fun getAuthToken(): String? {
        return sharedPreferences.getString(KEY_AUTH_TOKEN, null)
    }
    
    // Device Registration Methods
    fun saveDeviceRegistered(registered: Boolean) {
        sharedPreferences.edit().putBoolean(KEY_DEVICE_REGISTERED, registered).apply()
    }
    
    fun isDeviceRegistered(): Boolean {
        return sharedPreferences.getBoolean(KEY_DEVICE_REGISTERED, false)
    }
    
    fun saveFullName(fullName: String) {
        sharedPreferences.edit().putString(KEY_FULL_NAME, fullName).apply()
    }
    
    fun getFullName(): String? {
        return sharedPreferences.getString(KEY_FULL_NAME, null)
    }
    
    fun saveOrganizationId(organizationId: String) {
        sharedPreferences.edit().putString(KEY_ORGANIZATION_ID, organizationId).apply()
    }
    
    fun getOrganizationId(): String? {
        return sharedPreferences.getString(KEY_ORGANIZATION_ID, null)
    }
    
    fun saveDeviceName(deviceName: String) {
        sharedPreferences.edit().putString(KEY_DEVICE_NAME, deviceName).apply()
    }
    
    fun getDeviceName(): String? {
        return sharedPreferences.getString(KEY_DEVICE_NAME, null)
    }
    
    fun clearAll() {
        sharedPreferences.edit().clear().apply()
    }
}
