import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Pokemon } from '../types/pokemon';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: (pokemon: Pokemon) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (pokemonId: number) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  onPress, 
  isFavorite = false, 
  onToggleFavorite 
}) => {
  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default 
    || pokemon.sprites?.front_default 
    || 'https://via.placeholder.com/100x100/ccc/fff?text=Pokemon';

  const handleFavoritePress = () => {
    onToggleFavorite?.(pokemon.id);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(pokemon)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {onToggleFavorite && (
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
            <FontAwesome6 
              name={isFavorite ? "heart" : "heart-circle-plus"} 
              size={20} 
              color={isFavorite ? "#FF6B6B" : "#666"} 
              iconStyle='solid'
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        
        <View style={styles.types}>
          {pokemon.types?.map((typeInfo, index) => (
            <View key={index} style={[styles.type, { backgroundColor: getTypeColor(typeInfo.type.name) }]}>
              <Text style={styles.typeText}>
                {typeInfo.type.name.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return colors[type] || '#68A090';
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
  },
  favoriteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  id: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  type: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
});