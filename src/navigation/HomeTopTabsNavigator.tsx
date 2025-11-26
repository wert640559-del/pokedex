import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeTopTabParamList } from './types';
import { PokemonListByTypeScreen } from '../screens/PokemonListByTypeScreen';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useResponsive } from '../hooks/useResponsive';
import { PokemonNavbar } from '../components/PokemonNavbar';
import { View, StyleSheet } from 'react-native';

const TopTab = createMaterialTopTabNavigator<HomeTopTabParamList>();

const pokemonTypes = [
  { name: 'All', icon: 'list', color: '#FFCB05' },
  { name: 'Fire', icon: 'fire', color: '#EE8130' },
  { name: 'Water', icon: 'droplet', color: '#6390F0' },
  { name: 'Grass', icon: 'leaf', color: '#7AC74C' },
  { name: 'Electric', icon: 'bolt', color: '#F7D02C' },
  { name: 'Ice', icon: 'snowflake', color: '#96D9D6' },
  { name: 'Fighting', icon: 'hand-fist', color: '#C22E28' },
  { name: 'Poison', icon: 'skull', color: '#A33EA1' },
  { name: 'Ground', icon: 'mountain', color: '#E2BF65' },
  { name: 'Flying', icon: 'dove', color: '#A98FF3' },
  { name: 'Psychic', icon: 'brain', color: '#F95587' },
  { name: 'Bug', icon: 'bug', color: '#A6B91A' },
  { name: 'Rock', icon: 'mountain', color: '#B6A136' },
  { name: 'Ghost', icon: 'ghost', color: '#735797' },
  { name: 'Dragon', icon: 'dragon', color: '#6F35FC' },
  { name: 'Dark', icon: 'moon', color: '#705746' },
  { name: 'Steel', icon: 'shield', color: '#B7B7CE' },
  { name: 'Fairy', icon: 'wand-magic-sparkles', color: '#D685AD' },
];

export const HomeTopTabsNavigator: React.FC = () => {
  const { scale, isSmallDevice, moderateScale } = useResponsive();

  const styles = createStyles(moderateScale);

  return (
    <View style={styles.container}>
      <PokemonNavbar />
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
            color: '#FFFFFF',
          },
          tabBarStyle: { 
            backgroundColor: '#1D2C5E',
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarIndicatorStyle: ({ route }) => ({
            backgroundColor: getTypeColor(route.name),
            height: scale(4),
            borderRadius: scale(2),
          }),
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
              tabBarIcon: ({ focused }) => {
                const typeColor = getTypeColor(type.name);
                return (
                  <FontAwesome6 
                    name={type.icon} 
                    size={isSmallDevice ? scale(14) : scale(16)} 
                    color={focused ? typeColor : '#CCCCCC'}
                    iconStyle='solid'
                  />
                );
              },
            }}
          />
        ))}
      </TopTab.Navigator>
    </View>
  );
};

// Helper function to get type color
const getTypeColor = (typeName: string): string => {
  const type = pokemonTypes.find(t => t.name === typeName);
  return type?.color || '#FFCB05';
};

const createStyles = (moderateScale: (size: number, factor?: number) => number) => 
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});