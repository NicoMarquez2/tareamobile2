import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export async function getDatabase() {
    try {
        const db = await SQLite.openDatabase({ name: 'pokemon.db', location: 'default' });
        return db;
    } catch (error) {
        console.error('Error opening database:', error);
        throw error;
    }
}

export async function initDatabase() {
    try {
        const db = await getDatabase();
        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS favourite_pokemon (
                id INTEGER PRIMARY KEY,
                created_at TEXT NOT NULL
            );
        `);
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}