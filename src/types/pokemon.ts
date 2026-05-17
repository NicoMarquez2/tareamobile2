export type PokemonListItem = {
  id: number;
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export type PokemonDetail = {
  id: number;
  name: string;
  image: string | null;
  types: string[];
  abilities: string[];
  stats: {
    name: string;
    value: number;
  }[];
};