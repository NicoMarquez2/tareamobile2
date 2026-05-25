package com.tareamobile2.providers

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class FavouritesDatabaseHelperTest {

    private lateinit var context: Context
    private lateinit var databaseHelper: FavouritesDatabaseHelper

    @Before
    fun setUp() {
        context = ApplicationProvider.getApplicationContext()
        context.deleteDatabase("pokemon.db")
        databaseHelper = FavouritesDatabaseHelper(context)
    }

    @After
    fun tearDown() {
        databaseHelper.close()
        context.deleteDatabase("pokemon.db")
    }

    @Test
    fun addFavourite_savesPokemonAsFavourite() {
        databaseHelper.addFavourite(25)

        val isFavourite = databaseHelper.isFavourite(25)

        assertTrue(isFavourite)
    }

    @Test
    fun removeFavourite_deletesPokemonFromFavourites() {
        databaseHelper.addFavourite(25)

        databaseHelper.removeFavourite(25)

        assertFalse(databaseHelper.isFavourite(25))
    }

    @Test
    fun getFavouriteIds_returnsSavedPokemonIds() {
        databaseHelper.addFavourite(25)
        databaseHelper.addFavourite(6)

        val ids = databaseHelper.getFavouriteIds()

        assertEquals(listOf(6, 25), ids)
    }

    @Test
    fun getFavouriteCursor_returnsRowsFromDatabase() {
        databaseHelper.addFavourite(25)

        val cursor = databaseHelper.getFavouriteCursor()

        cursor.use {
            assertTrue(it.moveToFirst())
            assertEquals(25, it.getInt(it.getColumnIndexOrThrow("id")))
        }
    }
}