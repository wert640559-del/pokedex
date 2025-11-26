// UPDATE: ./components/PokemonNavbar.tsx
import React from 'react';
import { View, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface PokemonNavbarProps {
  showLogo?: boolean;
}

export const PokemonNavbar: React.FC<PokemonNavbarProps> = ({ showLogo = true }) => {
  const { moderateScale, isSmallDevice } = useResponsive();

  const styles = createStyles(moderateScale, isSmallDevice);

  if (!showLogo) return null;

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#DC0A2D" 
        translucent={false}
      />
      <View style={styles.navbar}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/pokedex.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (
  moderateScale: (size: number, factor?: number) => number,
  isSmallDevice: boolean
) => StyleSheet.create({
  container: {
    backgroundColor: '#DC0A2D',
  },
  navbar: {
    backgroundColor: '#DC0A2D',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(5),
    paddingTop: Platform.OS === 'ios' ? moderateScale(50) : moderateScale(12),
    borderBottomWidth: moderateScale(4),
    borderBottomColor: '#1D2C5E',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(8),
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: isSmallDevice ? moderateScale(120) : moderateScale(150),
    height: isSmallDevice ? moderateScale(40) : moderateScale(50),
  },
});