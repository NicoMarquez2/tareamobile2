export const Routes = {
  Home: 'Home',
  PokemonDetail: 'PokemonDetail',
  Favourites: 'Favourites',
  About: 'About',
} as const;

export type RootStackParamList = {
  Home: undefined;
  PokemonDetail: {
    pokemonId: number;
    pokemonName?: string;
    image?: string | null;
    types?: string[];
  };
  Favourites: undefined;
  About: undefined;
};
