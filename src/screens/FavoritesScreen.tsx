// FILE: ./screens/FavoritesScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import { useIsFocused } from '@react-navigation/native'; // IMPORT BARU
import { StorageService } from '../services/storage';
import { PokemonAPI } from '../services/api';
import { PokemonCard } from '../components/PokemonCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { Pokemon } from '../types/pokemon';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

export const FavoritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused(); // Hook untuk detect screen focus

  const loadFavorites = async () => {
    try {
      console.log('Loading favorites...');
      const favoriteIds = await StorageService.getFavorites();
      console.log('Favorite IDs:', favoriteIds);
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const favoritePokemon = await Promise.all(
        favoriteIds.map(id => PokemonAPI.getPokemonDetail(id))
      );
      
      console.log('Loaded favorites:', favoritePokemon.length);
      setFavorites(favoritePokemon);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data saat screen focus atau pertama kali mount
  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused]); // Dependency pada isFocused

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  if (loading) {
    return <LoadingIndicator text="Loading favorites..." />;
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome6 name="heart" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Tap the heart icon on Pokémon to add them here</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={(pokemon) => navigation.navigate('PokemonDetail', { pokemon })}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});