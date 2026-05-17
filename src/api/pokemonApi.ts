import type {
  PokemonDetail,
  PokemonListItem,
  PokemonListResponse,
} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

function getPokemonIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error('Error al consultar PokeAPI');
  }

  return response.json();
}

export async function getPokemonList(
  limit = 20,
  offset = 0,
): Promise<PokemonListItem[]> {
  const data = await apiGet<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`,
  );

  return data.results.map(pokemon => ({
    id: getPokemonIdFromUrl(pokemon.url),
    name: pokemon.name,
    url: pokemon.url,
  }));
}

export async function getPokemonById(id: number): Promise<PokemonDetail> {
  const data = await apiGet<any>(`/pokemon/${id}`);

  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites?.other?.['official-artwork']?.front_default ??
      data.sprites?.front_default ??
      null,
    types: data.types.map((item: any) => item.type.name),
    abilities: data.abilities.map((item: any) => item.ability.name),
    stats: data.stats.map((item: any) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
  };
}