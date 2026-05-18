import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../theme/colors';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/routes';
import { Routes } from '../navigation/routes';
import { useEffect, useState } from 'react';
import { PokemonListItem } from '../types/pokemon';
import { getPokemonList } from '../api/pokemonApi';
import PokemonCard from '../components/PokemonCard';
import SideMenu from '../components/SideMenu';

type AboutScreenProps = NativeStackScreenProps<RootStackParamList, 'About'> & {
    theme: AppColors;
};

function AboutScreen({ theme , navigation }: AboutScreenProps) {
    const safeAreaInsets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: safeAreaInsets.top + 12, paddingBottom: safeAreaInsets.bottom }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Acerca del proyecto</Text>
                <SideMenu
                    theme={theme}
                    buttonStyle={styles.menuButton}
                />
            </View>
            <Text style={{ color: theme.text }}>Esta es la pantalla de Acerca del proyecto.</Text>
        </View>
    );
}

export default AboutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    menuButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    }
});