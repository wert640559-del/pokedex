import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PokemonListScreen } from '../screens/PokemonListScreen';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PokemonList">
        <Stack.Screen 
          name="PokemonList" 
          component={PokemonListScreen}
          options={{ 
            title: 'Pokédex',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="PokemonDetail" 
          component={PokemonDetailScreen}
          options={{ 
            title: 'Pokémon Details',
            headerShown: false 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};