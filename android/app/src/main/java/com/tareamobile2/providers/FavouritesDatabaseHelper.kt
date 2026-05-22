package com.tareamobile2.providers

import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class FavouritesDatabaseHelper(
    context: Context
) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(CREATE_TABLE_SQL)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS favourite_pokemon")
        onCreate(db)
    }

    fun addFavourite(pokemonId: Int) {
        val values = ContentValues().apply {
            put("id", pokemonId)
            put("created_at", System.currentTimeMillis().toString())
        }

        writableDatabase.insertWithOnConflict(
            "favourite_pokemon",
            null,
            values,
            SQLiteDatabase.CONFLICT_REPLACE,
        )
    }

    fun removeFavourite(pokemonId: Int) {
        writableDatabase.delete(
            "favourite_pokemon",
            "id = ?",
            arrayOf(pokemonId.toString()),
        )
    }

    fun isFavourite(pokemonId: Int): Boolean {
        readableDatabase.rawQuery(
            "SELECT COUNT(*) AS count FROM favourite_pokemon WHERE id = ?",
            arrayOf(pokemonId.toString()),
        ).use { cursor ->
            return cursor.moveToFirst() && cursor.getInt(cursor.getColumnIndexOrThrow("count")) > 0
        }
    }

    fun getFavouriteIds(): List<Int> {
        val ids = mutableListOf<Int>()

        readableDatabase.rawQuery(
            "SELECT id FROM favourite_pokemon ORDER BY created_at DESC",
            null,
        ).use { cursor ->
            while (cursor.moveToNext()) {
                ids.add(cursor.getInt(cursor.getColumnIndexOrThrow("id")))
            }
        }

        return ids
    }

    fun getFavouriteCursor(): Cursor {
        return readableDatabase.rawQuery(
            "SELECT id, created_at FROM favourite_pokemon ORDER BY created_at DESC",
            null,
        )
    }

    companion object {
        private const val DATABASE_NAME = "pokemon.db"
        private const val DATABASE_VERSION = 1

        private const val CREATE_TABLE_SQL = """
            CREATE TABLE IF NOT EXISTS favourite_pokemon (
                id INTEGER PRIMARY KEY,
                created_at TEXT NOT NULL
            )
        """
    }
}