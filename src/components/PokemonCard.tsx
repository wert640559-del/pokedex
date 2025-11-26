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

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={() => onPress(pokemon)}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          {onToggleFavorite && (
            <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
              <FontAwesome6 
                name={isFavorite ? "heart" : "heart-circle-plus"} 
                size={moderateScale(16)} 
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
    </View>
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
  width: number,
  isSmallDevice: boolean,
  isTablet: boolean
) => {
  // Hitung lebar card untuk 2 kolom dengan margin yang sama
  const screenPadding = moderateScale(16); // Total padding kiri-kanan
  const gap = moderateScale(8); // Jarak antara card
  const cardWidth = (width - screenPadding * 2 - gap) / 2;

  return StyleSheet.create({
    cardContainer: {
      width: cardWidth,
      marginBottom: moderateScale(16),
      marginHorizontal: moderateScale(8),
    },
    card: {
      backgroundColor: 'white',
      borderRadius: moderateScale(12),
      padding: moderateScale(12),
      shadowColor: '#000',
      shadowOffset: { 
        width: 0, 
        height: moderateScale(2) 
      },
      shadowOpacity: 0.1,
      shadowRadius: moderateScale(4),
      elevation: 3,
      alignItems: 'center',
      flex: 1,
    },
    imageContainer: {
      position: 'relative',
      alignItems: 'center',
    },
    image: {
      width: isTablet ? moderateScale(100) : 
             isSmallDevice ? moderateScale(80) : moderateScale(90),
      height: isTablet ? moderateScale(100) : 
              isSmallDevice ? moderateScale(80) : moderateScale(90),
    },
    favoriteButton: {
      position: 'absolute',
      top: moderateScale(-8),
      right: moderateScale(-8),
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
      alignItems: 'center',
      marginTop: verticalScale(8),
      width: '100%',
    },
    name: {
      fontSize: isTablet ? moderateScale(16) : 
                isSmallDevice ? moderateScale(12) : moderateScale(14),
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    id: {
      fontSize: isSmallDevice ? moderateScale(10) : moderateScale(12),
      color: '#666',
      marginBottom: verticalScale(8),
      textAlign: 'center',
    },
    types: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    type: {
      paddingHorizontal: moderateScale(6),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(8),
      margin: moderateScale(2),
      minWidth: moderateScale(40),
    },
    typeText: {
      fontSize: isSmallDevice ? moderateScale(7) : moderateScale(8),
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
  });
};