import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  RefreshControl,
  TextInput, 
  Text,
  TouchableOpacity
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
import { useResponsive } from '../hooks/useResponsive';

interface PokemonListScreenProps {
  navigation: any;
}

export const PokemonListScreen: React.FC<PokemonListScreenProps> = ({ navigation }) => {
  const { pokemonList, loading, error, hasMore, loadMore, refresh } = usePokemon();
  const { isConnected } = useNetwork();
  const { scale, moderateScale, isSmallDevice, isTablet } = useResponsive();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
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

  const styles = createStyles(scale, moderateScale, isSmallDevice, isTablet);

  if (error && pokemonList.length === 0) {
    return (
      <View style={styles.container}>
        <NetworkStatus />
        <ErrorMessage message={error} onRetry={refresh} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NetworkStatus />
      
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <FontAwesome6 name="magnifying-glass" size={moderateScale(16)} color="#666" iconStyle='solid'/>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, showFavorites && styles.filterButtonActive]}
          onPress={() => setShowFavorites(!showFavorites)}
        >
          <FontAwesome6 
            name="heart" 
            size={moderateScale(20)} 
            color={showFavorites ? "#FF6B6B" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
  data={filteredPokemon}
  renderItem={renderPokemonItem}
  keyExtractor={(item) => item.id.toString()}
  refreshControl={
    <RefreshControl 
      refreshing={refreshing || loading} 
      onRefresh={handleRefresh} 
    />
  }
  onEndReached={loadMorePokemon}
  onEndReachedThreshold={0.3}
  numColumns={2}
  columnWrapperStyle={styles.columnWrapper}
  ListEmptyComponent={
    showFavorites ? (
      <View style={styles.emptyState}>
        <FontAwesome6 name="heart" size={moderateScale(48)} color="#ccc" />
        <Text style={styles.emptyStateText}>No favorite Pokémon yet</Text>
        <Text style={styles.emptySubtext}>
          Tap the heart icon on Pokémon to add them here
        </Text>
      </View>
    ) : loading ? (
      <LoadingIndicator />
    ) : (
      <View style={styles.emptyState}>
        <FontAwesome6 name="magnifying-glass" size={moderateScale(48)} color="#ccc" iconStyle='solid'/>
        <Text style={styles.emptyStateText}>No Pokémon found</Text>
        <Text style={styles.emptySubtext}>
          {searchQuery ? 'Try a different search term' : 'Check your internet connection'}
        </Text>
      </View>
    )
  }
  ListFooterComponent={
    loading && pokemonList.length > 0 && !showFavorites ? (
      <LoadingIndicator size="small" text="Loading more Pokémon..." />
    ) : null
  }
  contentContainerStyle={[
    styles.listContent,
    filteredPokemon.length === 0 && styles.emptyListContent
  ]}
  showsVerticalScrollIndicator={false}
/>
    </View>
  );
};

const createStyles = (
  scale: (size: number) => number,
  moderateScale: (size: number, factor?: number) => number,
  isSmallDevice: boolean,
  isTablet: boolean
) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: moderateScale(16),
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    marginRight: moderateScale(12),
    height: moderateScale(44),
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    paddingVertical: moderateScale(8),
    fontSize: isSmallDevice ? moderateScale(14) : moderateScale(16),
    color: '#333',
  },
  filterButton: {
    padding: moderateScale(12),
    backgroundColor: '#f0f0f0',
    borderRadius: moderateScale(8),
    height: moderateScale(44),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: moderateScale(44),
  },
  filterButtonActive: {
    backgroundColor: '#ffe6e6',
  },
  columnWrapper: {
    justifyContent: 'center',
    paddingHorizontal: moderateScale(8),
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
    padding: moderateScale(40),
    flex: 1,
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: moderateScale(16),
    fontSize: isSmallDevice ? moderateScale(16) : moderateScale(18),
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: moderateScale(8),
    fontSize: isSmallDevice ? moderateScale(12) : moderateScale(14),
    color: '#999',
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
});

export default PokemonListScreen;