import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';
import { Pokemon } from '../types/pokemon';
import { StorageService } from '../services/storage';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useResponsive } from '../hooks/useResponsive';

interface PokemonDetailScreenProps {
  route: any;
  navigation: any;
}

export const PokemonDetailScreen: React.FC<PokemonDetailScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const { pokemon } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const { scale, verticalScale, moderateScale, width, height, isSmallDevice, isTablet } = useResponsive();

  useEffect(() => {
    checkFavoriteStatus();
  }, [pokemon.id]);

  const checkFavoriteStatus = async () => {
    const favorite = await StorageService.isFavorite(pokemon.id);
    setIsFavorite(favorite);
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await StorageService.removeFavorite(pokemon.id);
    } else {
      await StorageService.addFavorite(pokemon.id);
    }
    setIsFavorite(!isFavorite);
  };

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default 
    || pokemon.sprites?.front_default 
    || 'https://via.placeholder.com/200x200/ccc/fff?text=Pokemon';

  const styles = createStyles(scale, verticalScale, moderateScale, width, height, isSmallDevice, isTablet);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={moderateScale(24)} color="#333" iconStyle='solid'/>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <FontAwesome6 
            name={isFavorite ? "heart" : "heart-circle-plus"} 
            size={moderateScale(28)} 
            color={isFavorite ? "#FF6B6B" : "#333"} 
            iconStyle='solid'
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imageSection}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.name}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.types}>
          {pokemon.types?.map((typeInfo, index) => (
            <View key={index} style={[styles.type, { backgroundColor: getTypeColor(typeInfo.type.name) }]}>
              <Text style={styles.typeText}>
                {typeInfo.type.name.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.stats}>
          <Text style={styles.sectionTitle}>Base Stats</Text>
          {pokemon.stats?.map((stat, index) => (
            <View key={index} style={styles.statRow}>
              <Text style={styles.statName} numberOfLines={1}>
                {stat.stat.name.replace('-', ' ').toUpperCase()}
              </Text>
              <View style={styles.statBarContainer}>
                <View 
                  style={[
                    styles.statBar, 
                    { width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.statValue}>{stat.base_stat}</Text>
            </View>
          ))}
        </View>

        <View style={styles.physical}>
          <View style={styles.physicalItem}>
            <Text style={styles.physicalLabel}>Height</Text>
            <Text style={styles.physicalValue}>{(pokemon.height / 10).toFixed(1)} m</Text>
          </View>
          <View style={styles.physicalItem}>
            <Text style={styles.physicalLabel}>Weight</Text>
            <Text style={styles.physicalValue}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
          </View>
        </View>

        {pokemon.abilities && (
          <View style={styles.abilities}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            <View style={styles.abilitiesList}>
              {pokemon.abilities.map((ability, index) => (
                <View key={index} style={styles.ability}>
                  <Text style={styles.abilityText} numberOfLines={1}>
                    {ability.ability.name.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const getTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
    grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
    ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', fairy: '#EE99AC',
  };
  return colors[type] || '#68A090';
};

const createStyles = (
  scale: (size: number) => number,
  verticalScale: (size: number) => number,
  moderateScale: (size: number, factor?: number) => number,
  width: number,
  height: number,
  isSmallDevice: boolean,
  isTablet: boolean
) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingTop: height * 0.06,
    paddingBottom: verticalScale(16),
  },
  backButton: {
    padding: moderateScale(8),
  },
  favoriteButton: {
    padding: moderateScale(8),
  },
  imageSection: {
    alignItems: 'center',
    padding: moderateScale(20),
  },
  image: {
    width: isTablet ? width * 0.4 : width * 0.5,
    height: isTablet ? width * 0.4 : width * 0.5,
    maxWidth: 300,
    maxHeight: 300,
  },
  name: {
    fontSize: isTablet ? moderateScale(36) : 
              isSmallDevice ? moderateScale(24) : moderateScale(32),
    fontWeight: 'bold',
    color: '#333',
    marginTop: verticalScale(16),
    textAlign: 'center',
  },
  id: {
    fontSize: isTablet ? moderateScale(22) : 
              isSmallDevice ? moderateScale(16) : moderateScale(18),
    color: '#666',
    marginTop: verticalScale(4),
  },
  detailsSection: {
    padding: moderateScale(20),
  },
  types: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: verticalScale(24),
  },
  type: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    margin: moderateScale(4),
    minWidth: isSmallDevice ? moderateScale(70) : moderateScale(80),
  },
  typeText: {
    fontSize: isSmallDevice ? moderateScale(10) : moderateScale(12),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: isTablet ? moderateScale(24) : 
              isSmallDevice ? moderateScale(18) : moderateScale(20),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(16),
  },
  stats: {
    marginBottom: verticalScale(24),
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  statName: {
    width: isTablet ? moderateScale(120) : 
           isSmallDevice ? moderateScale(80) : moderateScale(100),
    fontSize: isSmallDevice ? moderateScale(10) : moderateScale(12),
    color: '#666',
  },
  statBarContainer: {
    flex: 1,
    height: moderateScale(8),
    backgroundColor: '#f0f0f0',
    borderRadius: moderateScale(4),
    marginHorizontal: moderateScale(12),
  },
  statBar: {
    height: '100%',
    backgroundColor: '#4CD964',
    borderRadius: moderateScale(4),
  },
  statValue: {
    width: isTablet ? moderateScale(40) : moderateScale(30),
    fontSize: isSmallDevice ? moderateScale(12) : moderateScale(14),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  physical: {
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-around',
    marginBottom: verticalScale(24),
    padding: moderateScale(16),
    backgroundColor: '#f9f9f9',
    borderRadius: moderateScale(12),
  },
  physicalItem: {
    alignItems: 'center',
    marginBottom: isSmallDevice ? verticalScale(12) : 0,
  },
  physicalLabel: {
    fontSize: isSmallDevice ? moderateScale(12) : moderateScale(14),
    color: '#666',
    marginBottom: verticalScale(4),
  },
  physicalValue: {
    fontSize: isSmallDevice ? moderateScale(14) : moderateScale(16),
    fontWeight: 'bold',
    color: '#333',
  },
  abilities: {
    marginBottom: verticalScale(24),
  },
  abilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ability: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
    marginRight: moderateScale(8),
    marginBottom: moderateScale(8),
    minWidth: isSmallDevice ? moderateScale(80) : moderateScale(90),
  },
  abilityText: {
    fontSize: isSmallDevice ? moderateScale(10) : moderateScale(12),
    color: '#333',
    textAlign: 'center',
  },
});