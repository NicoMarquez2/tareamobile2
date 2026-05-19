import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../navigation/routes';
import { useCallback, useState } from 'react';
import { getPokemonById } from '../api/pokemonApi';
import { PokemonListItem } from '../types/pokemon';
import SideMenu from '../components/SideMenu';
import { getFavouritesIds } from '../database/favouritesRepository';
import PokemonCard from '../components/PokemonCard';


function FavouritesScreen( { theme, navigation }: NativeStackScreenProps<RootStackParamList, 'Favourites'> & { theme: AppColors }) {
    const safeAreaInsets = useSafeAreaInsets();

    const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const loadFavourites = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const ids = await getFavouritesIds();

            const details = await Promise.all(
                ids.map(id => getPokemonById(id)),
            );

            const favouritePokemons = details.map(pokemon => ({
                id: pokemon.id,
                name: pokemon.name,
                url: '',
                image: pokemon.image,
                types: pokemon.types,
                primaryType: pokemon.types[0],
            }));

            setPokemons(favouritePokemons);

        } catch {
            setError('Failed to load favourites');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
      useCallback(() => {
        loadFavourites();
      }, [loadFavourites]),
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: safeAreaInsets.top + 12, paddingBottom: safeAreaInsets.bottom }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Favoritos</Text>
                <SideMenu
                    theme={theme}
                    buttonStyle={styles.menuButton}
                />
            </View>

            {error && <Text style={[styles.message, { color: theme.text }]}>{error}</Text>}
            {loading && <Text style={[styles.message, { color: theme.text }]}>Cargando favoritos...</Text>}
            {!loading && pokemons.length === 0 && !error && (
                <Text style={[styles.message, { color: theme.text }]}>
                    No tenes Pokemon favoritos todavia
                </Text>
            )}

            <FlatList
                showsVerticalScrollIndicator={false}
                data={pokemons}
                numColumns={2}
                keyExtractor={pokemon => pokemon.id.toString()}
                contentContainerStyle={{ paddingBottom: safeAreaInsets.bottom }}
                columnWrapperStyle={styles.listRow}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <PokemonCard
                            theme={theme}
                            pokemonId={item.id}
                            pokemonName={item.name}
                            image={item.image}
                            types={item.types}
                            primaryType={item.primaryType}
                            onPress={() =>
                                navigation.navigate(Routes.PokemonDetail, {
                                    pokemonId: item.id,
                                    pokemonName: item.name,
                                    image: item.image,
                                    types: item.types,
                                })
                            }
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    width: '100%',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuButton: {
    position: 'absolute',
    right: 0,
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,
  },
  listRow: {
    justifyContent: 'space-between',
    gap: 12,
  },
  listItem: {
    flex: 1,
  },
});

export default FavouritesScreen;
