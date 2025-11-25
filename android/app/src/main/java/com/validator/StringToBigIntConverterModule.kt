package com.validator

import com.facebook.react.bridge.*
import java.math.BigInteger

class StringToBigIntConverterModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "StringToBigIntConverterModule"
    }

    @ReactMethod
    fun convertStringToNumber(str: String, promise: Promise) {
        try {
            var total = BigInteger.ZERO
            val base = BigInteger.valueOf(36)

            for (char in str) {
                val value = Character.getNumericValue(char)

                if (value < 0 || value >= 36) {
                    continue
                }

                total = total.multiply(base).add(BigInteger.valueOf(value.toLong()))
            }

            promise.resolve(total.toString())

        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}
