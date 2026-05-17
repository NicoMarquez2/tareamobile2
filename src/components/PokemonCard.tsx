import { AppColors } from '../theme/colors';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
        <Text style={[{ color: theme.text }]}>
          {types.join(' / ')}
        </Text>
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
});

export default PokemonCard;
