/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { darkColors, lightColors, type AppColors } from './src/theme/colors';
import HomeScreen from './src/screens/HomeScreen';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = isDarkMode ? darkColors : lightColors;

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <AppNavigator theme={theme} />
    </SafeAreaProvider>
  );
}

type AppContentProps = {
  theme: AppColors;
};

function AppContent({ theme }: AppContentProps) {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: safeAreaInsets.top },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Pokedex</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default App;
