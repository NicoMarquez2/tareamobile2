import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/routes';
import { useEffect, useState } from 'react';
import { getPokemonById } from '../api/pokemonApi';
import { PokemonDetail } from '../types/pokemon';
import { getPokemonTypeColor } from '../utils/pokemonTypesColors';

const MAX_STAT_VALUE = 150;

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

    const primaryType = pokemon?.types[0] ?? types[0];
    const color = getPokemonTypeColor(primaryType);
    const visibleTypes = pokemon?.types ?? types;
    const visibleAbilities = pokemon?.abilities ?? [];

    return (
        <View style={[styles.container, { backgroundColor: color, paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}>
            <Text style={styles.title}>{pokemonName}</Text>
            <Text style={styles.id}>{pokemonId}</Text>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <View style={[styles.detailContainer, { backgroundColor: theme.card }]}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryColumn}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Tipos
                        </Text>
                        <View style={styles.chipsContainer}>
                            {visibleTypes.map((type) => (
                            <Text
                                key={type}
                                style={[
                                    styles.chip,
                                    {
                                        color: theme.text,
                                        backgroundColor: getPokemonTypeColor(type) + '80',
                                    },
                                ]}
                            >
                                {type}
                            </Text>
                            ))}
                        </View>
                    </View>

                    <View style={styles.summaryColumn}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Habilidades
                        </Text>
                        <View style={styles.abilitiesContainer}>
                            {visibleAbilities.map((ability) => (
                            <Text
                                key={ability}
                                style={[
                                    styles.ability,
                                    {
                                        color: theme.text,
                                    },
                                ]}
                            >
                                {ability}
                            </Text>
                            ))}
                        </View>
                    </View>
                </View>

                {error && <Text style={{ color: theme.text }}>{error}</Text>}
                {pokemon && (
                    <ScrollView
                        style={styles.statsScroll}
                        contentContainerStyle={styles.statsContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Estadisticas
                        </Text>
                        {pokemon.stats.map((stat) => {
                            const progress = Math.max(
                                0,
                                Math.min((stat.value / MAX_STAT_VALUE) * 100, 100),
                            );

                            return (
                                <View key={stat.name} style={styles.statRow}>
                                    <Text style={[styles.statName, { color: theme.text }]}>
                                        {stat.name}
                                    </Text>
                                    <View style={styles.statBarBackground}>
                                        <View
                                            style={[
                                                styles.statBarFill,
                                                {
                                                    backgroundColor: color,
                                                    width: `${progress}%`,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.statValue, { color: theme.text }]}>
                                        {stat.value}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    detailContainer: {
        gap: 12,
        minHeight: '48%',
        width: '95%',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textTransform: 'capitalize',
        textAlign: 'center',
        width: '100%',
        paddingHorizontal: 16,
    },
    id: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    image: {
        width: 160,
        height: 160,
        resizeMode: 'contain',
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
    },
    summaryColumn: {
        flex: 1,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6,
    },
    chip: {
        fontSize: 14,
        fontWeight: '500',
        textTransform: 'capitalize',
        paddingHorizontal: 10,
        paddingVertical: 0,
        height: 26,
        lineHeight: 26,
        includeFontPadding: false,
        textAlignVertical: 'center',
        borderRadius: 999,
        marginTop: 4,
        minWidth: 58,
        textAlign: 'center',
        overflow: 'hidden',
    },
    abilitiesContainer: {
        gap: 6,
        width: '100%',
    },
    ability: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'capitalize',
        textAlign: 'center',
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#ffffff18',
        overflow: 'hidden',
    },
    statsScroll: {
        flexGrow: 0,
    },
    statsContent: {
        gap: 10,
        paddingBottom: 8,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statName: {
        width: 112,
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    statBarBackground: {
        flex: 1,
        height: 10,
        borderRadius: 999,
        backgroundColor: '#ffffff33',
        overflow: 'hidden',
    },
    statBarFill: {
        height: '100%',
        borderRadius: 999,
    },
    statValue: {
        width: 32,
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'right',
    },
});

export default PokemonDetailScreen;
