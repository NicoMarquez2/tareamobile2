export const Routes = {
  Home: 'Home',
  PokemonDetail: 'PokemonDetail',
  Favorites: 'Favorites',
  About: 'About',
} as const;

export type RootStackParamList = {
  Home: undefined;
  PokemonDetail: {
    pokemonId: number;
    pokemonName: string;
    image: string | null;
    types: string[];
  };
  Favorites: undefined;
  About: undefined;
};