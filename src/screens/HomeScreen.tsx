import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/routes';
import { Routes } from '../navigation/routes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PokemonListItem } from '../types/pokemon';
import { getPokemonList } from '../api/pokemonApi';
import PokemonCard from '../components/PokemonCard';
import SideMenu from '../components/SideMenu';
import PokeballLoader from '../components/PokeballLoader';

const logo = require('../assets/logo.png');
const pokeball = require('../assets/pokeball.png');
const PAGE_SIZE = 50;

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'> & {
    theme: AppColors;
};

function HomeScreen({ theme , navigation }: HomeScreenProps) {
    const safeAreaInsets = useSafeAreaInsets();

    const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const isFetchingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const loadPokemons = useCallback(async (nextOffset: number) => {
    if (isFetchingRef.current || !hasMoreRef.current) {
        return;
    }

    isFetchingRef.current = true;

    try {
        if (nextOffset === 0) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        const newPokemons = await getPokemonList(PAGE_SIZE, nextOffset);

        if (newPokemons.length === 0) {
            hasMoreRef.current = false;
            setHasMore(false);
            return;
        }

        setPokemons(previousPokemons => {
            const existingIds = new Set(previousPokemons.map(pokemon => pokemon.id));
            const uniqueNewPokemons = newPokemons.filter(
                pokemon => !existingIds.has(pokemon.id),
            );

            return [
                ...previousPokemons,
                ...uniqueNewPokemons,
            ];
        });

        setOffset(nextOffset + PAGE_SIZE);
    } catch {
        setError('No se pudieron cargar los Pokemon');
    } finally {
        setLoading(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
    }
}, []);

    useEffect(() => {
        loadPokemons(0);
    }, [loadPokemons]);

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
                {loading &&(
                    <View style={styles.loadingContainer}>
                        <PokeballLoader source={pokeball} size={48} />
                        <Text style={[styles.loadingText, { color: theme.text }]}>
                            Cargando Pokemon...
                        </Text>
                    </View>
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
                    onEndReached={() => {
                        if (!loading && !loadingMore && hasMore) {
                            loadPokemons(offset);
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                    loadingMore ? (
                        <View style={styles.loadingMoreContainer}>
                        <PokeballLoader source={pokeball} size={32} />
                        <Text style={[styles.loadingText, { color: theme.text }]}>
                            Cargando mas Pokemon...
                        </Text>
                        </View>
                    ) : null
                    }
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
    loadingMoreText: {
        textAlign: 'center',
        paddingVertical: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
    },
    loadingMoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    loadingGif: {
        width: 72,
        height: 72,
        resizeMode: 'contain',
    },
    loadingGifSmall: {
        width: 44,
        height: 44,
        resizeMode: 'contain',
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default HomeScreen;
