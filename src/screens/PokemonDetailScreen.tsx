import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import {
    Alert,
    Image,
    NativeModules,
    PermissionsAndroid,
    Platform,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/routes';
import { useEffect, useState } from 'react';
import { getPokemonById } from '../api/pokemonApi';
import { PokemonDetail } from '../types/pokemon';
import { getPokemonTypeColor } from '../utils/pokemonTypesColors';
import SideMenu from '../components/SideMenu';
import { addFavourite, isFavourite, removeFavourite } from '../database/favouritesRepository';

const MAX_STAT_VALUE = 150;

type PokemonImageModule = {
    downloadPokemonImage: (pokemonName: string, imageUrl: string) => void;
};

type PokemonDetailProps = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'> & {
    theme: AppColors;
};

function PokemonDetailScreen({ theme, route, navigation }: PokemonDetailProps) {
    const safeAreaInsets = useSafeAreaInsets();
    const { pokemonId, pokemonName, image, types } = route.params;

    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
    const [error, setError] = useState<string>("");
    const [favourite, setFavourite] = useState(false);

    useEffect(() => {
    getPokemonById(pokemonId)
        .then(setPokemon)
        .catch(() => setError('No se pudo cargar el detalle'));
    }, [pokemonId]);

    useEffect(() => {
        isFavourite(pokemonId).then(setFavourite);
    }, [pokemonId]);

    const visibleName = pokemon?.name ?? pokemonName ?? `Pokemon #${pokemonId}`;
    const visibleImage = pokemon?.image ?? image;
    const visibleTypes = pokemon?.types ?? types ?? ['normal'];
    const primaryType = visibleTypes[0] ?? 'normal';
    const color = getPokemonTypeColor(primaryType);
    const visibleAbilities = pokemon?.abilities ?? [];
    const backIcon = require('../assets/atras.png');
    const pokemonLink = `https://nicomarquez2.github.io/tareamobile2/?pokemon=${pokemonId}`;

    async function handleFavouritePress() {
        if(favourite) {
            await removeFavourite(pokemonId);
            setFavourite(false);
            return;
        } else {
            await addFavourite(pokemonId);
            setFavourite(true);
        }
    }

    async function handleSharePokemon() {
        await Share.share({
            title: `Pokemon ${visibleName}`,
            message:
            `Mira este pokemon\n\n` +
            `${visibleName} #${pokemonId}\n` +
            `${pokemonLink}`,
        });
    }

    async function requestNotificationPermission() {
        if (Platform.OS !== 'android' || Number(Platform.Version) < 33) {
            return true;
        }

        const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        return result === PermissionsAndroid.RESULTS.GRANTED;
    }

    async function handleDownloadImage() {
        if (!visibleImage) {
            Alert.alert('Imagen no disponible', 'Este Pokemon no tiene imagen para descargar.');
            return;
        }

        const pokemonImageModule = NativeModules.PokemonImageModule as PokemonImageModule | undefined;

        if (!pokemonImageModule) {
            Alert.alert(
                'Modulo no disponible',
                'Recompila la app para activar el modulo nativo de descarga.',
            );
            return;
        }

        const canShowNotifications = await requestNotificationPermission();
        pokemonImageModule.downloadPokemonImage(visibleName, visibleImage);

        Alert.alert(
            'Descarga iniciada',
            canShowNotifications
                ? 'La imagen del Pokemon se guardara en la galeria.'
                : 'La imagen se guardara en la galeria, pero Android no mostrara notificacion.',
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: color, paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}>
            <TouchableOpacity style={[styles.backButton, {top: safeAreaInsets.top + 8}]} onPress={() => navigation.goBack()}>
                <Image source={backIcon} style={styles.backIcon} />
            </TouchableOpacity>
            <SideMenu
                theme={theme}
                buttonStyle={[styles.menuButton, { top: safeAreaInsets.top + 8 }]}
                iconColor="#ffffff"
            />
            <Text style={styles.title}>{visibleName}</Text>
            <Text style={styles.id}>{pokemonId}</Text>
            {visibleImage && <Image source={{ uri: visibleImage }} style={styles.image} />}
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

            <Pressable style={styles.favouriteButton} onPress={handleFavouritePress}>
                <Text style={styles.favouriteButtonText}>
                    {favourite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                </Text>
            </Pressable>

            <Pressable style={styles.shareButton} onPress={handleSharePokemon}>
                <Text style={styles.shareButtonText}>Compartir</Text>
            </Pressable>

            <Pressable style={styles.downloadButton} onPress={handleDownloadImage}>
                <Text style={styles.downloadButtonText}>Descargar imagen</Text>
            </Pressable>
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
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: '#00000030',
        zIndex: 1,
    },
    backIcon: {
        top: 8,
        width: 24,
        height: 24,
        tintColor: '#ffffff',
        resizeMode: 'contain',
    },
    menuButton: {
        position: 'absolute',
        right: 16,
        zIndex: 2,
        backgroundColor: '#00000030',
        borderRadius: 20,
    },
    favouriteButton: {
        marginTop: 36,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: '#00000030',
    },
    favouriteButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    shareButton: {
        marginTop: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: '#00000030',
    },
    shareButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    downloadButton: {
        marginTop: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: '#00000030',
    },
    downloadButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default PokemonDetailScreen;
