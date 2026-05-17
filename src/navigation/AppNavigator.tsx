import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import { Routes, type RootStackParamList } from './routes';
import type { AppColors } from '../theme/colors';

type AppNavigatorProps = {
  theme: AppColors;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator({ theme }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Routes.Home}>
        <Stack.Screen name={Routes.Home}>
          {props => <HomeScreen {...props} theme={theme} />}
        </Stack.Screen>

        <Stack.Screen name={Routes.PokemonDetail}>
          {props => <PokemonDetailScreen {...props} theme={theme} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;