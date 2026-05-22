package com.tareamobile2.services

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class PokemonImageModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "PokemonImageModule"
    }

    @ReactMethod
    fun downloadPokemonImage(pokemonName: String, imageUrl: String) {
        val intent = Intent(reactContext, PokemonImageDownloadService::class.java).apply {
            putExtra(PokemonImageDownloadService.EXTRA_POKEMON_NAME, pokemonName)
            putExtra(PokemonImageDownloadService.EXTRA_IMAGE_URL, imageUrl)
        }

        reactContext.startService(intent)
    }
}