import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import { StyleSheet, Text, View, Button, Touchable, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/routes';
import { Routes } from '../navigation/routes';
import { useEffect, useState } from 'react';
import { PokemonListItem } from '../types/pokemon';
import { getPokemonList } from '../api/pokemonApi';

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
            {pokemons.map(pokemon => (
                <TouchableOpacity key={pokemon.id} onPress={() => navigation.navigate(Routes.PokemonDetail, { pokemonId: pokemon.id })}>
                    <Text style={{ color: theme.text }}>{pokemon.name}</Text>
                </TouchableOpacity>
            ))}
            <Button 
                title= "Go to Pokemon Detail"    
                onPress={() => navigation.navigate(Routes.PokemonDetail, { pokemonId: 1 })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default HomeScreen;