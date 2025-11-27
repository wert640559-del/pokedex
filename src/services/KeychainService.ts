// FILE: ./services/KeychainService.ts

import * as Keychain from 'react-native-keychain';

// Namespacing service untuk isolasi
const SERVICE_NAMESPACE = 'com.pokedex';

export const KeychainService = {
  // Service names untuk berbagai jenis data
  SERVICES: {
    USER_TOKEN: `${SERVICE_NAMESPACE}:userToken`,
    API_KEY: `${SERVICE_NAMESPACE}:apiKey`,
  },

  /**
   * Menyimpan token JWT ke Keychain
   */
  saveAuthToken: async (token: string): Promise<boolean> => {
    try {
      const result = await Keychain.setGenericPassword(
        'auth_token', // username statis untuk token
        token,
        {
          service: KeychainService.SERVICES.USER_TOKEN,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        }
      );
      return result !== false;
    } catch (error) {
      console.error('Error saving auth token to Keychain:', error);
      return false;
    }
  },

  /**
   * Mengambil token JWT dari Keychain
   */
  getAuthToken: async (): Promise<string | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KeychainService.SERVICES.USER_TOKEN,
      });
      
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token from Keychain:', error);
      
      // Handle specific access denied errors
      if (error.message?.includes('access denied') || 
          error.message?.includes('security') ||
          error.code === 'E_KEYCHAIN_ACCESS_DENIED') {
        throw new Error('ACCESS_DENIED');
      }
      
      throw error;
    }
  },

  /**
   * Menghapus token JWT dari Keychain
   */
  removeAuthToken: async (): Promise<boolean> => {
    try {
      const result = await Keychain.resetGenericPassword({
        service: KeychainService.SERVICES.USER_TOKEN,
      });
      return result !== false;
    } catch (error) {
      console.error('Error removing auth token from Keychain:', error);
      return false;
    }
  },

  /**
   * Menyimpan API Key rahasia ke Keychain
   */
  saveApiKey: async (apiKey: string): Promise<boolean> => {
    try {
      const result = await Keychain.setGenericPassword(
        'api_client', // username statis untuk API key
        apiKey,
        {
          service: KeychainService.SERVICES.API_KEY,
          accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
        }
      );
      return result !== false;
    } catch (error) {
      console.error('Error saving API key to Keychain:', error);
      return false;
    }
  },

  /**
   * Mengambil API Key dari Keychain
   */
  getApiKey: async (): Promise<string | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KeychainService.SERVICES.API_KEY,
      });
      
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error getting API key from Keychain:', error);
      return null;
    }
  },

  /**
   * Menghapus API Key dari Keychain
   */
  removeApiKey: async (): Promise<boolean> => {
    try {
      const result = await Keychain.resetGenericPassword({
        service: KeychainService.SERVICES.API_KEY,
      });
      return result !== false;
    } catch (error) {
      console.error('Error removing API key from Keychain:', error);
      return false;
    }
  },

  /**
   * Pembersihan total semua data sensitif dari Keychain
   */
  clearAllSensitiveData: async (): Promise<boolean> => {
    try {
      const results = await Promise.all([
        KeychainService.removeAuthToken(),
        KeychainService.removeApiKey(),
      ]);
      
      return results.every(result => result === true);
    } catch (error) {
      console.error('Error clearing all sensitive data from Keychain:', error);
      return false;
    }
  },
};