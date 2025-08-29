package com.viworks.mobile.ui

import android.os.Bundle
import android.os.CountDownTimer
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import com.viworks.mobile.R
import com.viworks.mobile.model.SignalData
import com.viworks.mobile.model.VerificationRequest
import com.viworks.mobile.security.DeviceIntegrityChecker
import com.viworks.mobile.service.ApiService
import com.viworks.mobile.util.SignalCollector
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

class VerificationFragment : Fragment() {
    
    companion object {
        private const val TAG = "VerificationFragment"
    }
    
    private lateinit var tvVerificationCode: TextView
    private lateinit var tvExpiresAt: TextView
    private lateinit var tvStatus: TextView
    private lateinit var btnApprove: Button
    private lateinit var btnDeny: Button
    
    // Use real API service to fetch verification requests
    private lateinit var apiService: ApiService
    private lateinit var signalCollector: SignalCollector
    private lateinit var deviceIntegrityChecker: DeviceIntegrityChecker
    
    private var requestId: String? = null
    private var countDownTimer: CountDownTimer? = null
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_verification, container, false)
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Initialize views
        tvVerificationCode = view.findViewById(R.id.tv_verification_code)
        tvExpiresAt = view.findViewById(R.id.tv_expires)
        tvStatus = view.findViewById(R.id.tv_status)
        btnApprove = view.findViewById(R.id.btn_approve)
        btnDeny = view.findViewById(R.id.btn_deny)
        
        // Initialize services with real API implementation
        apiService = ApiService()
        signalCollector = SignalCollector(requireContext())
        deviceIntegrityChecker = DeviceIntegrityChecker(requireContext())
        
        // Get request ID from arguments
        requestId = arguments?.getString("requestId")
        
        if (requestId == null) {
            showError("Invalid verification request")
            return
        }
        
        // Set up button listeners
        btnApprove.setOnClickListener {
            approveVerification()
        }
        
        btnDeny.setOnClickListener {
            denyVerification()
        }
        
        // Start verification process
        startVerification()
    }
    
    private fun startVerification() {
        tvStatus.text = "در حال بررسی امنیت دستگاه..."
        
        // Check device integrity
        deviceIntegrityChecker.verifyDeviceIntegrity { isValid, errorMessage ->
            if (!isValid) {
                showError("Security check failed: $errorMessage")
                return@verifyDeviceIntegrity
            }
            
            // Fetch verification requests from backend
            lifecycleScope.launch {
                try {
                    tvStatus.text = "در حال دریافت درخواست‌های تایید..."
                    
                    val result = apiService.getVerificationRequests()
                    
                    if (result.isSuccess) {
                        val requests = result.getOrNull()
                        if (requests != null && requests.isNotEmpty()) {
                            // Display the most recent pending request
                            val pendingRequest = requests.find { !it.completed } ?: requests.first()
                            displayVerificationRequest(pendingRequest)
                        } else {
                            showError("No verification requests found")
                        }
                    } else {
                        showError("Error: ${result.exceptionOrNull()?.message}")
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error fetching verification requests", e)
                    showError("Error: ${e.message}")
                }
            }
        }
    }
    
    private fun displayVerificationRequest(request: VerificationRequest) {
        // Format code with spaces for readability
        val formattedCode = request.code.chunked(3).joinToString(" ")
        tvVerificationCode.text = formattedCode
        
        // Start countdown timer
        startCountdownTimer(request.expiresAt)
        
        // Update UI
        tvStatus.text = "درخواست تایید از ${request.deviceId}"
        btnApprove.isEnabled = true
        btnDeny.isEnabled = true
        
        // Store the request ID for approval/denial
        requestId = request.id
    }
    
    private fun startCountdownTimer(expiresAt: Long) {
        countDownTimer?.cancel()
        
        val currentTime = System.currentTimeMillis()
        val timeRemaining = expiresAt - currentTime
        
        if (timeRemaining <= 0) {
            tvExpiresAt.text = "Expired"
            return
        }
        
        countDownTimer = object : CountDownTimer(timeRemaining, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val minutes = TimeUnit.MILLISECONDS.toMinutes(millisUntilFinished)
                val seconds = TimeUnit.MILLISECONDS.toSeconds(millisUntilFinished) -
                        TimeUnit.MINUTES.toSeconds(minutes)
                
                tvExpiresAt.text = String.format("Expires in: %02d:%02d", minutes, seconds)
            }
            
            override fun onFinish() {
                tvExpiresAt.text = "Expired"
                tvVerificationCode.text = "------"
                btnApprove.isEnabled = false
                btnDeny.isEnabled = false
            }
        }.start()
    }
    
    private fun approveVerification() {
        lifecycleScope.launch {
            try {
                tvStatus.text = "در حال تایید..."
                btnApprove.isEnabled = false
                btnDeny.isEnabled = false
                
                val result = apiService.confirmVerification(requestId!!, true, "android_device")
                
                if (result.isSuccess) {
                    tvStatus.text = getString(R.string.verification_approved_message)
                    Snackbar.make(
                        requireView(),
                        "Verification approved successfully",
                        Snackbar.LENGTH_LONG
                    ).show()
                } else {
                    showError("Error: ${result.exceptionOrNull()?.message}")
                    btnApprove.isEnabled = true
                    btnDeny.isEnabled = true
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error approving verification", e)
                showError("Error: ${e.message}")
                btnApprove.isEnabled = true
                btnDeny.isEnabled = true
            }
        }
    }
    
    private fun denyVerification() {
        lifecycleScope.launch {
            try {
                tvStatus.text = "در حال رد کردن..."
                btnApprove.isEnabled = false
                btnDeny.isEnabled = false
                
                val result = apiService.confirmVerification(requestId!!, false, "android_device")
                
                if (result.isSuccess) {
                    tvStatus.text = getString(R.string.verification_denied_message)
                    Snackbar.make(
                        requireView(),
                        "Verification denied successfully",
                        Snackbar.LENGTH_LONG
                    ).show()
                } else {
                    showError("Error: ${result.exceptionOrNull()?.message}")
                    btnApprove.isEnabled = true
                    btnDeny.isEnabled = true
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error denying verification", e)
                showError("Error: ${e.message}")
                btnApprove.isEnabled = true
                btnDeny.isEnabled = true
            }
        }
    }
    
    private fun showError(message: String) {
        tvStatus.text = message
        Snackbar.make(requireView(), message, Snackbar.LENGTH_LONG).show()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        countDownTimer?.cancel()
    }
}
