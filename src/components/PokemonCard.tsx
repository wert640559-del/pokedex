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
  const { scale, verticalScale, moderateScale, width, isSmallDevice, isTablet } = useResponsive();

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default 
    || pokemon.sprites?.front_default 
    || 'https://via.placeholder.com/100x100/ccc/fff?text=Pokemon';

  const handleFavoritePress = () => {
    onToggleFavorite?.(pokemon.id);
  };

  const styles = createStyles(scale, verticalScale, moderateScale, width, isSmallDevice, isTablet);

  // Get primary type for card accent
  const primaryType = pokemon.types?.[0]?.type.name || 'normal';
  const typeColor = getTypeColor(primaryType);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={() => onPress(pokemon)}>
        {/* Card Header with Gradient */}
        <View style={[styles.cardHeader, { backgroundColor: typeColor }]}>
          <Text style={styles.cardId}>#{pokemon.id.toString().padStart(3, '0')}</Text>
          {onToggleFavorite && (
            <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
              <FontAwesome6 
                name={isFavorite ? "heart" : "heart-circle-plus"} 
                size={moderateScale(14)} 
                color={isFavorite ? "#FFCB05" : "#FFFFFF"} 
                iconStyle='solid'
              />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Pokemon Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
        
        {/* Card Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>
          
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
    </View>
  );
};

const getTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  };
  return colors[type] || '#68A090';
};

const createStyles = (
  scale: (size: number) => number,
  verticalScale: (size: number) => number,
  moderateScale: (size: number, factor?: number) => number,
  width: number,
  isSmallDevice: boolean,
  isTablet: boolean
) => {
  const screenPadding = moderateScale(16);
  const gap = moderateScale(12);
  const cardWidth = (width - screenPadding * 2 - gap) / 2;

  return StyleSheet.create({
    cardContainer: {
      width: cardWidth,
      marginBottom: moderateScale(16),
      marginHorizontal: moderateScale(4),
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: moderateScale(16),
      shadowColor: '#1D2C5E',
      shadowOffset: { 
        width: 0, 
        height: moderateScale(4) 
      },
      shadowOpacity: 0.15,
      shadowRadius: moderateScale(8),
      elevation: 6,
      alignItems: 'center',
      flex: 1,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#F8F8F8',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(6),
      backgroundColor: '#DC0A2D',
    },
    cardId: {
      fontSize: isSmallDevice ? moderateScale(10) : moderateScale(12),
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    favoriteButton: {
      padding: moderateScale(2),
    },
    imageContainer: {
      padding: moderateScale(12),
      alignItems: 'center',
    },
    image: {
      width: isTablet ? moderateScale(100) : 
             isSmallDevice ? moderateScale(80) : moderateScale(90),
      height: isTablet ? moderateScale(100) : 
              isSmallDevice ? moderateScale(80) : moderateScale(90),
    },
    info: {
      alignItems: 'center',
      padding: moderateScale(12),
      paddingTop: 0,
      width: '100%',
    },
    name: {
      fontSize: isTablet ? moderateScale(16) : 
                isSmallDevice ? moderateScale(12) : moderateScale(14),
      fontWeight: 'bold',
      color: '#333333',
      textAlign: 'center',
      marginBottom: verticalScale(8),
    },
    types: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    type: {
      paddingHorizontal: moderateScale(8),
      paddingVertical: moderateScale(4),
      borderRadius: moderateScale(20),
      margin: moderateScale(2),
      minWidth: moderateScale(50),
    },
    typeText: {
      fontSize: isSmallDevice ? moderateScale(8) : moderateScale(9),
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });
};