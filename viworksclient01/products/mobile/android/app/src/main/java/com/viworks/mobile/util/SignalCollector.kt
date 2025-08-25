package com.viworks.mobile.util

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.telephony.TelephonyManager
import android.util.Log
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import com.viworks.mobile.model.SignalData
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext
import java.net.NetworkInterface
import java.util.UUID
import java.util.concurrent.TimeUnit

class SignalCollector(private val context: Context) {
    
    companion object {
        private const val TAG = "SignalCollector"
    }
    
    private val fusedLocationClient: FusedLocationProviderClient by lazy {
        LocationServices.getFusedLocationProviderClient(context)
    }
    
    private val preferenceManager = PreferenceManager(context)
    
    /**
     * Collect all available signals from the device
     */
    suspend fun collectSignals(deviceIntegrityToken: String?): SignalData {
        return withContext(Dispatchers.IO) {
            // Get or generate device ID
            val deviceId = getOrCreateDeviceId()
            
            // Get location
            val location = getLocation()
            
            // Get network info
            val networkInfo = getNetworkInfo()
            
            SignalData(
                deviceId = deviceId,
                latitude = location?.latitude,
                longitude = location?.longitude,
                ip = networkInfo.first,
                carrier = networkInfo.second,
                networkType = networkInfo.third,
                deviceIntegrityToken = deviceIntegrityToken
            )
        }
    }
    
    /**
     * Get or create a unique device ID
     */
    private fun getOrCreateDeviceId(): String {
        val savedDeviceId = preferenceManager.getDeviceId()
        
        return if (savedDeviceId != null) {
            savedDeviceId
        } else {
            val newDeviceId = UUID.randomUUID().toString()
            preferenceManager.saveDeviceId(newDeviceId)
            newDeviceId
        }
    }
    
    /**
     * Get the current location if permission is granted
     */
    private suspend fun getLocation(): Location? {
        return try {
            if (ActivityCompat.checkSelfPermission(
                    context,
                    Manifest.permission.ACCESS_FINE_LOCATION
                ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                    context,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                Log.w(TAG, "Location permission not granted")
                return null
            }
            
            val cancellationToken = CancellationTokenSource()
            
            try {
                fusedLocationClient.getCurrentLocation(
                    Priority.PRIORITY_HIGH_ACCURACY,
                    cancellationToken.token
                ).await()
            } finally {
                cancellationToken.cancel()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting location", e)
            null
        }
    }
    
    /**
     * Get network information (IP, carrier, network type)
     */
    private fun getNetworkInfo(): Triple<String?, String?, String?> {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        
        var ip: String? = null
        var carrier: String? = null
        var networkType: String? = null
        
        try {
            // Get IP address (this is a simplified approach, in production you'd use a service)
            val networkInterfaces = NetworkInterface.getNetworkInterfaces()
            while (networkInterfaces.hasMoreElements()) {
                val networkInterface = networkInterfaces.nextElement()
                val addresses = networkInterface.inetAddresses
                while (addresses.hasMoreElements()) {
                    val address = addresses.nextElement()
                    if (!address.isLoopbackAddress && address.hostAddress?.contains(':') == false) {
                        ip = address.hostAddress
                    }
                }
            }
            
            // Get carrier name
            carrier = telephonyManager.networkOperatorName
            
            // Get network type
            val activeNetwork = connectivityManager.activeNetwork
            if (activeNetwork != null) {
                val capabilities = connectivityManager.getNetworkCapabilities(activeNetwork)
                networkType = when {
                    capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true -> "WIFI"
                    capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true -> "CELLULAR"
                    capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) == true -> "ETHERNET"
                    else -> "UNKNOWN"
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting network info", e)
        }
        
        return Triple(ip, carrier, networkType)
    }
}
