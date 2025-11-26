import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { StorageService } from '../services/storage';
import { PokemonAPI } from '../services/api';
import { PokemonCard } from '../components/PokemonCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { Pokemon } from '../types/pokemon';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

export const FavoritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const favoriteIds = await StorageService.getFavorites();
      const favoritePokemon = await Promise.all(
        favoriteIds.map(id => PokemonAPI.getPokemonDetail(id))
      );
      setFavorites(favoritePokemon);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

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
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 8,
  },
});
