// FILE: ./services/AuthService.ts

import { KeychainService } from './KeychainService';
import { HybridStorageService } from './HybridStorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simulasi login API
const MOCK_LOGIN_API = async (email: string, password: string): Promise<{ token: string; user: any }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'jwt_mock_token_' + Date.now(),
        user: { id: 1, email, name: 'Pokemon Trainer' }
      });
    }, 1000);
  });
};

export const AuthService = {
  /**
   * Login dan simpan token ke Keychain
   */
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      // Panggil API login
      const response = await MOCK_LOGIN_API(email, password);
      
      // Simpan token ke Keychain (bukan AsyncStorage)
      const tokenSaved = await KeychainService.saveAuthToken(response.token);
      
      if (!tokenSaved) {
        throw new Error('Failed to save authentication token');
      }
      
      // Simpan user info ke AsyncStorage (non-sensitive data)
      await AsyncStorage.setItem('user_info', JSON.stringify(response.user));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Cek apakah user sudah login dengan memverifikasi token di Keychain
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await KeychainService.getAuthToken();
      return !!token;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  },

  /**
   * Logout dengan pembersihan semua data
   */
  logout: async (): Promise<boolean> => {
    try {
      // Hapus semua data sensitif dari Keychain
      const keychainCleared = await KeychainService.clearAllSensitiveData();
      
      // Hapus semua data non-sensitif dari AsyncStorage
      const asyncStorageKeys = await AsyncStorage.getAllKeys();
      const sensitiveKeys = asyncStorageKeys.filter(key => 
        !key.includes('favorite') && // Jangan hapus favorites
        !key.includes('pokemon') && // Jangan hapus pokemon cache
        !key.includes('app_settings') // Jangan hapus settings umum
      );
      
      await AsyncStorage.multiRemove(sensitiveKeys);
      
      return keychainCleared;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  /**
   * Get current user info dari AsyncStorage
   */
  getCurrentUser: async (): Promise<any> => {
    try {
      const userInfo = await AsyncStorage.getItem('user_info');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
};