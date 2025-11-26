import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  RefreshControl,
  Text 
} from 'react-native';
import { PokemonCard } from '../components/PokemonCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorMessage } from '../components/ErrorMessage';
import { NetworkStatus } from '../components/NetworkStatus';
import { Pokemon } from '../types/pokemon';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { usePokemonByType } from '../hooks/usePokemonByType';
import { useResponsive } from '../hooks/useResponsive';

interface PokemonListByTypeScreenProps {
  route: any;
  navigation: any;
}

export const PokemonListByTypeScreen: React.FC<PokemonListByTypeScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const { type } = route.params;
  const { 
    pokemonList, 
    loading, 
    loadingMore, 
    error, 
    hasMore, 
    loadMore, 
    refresh 
  } = usePokemonByType(type);
  
  const { moderateScale, isSmallDevice } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePokemonPress = (pokemon: Pokemon) => {
    navigation.navigate('PokemonDetail', { pokemon });
  };

  const handleLoadMore = () => {
    if (!type && !loadingMore && hasMore) {
      loadMore();
    }
  };

  const styles = createStyles(moderateScale, isSmallDevice);

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
      
      <View style={styles.searchContainer}>
        <FontAwesome6 name="magnifying-glass" size={moderateScale(16)} color="#666" iconStyle='solid'/>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${type || 'all'} Pokémon...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredPokemon}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={handlePokemonPress}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing || loading} 
            onRefresh={handleRefresh} 
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          loading ? (
            <LoadingIndicator />
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome6 name="magnifying-glass" size={moderateScale(48)} color="#ccc" iconStyle='solid'/>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No Pokémon found' : `No ${type || ''} Pokémon available`}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search term' : 'Check back later for more Pokémon'}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          loadingMore ? (
            <LoadingIndicator size="small" text="Loading more Pokémon..." />
          ) : !type && hasMore && filteredPokemon.length > 0 ? (
            <Text style={styles.loadMoreText}>Scroll down to load more Pokémon</Text>
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
  moderateScale: (size: number, factor?: number) => number,
  isSmallDevice: boolean
) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: moderateScale(16),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: moderateScale(1) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: 2,
    height: moderateScale(44),
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    paddingVertical: moderateScale(10),
    fontSize: isSmallDevice ? moderateScale(14) : moderateScale(16),
    color: '#333',
  },
  columnWrapper: {
    justifyContent: 'center',
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
  loadMoreText: {
    textAlign: 'center',
    padding: moderateScale(16),
    color: '#666',
    fontSize: moderateScale(14),
  },
});

export default PokemonListByTypeScreen;