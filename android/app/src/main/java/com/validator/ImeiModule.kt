package com.validator

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.telephony.TelephonyManager
import androidx.core.content.ContextCompat

import com.facebook.react.bridge.*

class ImeiModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ImeiModule"
    }

    @ReactMethod
    fun getImei(promise: Promise) {
        // (API 29-)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            promise.reject(
                "UNSUPPORTED_API_LEVEL",
                "IMEI não pode ser acessado diretamente no Android API 29 ou superior."
            )
            return
        }

        val hasPermission = ContextCompat.checkSelfPermission(
            reactContext,
            Manifest.permission.READ_PHONE_STATE
        ) == PackageManager.PERMISSION_GRANTED

        if (!hasPermission) {
            promise.reject(
                "PERMISSION_DENIED",
                "Permissão READ_PHONE_STATE não concedida."
            )
            return
        }

        try {
            val telephony =
                reactContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager?

            if (telephony == null) {
                promise.reject(
                    "TELEPHONY_MANAGER_ERROR",
                    "Serviço de telefonia não disponível."
                )
                return
            }

            val imei = telephony.deviceId

            if (!imei.isNullOrEmpty()) {
                promise.resolve(imei)
            } else {
                promise.reject("IMEI_NOT_FOUND", "Não foi possível obter o IMEI.")
            }

        } catch (e: Exception) {
            promise.reject("IMEI_RETRIEVAL_ERROR", "Erro ao tentar obter o IMEI: ${e.message}")
        }
    }
}
