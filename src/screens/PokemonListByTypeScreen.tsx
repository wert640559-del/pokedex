import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  RefreshControl 
} from 'react-native';
import { PokemonCard } from '../components/PokemonCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorMessage } from '../components/ErrorMessage';
import { NetworkStatus } from '../components/NetworkStatus';
import { Pokemon } from '../types/pokemon';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { usePokemonByType } from '../hooks/usePokemonByType';

interface PokemonListByTypeScreenProps {
  route: any;
  navigation: any;
}

export const PokemonListByTypeScreen: React.FC<PokemonListByTypeScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const { type } = route.params;
  const { pokemonList, loading, error, refresh } = usePokemonByType(type);
  const [searchQuery, setSearchQuery] = useState('');
  
  console.log(`Screen ${type}:`, { loading, error, count: pokemonList.length }); // Debug

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePokemonPress = (pokemon: Pokemon) => {
    navigation.navigate('PokemonDetail', { pokemon });
  };

  if (error && pokemonList.length === 0) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <View style={styles.container}>
      <NetworkStatus />
      
      <View style={styles.searchContainer}>
        <FontAwesome6 name="magnifying-glass" size={16} color="#666" iconStyle='solid'/>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${type || 'all'} Pokémon...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
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
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        ListEmptyComponent={
          loading ? (
            <LoadingIndicator />
          ) : (
            <ErrorMessage message={`No ${type || ''} Pokémon found`} />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 10,
    fontSize: 16,
  },
});