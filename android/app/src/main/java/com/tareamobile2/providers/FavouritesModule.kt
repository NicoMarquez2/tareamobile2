package com.tareamobile2.providers

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class FavouritesModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val databaseHelper = FavouritesDatabaseHelper(reactContext)

    override fun getName(): String {
        return "FavouritesModule"
    }

    @ReactMethod
    fun addFavourite(pokemonId: Int, promise: Promise) {
        try {
            databaseHelper.addFavourite(pokemonId)
            promise.resolve(true)
        } catch (error: Exception) {
            promise.reject("ADD_FAVOURITE_ERROR", "No se pudo agregar favorito", error)
        }
    }

    @ReactMethod
    fun removeFavourite(pokemonId: Int, promise: Promise) {
        try {
            databaseHelper.removeFavourite(pokemonId)
            promise.resolve(true)
        } catch (error: Exception) {
            promise.reject("REMOVE_FAVOURITE_ERROR", "No se pudo quitar favorito", error)
        }
    }

    @ReactMethod
    fun isFavourite(pokemonId: Int, promise: Promise) {
        try {
            promise.resolve(databaseHelper.isFavourite(pokemonId))
        } catch (error: Exception) {
            promise.reject("IS_FAVOURITE_ERROR", "No se pudo consultar favorito", error)
        }
    }

    @ReactMethod
    fun getFavouriteIds(promise: Promise) {
        try {
            val ids = databaseHelper.getFavouriteIds()
            val result = Arguments.createArray()

            ids.forEach { id ->
                result.pushInt(id)
            }

            promise.resolve(result)
        } catch (error: Exception) {
            promise.reject("GET_FAVOURITES_ERROR", "No se pudieron cargar favoritos", error)
        }
    }
}