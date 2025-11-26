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
import { PokemonNavbar } from '../components/PokemonNavbar';

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

  // Get primary type for background theme
  const primaryType = pokemon.types?.[0]?.type.name || 'normal';
  const primaryColor = getTypeColor(primaryType);
  const lightColor = getLightTypeColor(primaryType);

  const styles = createStyles(
    scale, verticalScale, moderateScale, width, height, isSmallDevice, isTablet, primaryColor, lightColor
  );

  return (
    <View style={styles.container}>
      <PokemonNavbar/>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Pokemon-themed background */}
        <View style={styles.headerBackground}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <FontAwesome6 name="arrow-left" size={moderateScale(24)} color="#FFFFFF" iconStyle='solid'/>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
              <FontAwesome6 
                name={isFavorite ? "heart" : "heart-circle-plus"} 
                size={moderateScale(28)} 
                color={isFavorite ? "#FFCB05" : "#FFFFFF"} 
                iconStyle='solid'
              />
            </TouchableOpacity>
          </View>

          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>
            <Text style={styles.name}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </Text>
            <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          {/* Types */}
          <View style={styles.typesSection}>
            <Text style={styles.sectionTitle}>Type</Text>
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

          {/* Physical Characteristics */}
          <View style={styles.physicalSection}>
            <Text style={styles.sectionTitle}>Physical Characteristics</Text>
            <View style={styles.physical}>
              <View style={styles.physicalItem}>
                <View style={styles.physicalIcon}>
                  <FontAwesome6 name="ruler-vertical" size={moderateScale(20)} color="#1D2C5E" iconStyle='solid'/>
                </View>
                <View style={styles.physicalInfo}>
                  <Text style={styles.physicalLabel}>Height</Text>
                  <Text style={styles.physicalValue}>{(pokemon.height / 10).toFixed(1)} m</Text>
                </View>
              </View>
              <View style={styles.physicalItem}>
                <View style={styles.physicalIcon}>
                  <FontAwesome6 name="weight-scale" size={moderateScale(20)} color="#1D2C5E" iconStyle='solid'/>
                </View>
                <View style={styles.physicalInfo}>
                  <Text style={styles.physicalLabel}>Weight</Text>
                  <Text style={styles.physicalValue}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Base Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Base Stats</Text>
            <View style={styles.stats}>
              {pokemon.stats?.map((stat, index) => (
                <View key={index} style={styles.statRow}>
                  <View style={styles.statInfo}>
                    <Text style={styles.statName} numberOfLines={1}>
                      {stat.stat.name.replace('-', ' ').toUpperCase()}
                    </Text>
                    <Text style={styles.statValue}>{stat.base_stat}</Text>
                  </View>
                  <View style={styles.statBarContainer}>
                    <View 
                      style={[
                        styles.statBar, 
                        { 
                          width: `${Math.min(100, (stat.base_stat / 255) * 100)}%`,
                          backgroundColor: getStatColor(stat.base_stat)
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Abilities */}
          {pokemon.abilities && (
            <View style={styles.abilitiesSection}>
              <Text style={styles.sectionTitle}>Abilities</Text>
              <View style={styles.abilitiesList}>
                {pokemon.abilities.map((ability, index) => (
                  <View key={index} style={styles.ability}>
                    <FontAwesome6 name="sparkles" size={moderateScale(14)} color="#1D2C5E" />
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

const getLightTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    normal: '#C6C6A7',
    fire: '#F5AC78',
    water: '#9DB7F5',
    electric: '#FAE078',
    grass: '#A7DB8D',
    ice: '#BCE6E6',
    fighting: '#D67873',
    poison: '#C183C1',
    ground: '#EBD69D',
    flying: '#C6B7F5',
    psychic: '#FA92B2',
    bug: '#C6D16E',
    rock: '#D1C17D',
    ghost: '#A292BC',
    dragon: '#A27DFA',
    dark: '#A29288',
    steel: '#D1D1E0',
    fairy: '#F4BDC9',
  };
  return colors[type] || '#8BB094';
};

const getStatColor = (value: number): string => {
  if (value >= 100) return '#4CD964'; // Green for high stats
  if (value >= 70) return '#FFCC00';   // Yellow for medium-high stats
  if (value >= 40) return '#FF9500';   // Orange for medium stats
  return '#FF3B30';                    // Red for low stats
};

const createStyles = (
  scale: (size: number) => number,
  verticalScale: (size: number) => number,
  moderateScale: (size: number, factor?: number) => number,
  width: number,
  height: number,
  isSmallDevice: boolean,
  isTablet: boolean,
  primaryColor: string,
  lightColor: string
) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    backgroundColor: primaryColor,
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
    paddingBottom: verticalScale(30),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(8),
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
  },
  backButton: {
    padding: moderateScale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(20),
  },
  favoriteButton: {
    padding: moderateScale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(20),
  },
  imageSection: {
    alignItems: 'center',
    padding: moderateScale(20),
  },
  imageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: moderateScale(100),
    padding: moderateScale(20),
    marginBottom: verticalScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(4),
    },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(6),
    elevation: 6,
  },
  image: {
    width: isTablet ? width * 0.3 : width * 0.4,
    height: isTablet ? width * 0.3 : width * 0.4,
    maxWidth: 250,
    maxHeight: 250,
  },
  name: {
    fontSize: isTablet ? moderateScale(32) : 
              isSmallDevice ? moderateScale(22) : moderateScale(28),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: verticalScale(8),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  id: {
    fontSize: isTablet ? moderateScale(20) : 
              isSmallDevice ? moderateScale(14) : moderateScale(18),
    color: '#FFFFFF',
    marginTop: verticalScale(4),
    fontWeight: '600',
    opacity: 0.9,
  },
  detailsSection: {
    padding: moderateScale(20),
    marginTop: verticalScale(-20),
  },
  typesSection: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(20),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 4,
  },
  sectionTitle: {
    fontSize: isTablet ? moderateScale(20) : 
              isSmallDevice ? moderateScale(16) : moderateScale(18),
    fontWeight: 'bold',
    color: '#1D2C5E',
    marginBottom: verticalScale(12),
  },
  types: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  type: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    margin: moderateScale(4),
    minWidth: isSmallDevice ? moderateScale(70) : moderateScale(80),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(3),
    elevation: 3,
  },
  typeText: {
    fontSize: isSmallDevice ? moderateScale(10) : moderateScale(12),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  physicalSection: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(20),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 4,
  },
  physical: {
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-around',
  },
  physicalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallDevice ? verticalScale(16) : 0,
    padding: moderateScale(12),
    backgroundColor: '#F8F8F8',
    borderRadius: moderateScale(12),
    minWidth: isSmallDevice ? '100%' : '45%',
  },
  physicalIcon: {
    backgroundColor: '#FFCB05',
    padding: moderateScale(8),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(12),
  },
  physicalInfo: {
    flex: 1,
  },
  physicalLabel: {
    fontSize: isSmallDevice ? moderateScale(12) : moderateScale(14),
    color: '#666',
    marginBottom: verticalScale(4),
    fontWeight: '500',
  },
  physicalValue: {
    fontSize: isSmallDevice ? moderateScale(14) : moderateScale(16),
    fontWeight: 'bold',
    color: '#1D2C5E',
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(20),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 4,
  },
  stats: {
    // Stats container
  },
  statRow: {
    marginBottom: verticalScale(12),
  },
  statInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  statName: {
    fontSize: isSmallDevice ? moderateScale(11) : moderateScale(13),
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  statValue: {
    fontSize: isSmallDevice ? moderateScale(12) : moderateScale(14),
    fontWeight: 'bold',
    color: '#1D2C5E',
    width: moderateScale(30),
    textAlign: 'right',
  },
  statBarContainer: {
    height: moderateScale(8),
    backgroundColor: '#F0F0F0',
    borderRadius: moderateScale(4),
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: moderateScale(4),
  },
  abilitiesSection: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(20),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 4,
  },
  abilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ability: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(20),
    margin: moderateScale(4),
    minWidth: isSmallDevice ? moderateScale(100) : moderateScale(120),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: 2,
  },
  abilityText: {
    fontSize: isSmallDevice ? moderateScale(10) : moderateScale(12),
    color: '#1D2C5E',
    fontWeight: '500',
    marginLeft: moderateScale(8),
  },
});

export default PokemonDetailScreen;