import { getDatabase } from "./database";

export type Favourite = {
    id: number;
    created_at: string;
};

export async function addFavourite(pokemonId: number) {
    const db = await getDatabase();

    await db.executeSql(
        'INSERT INTO favourite_pokemon (id, created_at) VALUES (?, ?)',
        [pokemonId, new Date().toISOString()]
    );
}

export async function removeFavourite(pokemonId: number) {
    const db = await getDatabase();

    await db.executeSql(
        'DELETE FROM favourite_pokemon WHERE id = ?',
        [pokemonId]
    );
}

export async function isFavourite(pokemonId: number): Promise<boolean> {
    const db = await getDatabase();

    const [result] = await db.executeSql(
        'SELECT COUNT(*) as count FROM favourite_pokemon WHERE id = ?',
        [pokemonId]
    );

    return result.rows.item(0).count > 0;
}

export async function getFavouritesIds(): Promise<number[]> {
    const db = await getDatabase();

    const [result] = await db.executeSql(
        'SELECT id FROM favourite_pokemon ORDER BY created_at DESC'
    );

    const ids: number[] = [];
    for (let i = 0; i < result.rows.length; i++) {
        ids.push(result.rows.item(i).id);
    }
    return ids;
}