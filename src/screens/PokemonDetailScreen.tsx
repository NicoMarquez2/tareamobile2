import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/routes';

type PokemonDetailProps = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'> & {
    theme: AppColors;
};

function PokemonDetailScreen({ theme, route}: PokemonDetailProps) {
    const safeAreaInsets = useSafeAreaInsets();
    const { pokemonId } = route.params;

    return (
        <SafeAreaProvider>
            <View style={[styles.container, { backgroundColor: theme.background, paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}>
                <Text style={[styles.title, { color: theme.text }]}>Pokemon Detail</Text>
                <Text style={[ { color: theme.text }]}>{pokemonId}</Text>
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
});

export default PokemonDetailScreen;