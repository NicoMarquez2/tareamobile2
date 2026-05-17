import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/routes';
import { useEffect, useState } from 'react';
import { getPokemonById } from '../api/pokemonApi';
import { PokemonDetail } from '../types/pokemon';

type PokemonDetailProps = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'> & {
    theme: AppColors;
};

function PokemonDetailScreen({ theme, route}: PokemonDetailProps) {
    const safeAreaInsets = useSafeAreaInsets();
    const { pokemonId, pokemonName, image, types } = route.params;

    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
    getPokemonById(pokemonId)
        .then(setPokemon)
        .catch(() => setError('No se pudo cargar el detalle'));
    }, [pokemonId]);

    return (
        <SafeAreaProvider>
            <View style={[styles.container, { backgroundColor: theme.background, paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}>
                <Text style={[styles.title, { color: theme.text }]}>Pokemon Detail</Text>
                <Text style={[ { color: theme.text }]}>{pokemonId}</Text>
                <Text style={[ { color: theme.text }]}>{pokemonName}</Text>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Text style={[ { color: theme.text }]}>{types.join(' / ')}</Text>
                {error && <Text>{error}</Text>}
                {pokemon && (
                    <View>
                        <Text style={[ { color: theme.text }]}>{pokemon.name}</Text>
                    </View>
                )}
            </View>
        </SafeAreaProvider>
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
  image: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
});

export default PokemonDetailScreen;
