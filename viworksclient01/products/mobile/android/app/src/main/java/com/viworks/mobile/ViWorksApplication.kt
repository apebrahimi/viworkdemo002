package com.viworks.mobile

import android.app.Application
import android.util.Log
import com.google.firebase.FirebaseApp
import com.google.firebase.messaging.FirebaseMessaging
import com.viworks.mobile.util.Config

class ViWorksApplication : Application() {
    
    companion object {
        private const val TAG = "ViWorksApplication"
    }
    
    override fun onCreate() {
        try {
            Log.d(TAG, "onCreate: Starting ViWorksApplication")
            super.onCreate()
            
            // Initialize configuration
            Log.d(TAG, "onCreate: Initializing configuration")
            Config.initialize(this)
            Log.d(TAG, "onCreate: Configuration initialized")
            Log.d(TAG, "onCreate: Config info: ${Config.getConfigInfo()}")
            
            // Initialize Firebase
            Log.d(TAG, "onCreate: Initializing Firebase")
            FirebaseApp.initializeApp(this)
            Log.d(TAG, "onCreate: Firebase initialized successfully")
            
            // Get FCM token for push notifications
            Log.d(TAG, "onCreate: Getting FCM token")
            FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
                try {
                    if (!task.isSuccessful) {
                        Log.w(TAG, "Fetching FCM registration token failed", task.exception)
                        return@addOnCompleteListener
                    }
                    
                    // Get the token
                    val token = task.result
                    
                    // Log the token (in production, send this to your backend)
                    Log.d(TAG, "FCM Token: $token")
                    
                    // TODO: Send token to backend server
                } catch (e: Exception) {
                    Log.e(TAG, "checkFcmToken: Error in completion listener", e)
                }
            }
            
            Log.d(TAG, "onCreate: ViWorksApplication initialized successfully")
            
        } catch (e: Exception) {
            Log.e(TAG, "onCreate: Error initializing ViWorksApplication", e)
        }
    }
}
