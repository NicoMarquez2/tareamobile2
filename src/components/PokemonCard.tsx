import { AppColors } from '../theme/colors';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getPokemonTypeColor } from '../utils/pokemonTypesColors';

type PokemonCardProps = {
    theme: AppColors;
    pokemonId: number;
    pokemonName: string;
    image: string | null;
    types: string[];
    primaryType: string;
    onPress: () => void;
};

function PokemonCard({
  theme,
  pokemonId,
  pokemonName,
  image,
  types,
  primaryType,
  onPress,
}: PokemonCardProps) {
    const borderColor = getPokemonTypeColor(primaryType);

    return (
        <TouchableOpacity
            style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: borderColor },
            ]}
            onPress={onPress}
        >
            <Text style={[styles.id, { color: theme.text }]}>{pokemonId}</Text>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Text style={[styles.name, { color: theme.text }]}>{pokemonName}</Text>
            <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                {types.map((type) => (
                <Text key={type} style={[styles.types, { color: theme.text, backgroundColor: getPokemonTypeColor(type) + '80' }]}>
                    {type}
                </Text>
                ))}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 2,
        alignItems: 'center',
    },
    image: {
        width: 96,
        height: 96,
        resizeMode: 'contain',
    },
    id: {
        fontSize: 14,
        fontWeight: '600',
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    types: {
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
    }
});

export default PokemonCard;
