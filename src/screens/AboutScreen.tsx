import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/routes';
import SideMenu from '../components/SideMenu';

type AboutScreenProps = NativeStackScreenProps<RootStackParamList, 'About'> & {
    theme: AppColors;
};

function AboutScreen({ theme }: AboutScreenProps) {
    const safeAreaInsets = useSafeAreaInsets();
    return (
        <View style={[styles.primaryContainer, { backgroundColor: theme.pokedexPanel, paddingTop: safeAreaInsets.top + 12, paddingBottom: safeAreaInsets.bottom }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Acerca del proyecto</Text>
                <SideMenu
                    theme={theme}
                    buttonStyle={styles.menuButton}
                />
            </View>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={[styles.description, { color: theme.text }]}>
                    Pokedex Interactivo es una aplicacion movil desarrollada con React Native CLI y TypeScript para consultar informacion de Pokemon usando PokeAPI. Permite navegar el listado, ver detalles, guardar favoritos en SQLite nativo, compartir Pokemon con intents, detectar cambios de conexion y descargar imagenes a la galeria mediante componentes nativos de Android.
                </Text>
            </View>
        </View>
    );
}

export default AboutScreen;

const styles = StyleSheet.create({
    primaryContainer: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
    },
    container: {
        flex: 1,
        width: '95%',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    header: {
        width: '100%',
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        zIndex: 10,
    },
    title: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    menuButton: {
        position: 'absolute',
        right: 0,
    }
});
