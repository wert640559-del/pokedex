import axios from 'axios';
import { Pokemon, PokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

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