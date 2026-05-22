package com.tareamobile2.services

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.ContentValues
import android.content.Intent
import android.media.MediaScannerConnection
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.IBinder
import android.provider.MediaStore
import android.util.Log
import java.io.File
import java.net.URL
import kotlin.concurrent.thread

class PokemonImageDownloadService : Service() {

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val pokemonName = intent?.getStringExtra(EXTRA_POKEMON_NAME)
        val imageUrl = intent?.getStringExtra(EXTRA_IMAGE_URL)

        if (pokemonName.isNullOrBlank() || imageUrl.isNullOrBlank()) {
            Log.e(TAG, "No se recibio nombre o URL de imagen")
            stopSelf(startId)
            return START_NOT_STICKY
        }

        showNotification(
            title = "Descargando imagen",
            message = "Guardando imagen de $pokemonName",
            ongoing = true,
        )

        thread {
            try {
                Log.d(TAG, "Descargando imagen de $pokemonName")

                val imageBytes = URL(imageUrl).readBytes()
                val savedUri = saveImageToGallery(pokemonName, imageBytes)

                Log.d(TAG, "Imagen guardada en galeria: $savedUri")
                showNotification(
                    title = "Imagen guardada",
                    message = "La imagen de $pokemonName se guardo en Galeria/Pokedex",
                    ongoing = false,
                )
            } catch (error: Exception) {
                Log.e(TAG, "Error al descargar imagen", error)
                showNotification(
                    title = "No se pudo guardar",
                    message = "Fallo la descarga de la imagen de $pokemonName",
                    ongoing = false,
                )
            } finally {
                stopSelf(startId)
            }
        }

        return START_NOT_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun saveImageToGallery(pokemonName: String, imageBytes: ByteArray): Uri {
        val fileName = "${sanitizeFileName(pokemonName)}.png"

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            saveImageWithMediaStore(fileName, imageBytes)
        } else {
            saveImageInPublicPictures(fileName, imageBytes)
        }
    }

    private fun saveImageWithMediaStore(fileName: String, imageBytes: ByteArray): Uri {
        val values = ContentValues().apply {
            put(MediaStore.Images.Media.DISPLAY_NAME, fileName)
            put(MediaStore.Images.Media.MIME_TYPE, "image/png")
            put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/Pokedex")
            put(MediaStore.Images.Media.IS_PENDING, 1)
        }

        val resolver = contentResolver
        val imageUri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
            ?: error("No se pudo crear el archivo en MediaStore")

        resolver.openOutputStream(imageUri)?.use { outputStream ->
            outputStream.write(imageBytes)
        } ?: error("No se pudo abrir el archivo para escribir")

        values.clear()
        values.put(MediaStore.Images.Media.IS_PENDING, 0)
        resolver.update(imageUri, values, null, null)

        return imageUri
    }

    private fun saveImageInPublicPictures(fileName: String, imageBytes: ByteArray): Uri {
        val picturesDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
        val pokedexDir = File(picturesDir, "Pokedex")

        if (!pokedexDir.exists()) {
            pokedexDir.mkdirs()
        }

        val imageFile = File(pokedexDir, fileName)
        imageFile.writeBytes(imageBytes)

        MediaScannerConnection.scanFile(
            this,
            arrayOf(imageFile.absolutePath),
            arrayOf("image/png"),
            null,
        )

        return Uri.fromFile(imageFile)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return
        }

        val channel = NotificationChannel(
            CHANNEL_ID,
            "Descargas de Pokemon",
            NotificationManager.IMPORTANCE_DEFAULT,
        ).apply {
            description = "Estado de descarga de imagenes de Pokemon"
        }

        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.createNotificationChannel(channel)
    }

    private fun showNotification(title: String, message: String, ongoing: Boolean) {
        val notification = buildNotification(title, message, ongoing)
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.notify(NOTIFICATION_ID, notification)
    }

    private fun buildNotification(title: String, message: String, ongoing: Boolean): Notification {
        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this)
        }

        return builder
            .setSmallIcon(android.R.drawable.stat_sys_download_done)
            .setContentTitle(title)
            .setContentText(message)
            .setOngoing(ongoing)
            .setAutoCancel(!ongoing)
            .build()
    }

    private fun sanitizeFileName(value: String): String {
        return value.lowercase().replace(Regex("[^a-z0-9_-]"), "_")
    }

    companion object {
        const val EXTRA_POKEMON_NAME = "pokemonName"
        const val EXTRA_IMAGE_URL = "imageUrl"

        private const val TAG = "PokemonImageDownloadService"
        private const val CHANNEL_ID = "pokemon_image_downloads"
        private const val NOTIFICATION_ID = 1001
    }
}
