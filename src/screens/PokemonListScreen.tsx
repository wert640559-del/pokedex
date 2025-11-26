import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  RefreshControl,
  TextInput, 
  Text
} from 'react-native';
import { usePokemon } from '../hooks/usePokemon';
import { useNetwork } from '../hooks/useNetwork';
import { PokemonCard } from '../components/PokemonCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorMessage } from '../components/ErrorMessage';
import { NetworkStatus } from '../components/NetworkStatus';
import { StorageService } from '../services/storage';
import { Pokemon } from '../types/pokemon';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

interface PokemonListScreenProps {
  navigation: any;
}

export const PokemonListScreen: React.FC<PokemonListScreenProps> = ({ navigation }) => {
  const { pokemonList, loading, error, hasMore, loadMore, refresh } = usePokemon();
  const { isConnected } = useNetwork();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await StorageService.getFavorites();
    setFavorites(favs);
  };

  const toggleFavorite = async (pokemonId: number) => {
    if (favorites.includes(pokemonId)) {
      await StorageService.removeFavorite(pokemonId);
    } else {
      await StorageService.addFavorite(pokemonId);
    }
    loadFavorites();
  };

  const filteredPokemon = pokemonList.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isFavorite = favorites.includes(pokemon.id);
    
    if (showFavorites) {
      return matchesSearch && isFavorite;
    }
    return matchesSearch;
  });

  const handlePokemonPress = (pokemon: Pokemon) => {
    navigation.navigate('PokemonDetail', { pokemon });
  };

  const renderPokemonItem = ({ item }: { item: Pokemon }) => (
    <PokemonCard
      pokemon={item}
      onPress={handlePokemonPress}
      isFavorite={favorites.includes(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  );

  const loadMorePokemon = () => {
    if (!loading && hasMore && isConnected && !showFavorites) {
      loadMore();
    }
  };

  if (error && pokemonList.length === 0) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <View style={styles.container}>
      <NetworkStatus />
      
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <FontAwesome6 name="search" size={16} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, showFavorites && styles.filterButtonActive]}
          onPress={() => setShowFavorites(!showFavorites)}
        >
          <FontAwesome6 
            name="heart" 
            size={20} 
            color={showFavorites ? "#FF6B6B" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPokemon}
        renderItem={renderPokemonItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        onEndReached={loadMorePokemon}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          showFavorites ? (
            <View style={styles.emptyState}>
              <FontAwesome6 name="heart" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No favorite Pokémon yet</Text>
            </View>
          ) : loading ? (
            <LoadingIndicator />
          ) : (
            <ErrorMessage message="No Pokémon found" />
          )
        }
        ListFooterComponent={
          loading && pokemonList.length > 0 ? <LoadingIndicator size="small" text="Loading more..." /> : null
        }
      />
    </View>
  );
};

const TouchableOpacity = ({ style, onPress, children }: any) => (
  <View style={style} onStartShouldSetResponder={() => true} onResponderRelease={onPress}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#ffe6e6',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});