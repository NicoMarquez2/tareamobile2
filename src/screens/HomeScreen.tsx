import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/routes';
import { Routes } from '../navigation/routes';
import { useEffect, useState } from 'react';
import { PokemonListItem } from '../types/pokemon';
import { getPokemonList } from '../api/pokemonApi';
import PokemonCard from '../components/PokemonCard';
import SideMenu from '../components/SideMenu';

const logo = require('../assets/logo.png');

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
        <View style={[styles.primaryContainer, { backgroundColor: theme.pokedexPanel, paddingTop: safeAreaInsets.top + 12, paddingBottom: safeAreaInsets.bottom }]}>
            <View style={styles.header}>
                <Image source={logo} style={styles.image} />
                <SideMenu
                        theme={theme}
                        buttonStyle={styles.menuButton}
                />
            </View>
            <View style={[styles.container, { backgroundColor: theme.background}]}>

                {error && <Text style={{ color: theme.text }}>{error}</Text>}
                {loading && <Text>Cargando Pokémon...</Text>}

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
            
        </View>
    );
}

const styles = StyleSheet.create({
    primaryContainer: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 60,
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 2,
        width: '95%',
        borderRadius: 16,
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
    listRow: {
        justifyContent: 'space-between',
        gap: 12,
    },
    listItem: {
        flex: 1,
    },
});

export default HomeScreen;
