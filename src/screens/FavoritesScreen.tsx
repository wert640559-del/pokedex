import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { StorageService } from '../services/storage';
import { PokemonAPI } from '../services/api';
import { PokemonCard } from '../components/PokemonCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { Pokemon } from '../types/pokemon';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useResponsive } from '../hooks/useResponsive';
import { NetworkStatus } from '../components/NetworkStatus';
import { ErrorMessage } from '../components/ErrorMessage';

export const FavoritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused();
  const { moderateScale } = useResponsive();

  const loadFavorites = async () => {
    try {
      setError(null);
      const favoriteIds = await StorageService.getFavorites();
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const favoritePokemon = await Promise.all(
        favoriteIds.map(id => PokemonAPI.getPokemonDetail(id))
      );
      
      setFavorites(favoritePokemon);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handlePokemonPress = (pokemon: Pokemon) => {
    navigation.navigate('PokemonDetail', { pokemon });
  };

  const styles = createStyles(moderateScale);

  if (loading) {
    return <LoadingIndicator text="Loading favorites..." />;
  }

  if (error && favorites.length === 0) {
    return (
      <View style={styles.container}>
        <NetworkStatus />
        <ErrorMessage message={error} onRetry={loadFavorites} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NetworkStatus />
      
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={handlePokemonPress}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FontAwesome6 name="heart" size={moderateScale(64)} color="#ccc" />
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the heart icon on Pokémon to add them here
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = (moderateScale: (size: number, factor?: number) => number) => 
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(8),
    paddingBottom: moderateScale(20),
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: moderateScale(32),
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: moderateScale(18),
    color: '#666',
    marginTop: moderateScale(16),
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: '#999',
    marginTop: moderateScale(8),
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
});

export default FavoritesScreen;