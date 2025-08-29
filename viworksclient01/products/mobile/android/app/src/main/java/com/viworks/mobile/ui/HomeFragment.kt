package com.viworks.mobile.ui

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.launch
// Firebase imports disabled for demo
import com.viworks.mobile.R
import com.viworks.mobile.util.PreferenceManager
import java.util.UUID
import android.content.Intent
import com.viworks.mobile.ui.SettingsActivity

class HomeFragment : Fragment() {
    
    companion object {
        private const val TAG = "HomeFragment"
    }
    
    private lateinit var tvStatusTitle: TextView
    private lateinit var tvStatusDescription: TextView
    private lateinit var btnRequestVerification: Button
    private lateinit var btnSettings: Button
    private lateinit var btnLogout: Button
    private lateinit var preferenceManager: PreferenceManager
    
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        try {
            val allGranted = permissions.entries.all { it.value }
            if (allGranted) {
                updateStatus(getString(R.string.home_permissions_granted))
            } else {
                updateStatus(getString(R.string.home_permissions_denied))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error handling permissions result", e)
        }
    }
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        try {
            Log.d(TAG, "onCreateView: Creating HomeFragment view")
            return inflater.inflate(R.layout.fragment_home, container, false)
        } catch (e: Exception) {
            Log.e(TAG, "onCreateView: Error creating view", e)
            return null
        }
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        try {
            Log.d(TAG, "onViewCreated: Setting up HomeFragment")
            super.onViewCreated(view, savedInstanceState)
            
            // Initialize views
            Log.d(TAG, "onViewCreated: Initializing views")
            try {
                tvStatusTitle = view.findViewById(R.id.tv_status_title)
                tvStatusDescription = view.findViewById(R.id.tv_status_description)
                btnRequestVerification = view.findViewById(R.id.btn_request_verification)
                btnSettings = view.findViewById(R.id.btn_settings)
                btnLogout = view.findViewById(R.id.btn_logout)
                Log.d(TAG, "onViewCreated: Views initialized successfully")
            } catch (e: Exception) {
                Log.e(TAG, "onViewCreated: Error initializing views", e)
                return
            }
            
            // Initialize only essential components
            Log.d(TAG, "onViewCreated: Initializing components")
            try {
                preferenceManager = PreferenceManager(requireContext())
                Log.d(TAG, "onViewCreated: PreferenceManager initialized")
            } catch (e: Exception) {
                Log.e(TAG, "onViewCreated: Error initializing PreferenceManager", e)
                return
            }
            
            // Set up button listeners
            Log.d(TAG, "onViewCreated: Setting up button listeners")
            try {
                btnRequestVerification.setOnClickListener {
                    Log.d(TAG, "requestVerification button clicked!")
                    requestVerification()
                }
                
                btnSettings.setOnClickListener {
                    // Open settings activity
                    val intent = Intent(requireContext(), SettingsActivity::class.java)
                    startActivity(intent)
                }
                
                btnLogout.setOnClickListener {
                    performLogout()
                }
                Log.d(TAG, "onViewCreated: Button listeners set up successfully")
            } catch (e: Exception) {
                Log.e(TAG, "onViewCreated: Error setting up button listeners", e)
            }
            
            // Request permissions (non-blocking)
            Log.d(TAG, "onViewCreated: Requesting permissions")
            try {
                requestPermissions()
            } catch (e: Exception) {
                Log.e(TAG, "onViewCreated: Error requesting permissions", e)
            }
            
            // FCM token check disabled for demo
            Log.d(TAG, "onViewCreated: FCM token check disabled for demo")
            
            Log.d(TAG, "onViewCreated: HomeFragment set up successfully")
            
        } catch (e: Exception) {
            Log.e(TAG, "onViewCreated: Error setting up HomeFragment", e)
        }
    }
    
    private fun requestPermissions() {
        try {
            val permissions = mutableListOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            )
            
            // Add notification permission for Android 13+
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                permissions.add(Manifest.permission.POST_NOTIFICATIONS)
            }
            
            val permissionsToRequest = permissions.filter {
                ContextCompat.checkSelfPermission(requireContext(), it) != PackageManager.PERMISSION_GRANTED
            }.toTypedArray()
            
            if (permissionsToRequest.isNotEmpty()) {
                requestPermissionLauncher.launch(permissionsToRequest)
            }
        } catch (e: Exception) {
            Log.e(TAG, "requestPermissions: Error requesting permissions", e)
        }
    }
    
    private fun checkFcmToken() {
        // FCM disabled for demo - using custom backend
        Log.d(TAG, "FCM token check disabled for demo")
    }
    
    private fun requestVerification() {
        try {
            // Generate a random request ID
            val requestId = UUID.randomUUID().toString()
            
            // Show a message
            updateStatus("در حال ارسال درخواست احراز هویت...")
            Snackbar.make(
                requireView(),
                "Verification request sent",
                Snackbar.LENGTH_SHORT
            ).show()
            
            // Navigate to verification fragment
            val bundle = Bundle().apply {
                putString("requestId", requestId)
            }
            
            findNavController().navigate(R.id.action_to_verification_fragment, bundle)
        } catch (e: Exception) {
            Log.e(TAG, "requestVerification: Error requesting verification", e)
            showError("خطا در ارسال درخواست: ${e.message}")
        }
    }
    
    private fun performLogout() {
        lifecycleScope.launch {
            try {
                Log.d(TAG, "performLogout: Starting logout process")
                
                // Clear stored data
                preferenceManager.clearAll()
                Log.d(TAG, "performLogout: Data cleared successfully")
                
                // Navigate back to login
                val intent = requireActivity().intent
                requireActivity().finish()
                startActivity(intent)
                Log.d(TAG, "performLogout: Logout completed successfully")
                
            } catch (e: Exception) {
                Log.e(TAG, "performLogout: Error during logout", e)
                showError("خطا در خروج: ${e.message}")
            }
        }
    }
    
    private fun updateStatus(message: String) {
        try {
            tvStatusDescription.text = message
        } catch (e: Exception) {
            Log.e(TAG, "updateStatus: Error updating status", e)
        }
    }
    
    private fun showError(message: String) {
        try {
            Snackbar.make(requireView(), message, Snackbar.LENGTH_LONG).show()
        } catch (e: Exception) {
            Log.e(TAG, "showError: Error showing error message", e)
        }
    }
}