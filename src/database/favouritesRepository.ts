import { NativeModules } from 'react-native';

type FavouritesNativeModule = {
  addFavourite: (pokemonId: number) => Promise<boolean>;
  removeFavourite: (pokemonId: number) => Promise<boolean>;
  isFavourite: (pokemonId: number) => Promise<boolean>;
  getFavouriteIds: () => Promise<number[]>;
};

const favouritesModule = NativeModules.FavouritesModule as FavouritesNativeModule;

export type Favourite = {
  id: number;
  created_at: string;
};

export async function addFavourite(pokemonId: number) {
  await favouritesModule.addFavourite(pokemonId);
}

export async function removeFavourite(pokemonId: number) {
  await favouritesModule.removeFavourite(pokemonId);
}

export async function isFavourite(pokemonId: number): Promise<boolean> {
  return favouritesModule.isFavourite(pokemonId);
}

export async function getFavouritesIds(): Promise<number[]> {
  return favouritesModule.getFavouriteIds();
}