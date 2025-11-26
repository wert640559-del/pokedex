import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorite_pokemon';

export const StorageService = {
  getFavorites: async (): Promise<number[]> => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch {
      return [];
    }
  },

  addFavorite: async (pokemonId: number): Promise<boolean> => {
    try {
      const favorites = await StorageService.getFavorites();
      if (!favorites.includes(pokemonId)) {
        favorites.push(pokemonId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
      return true;
    } catch {
      return false;
    }
  },

  removeFavorite: async (pokemonId: number): Promise<boolean> => {
    try {
      const favorites = await StorageService.getFavorites();
      const updatedFavorites = favorites.filter(id => id !== pokemonId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true;
    } catch {
      return false;
    }
  },

  isFavorite: async (pokemonId: number): Promise<boolean> => {
    const favorites = await StorageService.getFavorites();
    return favorites.includes(pokemonId);
  },
};