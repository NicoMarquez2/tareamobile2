package com.tareamobile2.receivers

import android.content.IntentFilter
import android.net.ConnectivityManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class ConnectivityModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var receiver: ConnectivityReceiver? = null
    private var lastConnectionState: Boolean? = null

    override fun getName(): String {
        return "ConnectivityModule"
    }

    override fun initialize() {
        super.initialize()

        receiver = ConnectivityReceiver { isConnected ->
            if (lastConnectionState != isConnected) {
                lastConnectionState = isConnected
                sendConnectivityEvent(isConnected)
            }
        }

        val filter = IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION)
        reactContext.registerReceiver(receiver, filter)
    }

    override fun invalidate() {
        receiver?.let {
            reactContext.unregisterReceiver(it)
        }

        receiver = null
        super.invalidate()
    }

    @ReactMethod
    fun getCurrentConnectionStatus(promise: Promise) {
        val currentState = lastConnectionState ?: false
        promise.resolve(currentState)
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Necesario para NativeEventEmitter en React Native.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Necesario para NativeEventEmitter en React Native.
    }

    private fun sendConnectivityEvent(isConnected: Boolean) {
        val params = Arguments.createMap().apply {
            putBoolean("isConnected", isConnected)
        }

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("connectivityChanged", params)
    }
}