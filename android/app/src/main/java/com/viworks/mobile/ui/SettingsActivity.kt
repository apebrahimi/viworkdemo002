package com.viworks.mobile.ui

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.snackbar.Snackbar
import com.viworks.mobile.R
import com.viworks.mobile.util.Config

class SettingsActivity : AppCompatActivity() {
    
    companion object {
        private const val TAG = "SettingsActivity"
    }
    
    private lateinit var etCustomUrl: EditText
    private lateinit var btnSaveUrl: Button
    private lateinit var btnClearUrl: Button
    private lateinit var btnSetLocal: Button
    private lateinit var btnSetDev: Button
    private lateinit var btnSetProd: Button
    private lateinit var tvCurrentConfig: TextView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)
        
        initializeViews()
        updateConfigDisplay()
        setupListeners()
    }
    
    private fun initializeViews() {
        etCustomUrl = findViewById(R.id.et_custom_url)
        btnSaveUrl = findViewById(R.id.btn_save_url)
        btnClearUrl = findViewById(R.id.btn_clear_url)
        btnSetLocal = findViewById(R.id.btn_set_local)
        btnSetDev = findViewById(R.id.btn_set_dev)
        btnSetProd = findViewById(R.id.btn_set_prod)
        tvCurrentConfig = findViewById(R.id.tv_current_config)
        
        // Set current custom URL if any
        val currentUrl = Config.getApiBaseUrl()
        if (currentUrl != Config.getApiBaseUrl()) {
            etCustomUrl.setText(currentUrl)
        }
    }
    
    private fun setupListeners() {
        btnSaveUrl.setOnClickListener {
            val customUrl = etCustomUrl.text.toString().trim()
            if (customUrl.isNotEmpty()) {
                Config.setCustomApiUrl(customUrl)
                showMessage("Custom URL saved: $customUrl")
                updateConfigDisplay()
            } else {
                showMessage("Please enter a valid URL")
            }
        }
        
        btnClearUrl.setOnClickListener {
            Config.clearCustomApiUrl()
            etCustomUrl.text.clear()
            showMessage("Custom URL cleared")
            updateConfigDisplay()
        }
        
        btnSetLocal.setOnClickListener {
            Config.setEnvironment(Config.ENV_LOCAL)
            showMessage("Environment set to LOCAL")
            updateConfigDisplay()
        }
        
        btnSetDev.setOnClickListener {
            Config.setEnvironment(Config.ENV_DEVELOPMENT)
            showMessage("Environment set to DEVELOPMENT")
            updateConfigDisplay()
        }
        
        btnSetProd.setOnClickListener {
            Config.setEnvironment(Config.ENV_PRODUCTION)
            showMessage("Environment set to PRODUCTION")
            updateConfigDisplay()
        }
    }
    
    private fun updateConfigDisplay() {
        val configInfo = Config.getConfigInfo()
        tvCurrentConfig.text = configInfo
        Log.d(TAG, "Current config: $configInfo")
    }
    
    private fun showMessage(message: String) {
        Snackbar.make(findViewById(android.R.id.content), message, Snackbar.LENGTH_SHORT).show()
    }
}
