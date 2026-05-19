/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { darkColors, lightColors } from './src/theme/colors';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/database';
import { useEffect } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = isDarkMode ? darkColors : lightColors;

  useEffect(() => {
    initDatabase().catch(() => {
      console.warn('No se pudo inicializar la base de datos');
    });
  }, []);

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

export default App;
