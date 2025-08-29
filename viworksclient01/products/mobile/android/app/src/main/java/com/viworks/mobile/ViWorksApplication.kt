package com.viworks.mobile

import android.app.Application
import android.util.Log
// Firebase imports disabled for demo
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
            
            // Firebase disabled for demo - using custom backend
            Log.d(TAG, "onCreate: Firebase disabled for demo")
            
            Log.d(TAG, "onCreate: ViWorksApplication initialized successfully")
            
        } catch (e: Exception) {
            Log.e(TAG, "onCreate: Error initializing ViWorksApplication", e)
        }
    }
}
