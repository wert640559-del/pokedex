// FILE: ./screens/ProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { PokemonNavbar } from '../components/PokemonNavbar';
import { useResponsive } from '../hooks/useResponsive';
import { AuthService } from '../services/AuthService';
import { HybridStorageService } from '../services/HybridStorageService';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { moderateScale } = useResponsive();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async (): Promise<void> => {
    try {
      const [user, preferences] = await Promise.all([
        AuthService.getCurrentUser(),
        HybridStorageService.getUserPreferences(),
      ]);
      
      setUserInfo(user);
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = (): void => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: performLogout
        },
      ]
    );
  };

  const performLogout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      // Navigation akan dihandle oleh AppNavigator melalui state change
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const styles = createStyles(moderateScale);

  return (
    <View style={styles.container}>
      <PokemonNavbar />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* User Info Section */}
        {userInfo && (
          <View style={styles.userSection}>
            <FontAwesome6 name="user" size={moderateScale(60)} color="#DC0A2D" />
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
          </View>
        )}
        
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
            <FontAwesome6 name="key" size={moderateScale(20)} color="#1D2C5E" iconStyle='solid'/>
            <Text style={styles.infoText}>Secure Keychain Storage</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome6 name="mobile" size={moderateScale(20)} color="#1D2C5E" iconStyle='solid'/>
            <Text style={styles.infoText}>Fully Responsive Design</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Features</Text>
          <View style={styles.featureItem}>
            <FontAwesome6 name="check" size={moderateScale(16)} color="#4CD964" iconStyle='solid'/>
            <Text style={styles.featureText}>Token stored in Secure Keychain</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome6 name="check" size={moderateScale(16)} color="#4CD964" iconStyle='solid'/>
            <Text style={styles.featureText}>API Keys protected</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome6 name="check" size={moderateScale(16)} color="#4CD964" iconStyle='solid'/>
            <Text style={styles.featureText}>Hybrid Storage Strategy</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome6 name="check" size={moderateScale(16)} color="#4CD964" iconStyle='solid'/>
            <Text style={styles.featureText}>Access Denied Protection</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome6 name="right-from-bracket" size={moderateScale(20)} color="#FFFFFF" iconStyle='solid'/>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Secure Pokémon App v1.0</Text>
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
  userSection: {
    alignItems: 'center',
    padding: moderateScale(32),
    backgroundColor: '#FFFFFF',
    marginBottom: moderateScale(16),
    shadowColor: '#1D2C5E',
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  userName: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#1D2C5E',
    marginTop: moderateScale(16),
  },
  userEmail: {
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
    shadowOffset: { width: 0, height: moderateScale(2) },
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC0A2D',
    marginHorizontal: moderateScale(16),
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(16),
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginLeft: moderateScale(8),
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