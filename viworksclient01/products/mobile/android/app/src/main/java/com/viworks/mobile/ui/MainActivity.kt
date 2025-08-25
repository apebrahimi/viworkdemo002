package com.viworks.mobile.ui

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import com.google.android.material.snackbar.Snackbar
import com.viworks.mobile.R
import com.viworks.mobile.util.PreferenceManager

class MainActivity : AppCompatActivity() {
    
    companion object {
        private const val TAG = "MainActivity"
    }
    
    private lateinit var navController: NavController
    private lateinit var preferenceManager: PreferenceManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        try {
            Log.d(TAG, "onCreate: Starting MainActivity")
            super.onCreate(savedInstanceState)
            Log.d(TAG, "onCreate: Setting content view")
            setContentView(R.layout.activity_main)
            Log.d(TAG, "onCreate: Content view set successfully")
            
            // Initialize only essential components
            Log.d(TAG, "onCreate: Initializing essential components")
            try {
                preferenceManager = PreferenceManager(this)
                Log.d(TAG, "onCreate: PreferenceManager initialized")
            } catch (e: Exception) {
                Log.e(TAG, "onCreate: Error initializing PreferenceManager", e)
                // Redirect to login on error
                val intent = Intent(this, LoginActivity::class.java)
                startActivity(intent)
                finish()
                return
            }
            
            // Check if user is logged in
            Log.d(TAG, "onCreate: Checking if user is logged in")
            try {
                if (preferenceManager.getAuthToken() == null) {
                    Log.d(TAG, "onCreate: No auth token found, redirecting to login")
                    // Redirect to login
                    val intent = Intent(this, LoginActivity::class.java)
                    startActivity(intent)
                    finish()
                    return
                }
                Log.d(TAG, "onCreate: Auth token found")
            } catch (e: Exception) {
                Log.e(TAG, "onCreate: Error checking auth token", e)
                // Redirect to login on error
                val intent = Intent(this, LoginActivity::class.java)
                startActivity(intent)
                finish()
                return
            }
            
            // Set up navigation
            Log.d(TAG, "onCreate: Setting up navigation")
            try {
                val navHostFragment = supportFragmentManager
                    .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
                navController = navHostFragment.navController
                Log.d(TAG, "onCreate: Navigation set up successfully")
            } catch (e: Exception) {
                Log.e(TAG, "onCreate: Error setting up navigation", e)
                // Show error and return to login
                Snackbar.make(
                    findViewById(android.R.id.content),
                    "خطا در راه‌اندازی برنامه",
                    Snackbar.LENGTH_LONG
                ).show()
                val intent = Intent(this, LoginActivity::class.java)
                startActivity(intent)
                finish()
                return
            }
            
            // Handle intent (for push notifications) - simplified
            Log.d(TAG, "onCreate: Handling intent")
            try {
                handleIntent(intent)
            } catch (e: Exception) {
                Log.e(TAG, "onCreate: Error handling intent", e)
            }
            
            Log.d(TAG, "onCreate: MainActivity initialized successfully")
            
        } catch (e: Exception) {
            Log.e(TAG, "onCreate: Error initializing MainActivity", e)
            // Show error and return to login
            try {
                Snackbar.make(
                    findViewById(android.R.id.content),
                    "خطا در راه‌اندازی برنامه: ${e.message}",
                    Snackbar.LENGTH_LONG
                ).show()
            } catch (e2: Exception) {
                Log.e(TAG, "onCreate: Failed to show error message", e2)
            }
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
    
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }
    
    private fun handleIntent(intent: Intent) {
        try {
            // Check if launched from notification
            if (intent.action == Intent.ACTION_VIEW && intent.data?.scheme == "viworks") {
                val requestId = intent.data?.getQueryParameter("requestId")
                if (requestId != null) {
                    Log.d(TAG, "Verification request received: $requestId")
                    // Navigate to verification fragment
                    navController.navigate(
                        R.id.action_to_verification_fragment,
                        Bundle().apply { putString("requestId", requestId) }
                    )
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "handleIntent: Error handling intent", e)
        }
    }
}
