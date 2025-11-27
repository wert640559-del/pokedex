// FILE: ./services/api.ts

import axios from 'axios';
import { KeychainService } from './KeychainService';
import { Pokemon, PokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Buat instance axios
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Inisialisasi API Key saat aplikasi dimulai
export const initializeApiKey = async (): Promise<void> => {
  try {
    // Cek apakah API key sudah ada
    let apiKey = await KeychainService.getApiKey();
    
    if (!apiKey) {
      // Simpan API key statis (dalam production, ini harus dari environment variable)
      const STATIC_API_KEY = 'PKMN_API_SECRET_XYZ123';
      await KeychainService.saveApiKey(STATIC_API_KEY);
      apiKey = STATIC_API_KEY;
    }
    
    console.log('API Key initialized successfully');
  } catch (error) {
    console.error('Failed to initialize API key:', error);
  }
};

// Request interceptor untuk menambahkan API Key
api.interceptors.request.use(
  async (config) => {
    try {
      // Ambil API Key dari Keychain
      const apiKey = await KeychainService.getApiKey();
      
      if (apiKey) {
        config.headers['X-API-Key'] = apiKey;
      } else {
        // Jika API key tidak ditemukan, throw error 401
        throw new axios.Cancel('API key not found - Unauthorized');
      }
      
      return config;
    } catch (error) {
      console.error('API Key interceptor error:', error);
      
      // Handle case where API key is not available
      if (error.message?.includes('not found')) {
        throw new axios.Cancel('Request cancelled: No API key available');
      }
      
      throw error;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired atau tidak valid
      await handleUnauthorizedError();
    }
    return Promise.reject(error);
  }
);

const handleUnauthorizedError = async (): Promise<void> => {
  try {
    // Hapus token yang sudah tidak valid
    await KeychainService.removeAuthToken();
    
    // Navigate ke login screen (akan dihandle di navigator)
    // Dalam implementasi nyata, ini akan menggunakan event emitter atau context
    console.log('Unauthorized access - redirecting to login');
  } catch (error) {
    console.error('Error handling unauthorized error:', error);
  }
};

export const PokemonAPI = {
  getPokemonList: async (offset = 0, limit = 20): Promise<PokemonListResponse> => {
    const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  getPokemonDetail: async (idOrName: string | number): Promise<Pokemon> => {
    const response = await api.get(`/pokemon/${idOrName}`);
    return response.data;
  },

  getPokemonByType: async (type: string) => {
    const response = await api.get(`/type/${type}`);
    return response.data;
  },
};