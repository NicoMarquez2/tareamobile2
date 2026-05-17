export const Routes = {
  Home: 'Home',
  PokemonDetail: 'PokemonDetail',
  Favorites: 'Favorites',
} as const;

export type RootStackParamList = {
  Home: undefined;
  PokemonDetail: {
    pokemonId: number;
  };
  Favorites: undefined;
};