import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { RootStackParamList, MainTabParamList } from './types';
import { HomeTopTabsNavigator } from './HomeTopTabsNavigator';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTopTabsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="house" size={size} color={color} iconStyle='solid'/>
          ),
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="heart" size={size} color={color} iconStyle='solid'/>
          ),
          title: 'Favorites',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="user" size={size} color={color} />
          ),
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs}
          options={{ headerShown: false }}
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