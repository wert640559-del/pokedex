import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeTopTabParamList } from './types';
import { PokemonListByTypeScreen } from '../screens/PokemonListByTypeScreen';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useResponsive } from '../hooks/useResponsive';

const TopTab = createMaterialTopTabNavigator<HomeTopTabParamList>();

const pokemonTypes = [
  { name: 'All', icon: 'list' as const },
  { name: 'Fire', icon: 'fire' as const },
  { name: 'Water', icon: 'droplet' as const },
  { name: 'Grass', icon: 'leaf' as const },
  { name: 'Electric', icon: 'bolt' as const },
  { name: 'Ice', icon: 'snowflake' as const },
  { name: 'Fighting', icon: 'hand-fist' as const },
  { name: 'Poison', icon: 'skull' as const },
  { name: 'Ground', icon: 'mountain' as const },
  { name: 'Flying', icon: 'dove' as const },
  { name: 'Psychic', icon: 'brain' as const },
  { name: 'Bug', icon: 'bug' as const },
  { name: 'Rock', icon: 'mountain' as const },
  { name: 'Ghost', icon: 'ghost' as const },
  { name: 'Dragon', icon: 'dragon' as const },
  { name: 'Dark', icon: 'moon' as const },
  { name: 'Steel', icon: 'shield' as const },
  { name: 'Fairy', icon: 'wand-magic-sparkles' as const },
];

export const HomeTopTabsNavigator: React.FC = () => {
  const { scale, isSmallDevice } = useResponsive();

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarItemStyle: { 
          width: isSmallDevice ? scale(80) : scale(100),
          paddingHorizontal: scale(4),
        },
        tabBarLabelStyle: { 
          fontSize: isSmallDevice ? scale(10) : scale(12), 
          fontWeight: 'bold',
          margin: 0,
          textTransform: 'capitalize',
        },
        tabBarStyle: { 
          backgroundColor: 'white',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIndicatorStyle: { 
          backgroundColor: '#FF6B6B',
          height: scale(3),
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      {pokemonTypes.map((type) => (
        <TopTab.Screen
          key={type.name}
          name={type.name as keyof HomeTopTabParamList}
          component={PokemonListByTypeScreen}
          initialParams={{ type: type.name === 'All' ? null : type.name.toLowerCase() }}
          options={{
            title: type.name,
            tabBarIcon: ({ color }) => (
              <FontAwesome6 
                name={type.icon} 
                size={isSmallDevice ? scale(14) : scale(16)} 
                color={color} 
                iconStyle='solid'
              />
            ),
          }}
        />
      ))}
    </TopTab.Navigator>
  );
};