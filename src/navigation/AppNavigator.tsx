// FILE: ./navigation/AppNavigator.tsx

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

import { KeychainService } from '../services/KeychainService';
import { HybridStorageService } from '../services/HybridStorageService';
import { initializeApiKey } from '../services/api';
import { RootStackParamList, MainTabParamList } from './types';
import { HomeTopTabsNavigator } from './HomeTopTabsNavigator';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { AuthService } from '../services/AuthService';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Loading Component untuk Splash Screen
const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#DC0A2D" />
    <Text style={styles.loadingText}>Loading Pokémon App...</Text>
  </View>
);

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FFCB05',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#1D2C5E',
          borderTopWidth: 2,
          borderTopColor: '#FFCB05',
          height: 60,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTopTabsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="house" size={size} color={color} iconStyle='solid'/>
          ),
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="heart" size={size} color={color} iconStyle='solid'/>
          ),
          title: 'Favorites',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="user" size={size} color={color} />
          ),
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async (): Promise<void> => {
    try {
      // Inisialisasi API Key terlebih dahulu
      await initializeApiKey();

      // Load semua data penting secara paralel
      const appData = await HybridStorageService.loadInitialAppData();
      
      setUserPreferences(appData.userPreferences);
      setIsAuthenticated(!!appData.authToken);
      
    } catch (error) {
      console.error('App initialization error:', error);
      
      // Handle access denied error khusus
      if (error.message === 'ACCESS_DENIED') {
        Alert.alert(
          'Keamanan Perangkat Diubah',
          'Mohon login ulang karena terdapat perubahan pada keamanan perangkat Anda.',
          [
            {
              text: 'OK',
              onPress: async () => {
                // Reset token dan arahkan ke login
                await KeychainService.removeAuthToken();
                setIsAuthenticated(false);
              }
            }
          ]
        );
        return;
      }
      
      // Fallback ke unauthenticated state untuk error lainnya
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (): void => {
    setIsAuthenticated(true);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      // Pembersihan data aman saat logout
      const logoutSuccess = await AuthService.logout();
      
      if (logoutSuccess) {
        setIsAuthenticated(false);
      } else {
        Alert.alert('Error', 'Failed to logout properly');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'An error occurred during logout');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          // Authenticated flows
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="PokemonDetail" 
              component={PokemonDetailScreen}
              options={{ 
                title: 'Pokémon Details',
                headerShown: false
              }}
            />
          </>
        ) : (
          // Unauthenticated flows
          <Stack.Screen 
            name="Login" 
            options={{ headerShown: false }}
          >
            {(props) => (
              <LoginScreen 
                {...props} 
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1D2C5E',
    fontWeight: '600',
  },
});