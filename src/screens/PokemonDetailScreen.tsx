import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity // ← Gunakan ini dari React Native
} from 'react-native';
import { Pokemon } from '../types/pokemon';
import { StorageService } from '../services/storage';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <FontAwesome6 
            name={isFavorite ? "heart" : "heart-circle-plus"} 
            size={28} 
            color={isFavorite ? "#FF6B6B" : "#333"} 
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
              <Text style={styles.statName}>
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
                  <Text style={styles.abilityText}>
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

// ⚠️ HAPUS BAGIAN INI - karena sudah ada import dari React Native
// const TouchableOpacity = ({ style, onPress, children }: any) => (
//   <View style={style} onStartShouldSetResponder={() => true} onResponderRelease={onPress}>
//     {children}
//   </View>
// );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  imageSection: {
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  id: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  detailsSection: {
    padding: 20,
  },
  types: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  type: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  stats: {
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statName: {
    width: 100,
    fontSize: 12,
    color: '#666',
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  statBar: {
    height: '100%',
    backgroundColor: '#4CD964',
    borderRadius: 4,
  },
  statValue: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  physical: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  physicalItem: {
    alignItems: 'center',
  },
  physicalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  physicalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  abilities: {
    marginBottom: 24,
  },
  abilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ability: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  abilityText: {
    fontSize: 12,
    color: '#333',
  },
});