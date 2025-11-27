// FILE: ./services/HybridStorageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeychainService } from './KeychainService';

// Keys untuk AsyncStorage
const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME_MODE: 'theme_mode',
  NOTIFICATION_STATUS: 'notification_status',
  APP_SETTINGS: 'app_settings',
};

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export interface AppInitialData {
  authToken: string | null;
  userPreferences: UserPreferences | null;
  appSettings: any;
}

export const HybridStorageService = {
  /**
   * Load semua data penting secara paralel di awal aplikasi
   */
  loadInitialAppData: async (): Promise<AppInitialData> => {
    try {
      // Load data dari kedua sumber secara paralel
      const [authToken, storageData] = await Promise.all([
        // Token dari Keychain (secure)
        KeychainService.getAuthToken().catch(error => {
          if (error.message === 'ACCESS_DENIED') {
            throw error; // Re-throw untuk penanganan khusus
          }
          return null;
        }),
        
        // Data preferensi dari AsyncStorage
        Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES),
          AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE),
          AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_STATUS),
          AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS),
        ]),
      ]);

      const [preferences, theme, notifications, settings] = storageData;

      // Parse user preferences
      let userPreferences: UserPreferences | null = null;
      try {
        userPreferences = preferences ? JSON.parse(preferences) : {
          theme: (theme as 'light' | 'dark') || 'light',
          notifications: notifications ? JSON.parse(notifications) : true,
          language: 'en',
        };
      } catch {
        userPreferences = {
          theme: 'light',
          notifications: true,
          language: 'en',
        };
      }

      // Parse app settings
      let appSettings: any = null;
      try {
        appSettings = settings ? JSON.parse(settings) : {};
      } catch {
        appSettings = {};
      }

      return {
        authToken,
        userPreferences,
        appSettings,
      };
    } catch (error) {
      console.error('Error loading initial app data:', error);
      throw error;
    }
  },

  /**
   * Menyimpan preferensi pengguna ke AsyncStorage
   */
  saveUserPreferences: async (preferences: UserPreferences): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(preferences)
      );
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  },

  /**
   * Mendapatkan preferensi pengguna dari AsyncStorage
   */
  getUserPreferences: async (): Promise<UserPreferences | null> => {
    try {
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  },

  /**
   * Menyimpan tema ke AsyncStorage
   */
  saveTheme: async (theme: 'light' | 'dark'): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, theme);
      return true;
    } catch (error) {
      console.error('Error saving theme:', error);
      return false;
    }
  },

  /**
   * Mendapatkan tema dari AsyncStorage
   */
  getTheme: async (): Promise<'light' | 'dark'> => {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
      return (theme as 'light' | 'dark') || 'light';
    } catch (error) {
      console.error('Error getting theme:', error);
      return 'light';
    }
  },
};