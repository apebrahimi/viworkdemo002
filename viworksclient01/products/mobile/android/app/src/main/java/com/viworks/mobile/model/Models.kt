package com.viworks.mobile.model

/**
 * Represents a verification request from the server
 */
data class VerificationRequest(
    val id: String,
    val code: String,
    val deviceId: String,
    val userId: String,
    val ipAddress: String,
    val locationLat: Double,
    val locationLng: Double,
    val createdAt: String,
    val expiresAt: Long,
    val completed: Boolean,
    val approved: Boolean?
)

/**
 * Represents a verification code to be displayed to the user
 */
data class VerificationCode(
    val code: String,
    val expiresAt: Long
)

/**
 * Represents the signal data collected from the device
 */
data class SignalData(
    val deviceId: String,
    val latitude: Double?,
    val longitude: Double?,
    val ip: String?,
    val carrier: String?,
    val networkType: String?,
    val deviceIntegrityToken: String?
)

/**
 * Represents a user of the system
 */
data class User(
    val id: String,
    val username: String,
    val email: String?,
    val deviceId: String
)

/**
 * Represents the device security status
 */
data class SecurityStatus(
    val isRooted: Boolean,
    val isHardwareBackedKeystoreAvailable: Boolean,
    val isPlayIntegrityVerified: Boolean,
    val errorMessage: String?
)

/**
 * Login request model
 */
data class LoginRequest(
    val username: String,
    val password: String
)

/**
 * Login response model
 */
data class LoginResponse(
    val success: Boolean,
    val message: String,
    val token: String?,
    val userId: String?
)

/**
 * SMS code request model
 */
data class SmsCodeRequest(
    val phoneNumber: String
)

/**
 * SMS code response model
 */
data class SmsCodeResponse(
    val success: Boolean,
    val message: String,
    val code: String?
)

/**
 * Device registration request model
 */
data class DeviceRegistrationRequest(
    val authToken: String,
    val fullName: String,
    val organizationId: String,
    val deviceName: String,
    val deviceModel: String,
    val androidVersion: String,
    val manufacturer: String,
    val deviceId: String
)

/**
 * Device registration response model
 */
data class DeviceRegistrationResponse(
    val success: Boolean,
    val message: String,
    val deviceId: String?,
    val registrationToken: String?
)
