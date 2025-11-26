import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Pokemon } from '../types/pokemon';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useResponsive } from '../hooks/useResponsive';

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
  const { scale, verticalScale, moderateScale, isSmallDevice, isTablet } = useResponsive();

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default 
    || pokemon.sprites?.front_default 
    || 'https://via.placeholder.com/100x100/ccc/fff?text=Pokemon';

  const handleFavoritePress = () => {
    onToggleFavorite?.(pokemon.id);
  };

  const styles = createStyles(scale, verticalScale, moderateScale, isSmallDevice, isTablet);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(pokemon)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {onToggleFavorite && (
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
            <FontAwesome6 
              name={isFavorite ? "heart" : "heart-circle-plus"} 
              size={moderateScale(20)} 
              color={isFavorite ? "#FF6B6B" : "#666"} 
              iconStyle='solid'
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        
        <View style={styles.types}>
          {pokemon.types?.map((typeInfo, index) => (
            <View key={index} style={[styles.type, { backgroundColor: getTypeColor(typeInfo.type.name) }]}>
              <Text style={styles.typeText} numberOfLines={1}>
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

const createStyles = (
  scale: (size: number) => number,
  verticalScale: (size: number) => number,
  moderateScale: (size: number, factor?: number) => number,
  isSmallDevice: boolean,
  isTablet: boolean
) => StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    margin: isSmallDevice ? moderateScale(4) : moderateScale(8),
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: moderateScale(2) 
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: verticalScale(80),
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: isTablet ? moderateScale(100) : 
           isSmallDevice ? moderateScale(60) : moderateScale(80),
    height: isTablet ? moderateScale(100) : 
            isSmallDevice ? moderateScale(60) : moderateScale(80),
  },
  favoriteButton: {
    position: 'absolute',
    top: moderateScale(-5),
    right: moderateScale(-5),
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    padding: moderateScale(4),
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: moderateScale(1) 
    },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(2),
    elevation: 2,
  },
  info: {
    flex: 1,
    marginLeft: moderateScale(12),
  },
  name: {
    fontSize: isTablet ? moderateScale(20) : 
              isSmallDevice ? moderateScale(14) : moderateScale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  id: {
    fontSize: isSmallDevice ? moderateScale(12) : moderateScale(14),
    color: '#666',
    marginBottom: verticalScale(8),
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  type: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
    marginRight: moderateScale(6),
    marginBottom: moderateScale(4),
    minWidth: moderateScale(50),
  },
  typeText: {
    fontSize: isSmallDevice ? moderateScale(8) : moderateScale(10),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});