import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import { Routes, type RootStackParamList } from './routes';
import type { AppColors } from '../theme/colors';
import AboutScreen from '../screens/AboutScreen';
import FavouritesScreen from '../screens/FavouritesScreen';

type AppNavigatorProps = {
  theme: AppColors;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['tareamobile2://'],
  config: {
    screens: {
      [Routes.Home]: '',
      [Routes.PokemonDetail]: {
        path: 'pokemon/:pokemonId',
        parse: {
          pokemonId: Number,
        },
      },
      [Routes.Favourites]: 'favourites',
      [Routes.About]: 'about',
    },
  },
};

function AppNavigator({ theme }: AppNavigatorProps) {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName={Routes.Home} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={Routes.Home}>
          {props => <HomeScreen {...props} theme={theme} />}
        </Stack.Screen>

        <Stack.Screen name={Routes.PokemonDetail}>
          {props => <PokemonDetailScreen {...props} theme={theme} />}
        </Stack.Screen>

        <Stack.Screen name={Routes.About}>
          {props => <AboutScreen {...props} theme={theme} />}
        </Stack.Screen>

        <Stack.Screen name={Routes.Favourites}>
          {props => <FavouritesScreen {...props} theme={theme} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
