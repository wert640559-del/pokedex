import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { PokemonNavbar } from '../components/PokemonNavbar';
import { useResponsive } from '../hooks/useResponsive';

export const ProfileScreen: React.FC = () => {
  const { moderateScale } = useResponsive();
  
  const styles = createStyles(moderateScale);

  return (
    <View style={styles.container}>
      <PokemonNavbar />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <FontAwesome6 name="user" size={moderateScale(80)} color="#DC0A2D" />
          <Text style={styles.title}>Pokédex App</Text>
          <Text style={styles.subtitle}>React Native Challenge</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoItem}>
            <FontAwesome6 name="code" size={moderateScale(20)} color="#1D2C5E" iconStyle='solid'/>
            <Text style={styles.infoText}>Built with React Native & TypeScript</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome6 name="database" size={moderateScale(20)} color="#1D2C5E" iconStyle='solid'/>
            <Text style={styles.infoText}>Data from PokeAPI</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome6 name="heart" size={moderateScale(20)} color="#1D2C5E" iconStyle='solid'/>
            <Text style={styles.infoText}>Favorites with AsyncStorage</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome6 name="mobile" size={moderateScale(20)} color="#1D2C5E" iconStyle='solid'/>
            <Text style={styles.infoText}>Fully Responsive Design</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureItem}>
            <FontAwesome6 name="check" size={moderateScale(16)} color="#4CD964" iconStyle='solid'/>
            <Text style={styles.featureText}>Browse Pokémon by Type</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome6 name="check" size={moderateScale(16)} color="#4CD964" iconStyle='solid'/>
            <Text style={styles.featureText}>Search Pokémon</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome6 name="check" size={moderateScale(16)} color="#4CD964" iconStyle='solid'/>
            <Text style={styles.featureText}>Favorite Pokémon</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome6 name="check" size={moderateScale(16)} color="#4CD964" iconStyle='solid'/>
            <Text style={styles.featureText}>Detailed Pokémon Info</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ using React Native</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (moderateScale: (size: number, factor?: number) => number) => 
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: moderateScale(20),
  },
  header: {
    alignItems: 'center',
    padding: moderateScale(32),
    backgroundColor: '#FFFFFF',
    marginBottom: moderateScale(16),
    shadowColor: '#1D2C5E',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#1D2C5E',
    marginTop: moderateScale(16),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: '#666',
    marginTop: moderateScale(4),
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(16),
    marginHorizontal: moderateScale(16),
    marginBottom: moderateScale(16),
    borderRadius: moderateScale(12),
    shadowColor: '#1D2C5E',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginBottom: moderateScale(12),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoText: {
    marginLeft: moderateScale(12),
    fontSize: moderateScale(16),
    color: '#333',
    flex: 1,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(6),
  },
  featureText: {
    marginLeft: moderateScale(12),
    fontSize: moderateScale(14),
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    padding: moderateScale(20),
  },
  footerText: {
    fontSize: moderateScale(14),
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ProfileScreen;