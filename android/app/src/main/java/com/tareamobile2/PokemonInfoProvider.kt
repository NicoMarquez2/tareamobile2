package com.tareamobile2

import android.content.ContentProvider
import android.content.ContentValues
import android.content.Context
import android.content.UriMatcher
import android.database.Cursor
import android.database.MatrixCursor
import android.net.Uri

class PokemonInfoProvider : ContentProvider() {

    private val uriMatcher = UriMatcher(UriMatcher.NO_MATCH).apply {
        addURI(AUTHORITY, "info", INFO)
        addURI(AUTHORITY, "favorites", FAVORITES)
    }

    override fun onCreate(): Boolean {
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?,
    ): Cursor? {
        return when (uriMatcher.match(uri)) {
            INFO -> queryInfo()
            FAVORITES -> queryFavorites()
            else -> throw IllegalArgumentException("URI no soportada: $uri")
        }
    }

    private fun queryInfo(): Cursor {
        val cursor = MatrixCursor(arrayOf("key", "value"))

        cursor.addRow(arrayOf("app_name", "TareaMobile2"))
        cursor.addRow(arrayOf("framework", "React Native"))
        cursor.addRow(arrayOf("api", "PokeAPI"))
        cursor.addRow(arrayOf("storage", "SQLite"))
        cursor.addRow(arrayOf("database", "pokemon.db"))

        return cursor
    }

    private fun queryFavorites(): Cursor? {
        val db = context?.openOrCreateDatabase("pokemon.db", Context.MODE_PRIVATE, null)
            ?: return null

        db.execSQL(
            """
            CREATE TABLE IF NOT EXISTS favourite_pokemon (
                id INTEGER PRIMARY KEY,
                created_at TEXT NOT NULL
            )
            """.trimIndent(),
        )

        return db.rawQuery(
            "SELECT id, created_at FROM favourite_pokemon ORDER BY created_at DESC",
            null,
        )
    }

    override fun getType(uri: Uri): String? {
        return when (uriMatcher.match(uri)) {
            INFO -> "vnd.android.cursor.dir/vnd.com.tareamobile2.info"
            FAVORITES -> "vnd.android.cursor.dir/vnd.com.tareamobile2.favorites"
            else -> null
        }
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        throw UnsupportedOperationException("Provider solo lectura")
    }

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<out String>?): Int {
        throw UnsupportedOperationException("Provider solo lectura")
    }

    override fun update(
        uri: Uri,
        values: ContentValues?,
        selection: String?,
        selectionArgs: Array<out String>?,
    ): Int {
        throw UnsupportedOperationException("Provider solo lectura")
    }

    companion object {
        private const val AUTHORITY = "com.tareamobile2.provider"
        private const val INFO = 1
        private const val FAVORITES = 2
    }
}
