import type {
  PokemonDetail,
  PokemonListItem,
  PokemonListResponse,
} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

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

  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon) => {
      const detail = await fetch(pokemon.url).then((res) => res.json());

      const types = detail.types.map((item: any) => item.type.name);
      const image = detail.sprites?.other?.['official-artwork']?.front_default ?? detail.sprites?.front_default ?? null;

      return {
        id: detail.id,
        name: detail.name,
        url: pokemon.url,
        image,
        types,
        primaryType: types[0] ?? 'normal',
      };
    })
  );

  return pokemonDetails;
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
