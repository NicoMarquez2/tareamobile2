import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/routes';
import { Routes } from '../navigation/routes';
import { useEffect, useState } from 'react';
import { PokemonListItem } from '../types/pokemon';
import { getPokemonList } from '../api/pokemonApi';
import PokemonCard from '../components/PokemonCard';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'> & {
    theme: AppColors;
};

function HomeScreen({ theme , navigation }: HomeScreenProps) {
    const safeAreaInsets = useSafeAreaInsets();

    const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
    getPokemonList(50, 0)
        .then(setPokemons)
        .catch(() => setError('No se pudieron cargar los Pokémon'))
        .finally(() => setLoading(false));
    }, []);
    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}>
            <Text style={[styles.title, { color: theme.text }]}>Home Screen</Text>
            {error && <Text >{error}</Text>}
            {loading && <Text>Cargando Pokémon...</Text>}
            <FlatList
                showsVerticalScrollIndicator={false}
                data={pokemons}
                numColumns={2}
                keyExtractor={pokemon => pokemon.id.toString()}
                contentContainerStyle={{ paddingBottom: safeAreaInsets.bottom }}
                columnWrapperStyle={{ justifyContent: 'space-between', gap: 12 }}
                renderItem={({ item }) => (
                    <View style={{ flex: 1 }}>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default HomeScreen;
