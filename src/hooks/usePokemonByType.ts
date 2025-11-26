import { useState, useEffect } from 'react';
import { Pokemon } from '../types/pokemon';
import { PokemonAPI } from '../services/api';

export const usePokemonByType = (type: string | null) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPokemon = async () => {
    try {
      setLoading(true);
      setError(null);

      if (type) {
        // Load by type - FIXED
        const typeData = await PokemonAPI.getPokemonByType(type);
        console.log('Type data:', typeData); // Debug log
        
        const detailedPokemon = await Promise.all(
          typeData.pokemon.slice(0, 20).map(async (p: any) => {
            try {
              // Extract pokemon name dari nested object
              const pokemonName = p.pokemon.name;
              const pokemonDetail = await PokemonAPI.getPokemonDetail(pokemonName);
              return pokemonDetail;
            } catch (error) {
              console.error(`Error loading ${p.pokemon.name}:`, error);
              // Return basic structure as fallback
              return {
                id: 0,
                name: p.pokemon.name,
                url: p.pokemon.url,
                sprites: { front_default: '', other: { 'official-artwork': { front_default: '' } } },
                types: [],
                stats: [],
                height: 0,
                weight: 0,
                abilities: []
              };
            }
          })
        );
        setPokemonList(detailedPokemon.filter(p => p.id !== 0)); // Filter out failed requests
      } else {
        // Load all - FIXED
        const data = await PokemonAPI.getPokemonList(0, 20);
        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon, index) => {
            try {
              return await PokemonAPI.getPokemonDetail(index + 1);
            } catch (error) {
              console.error(`Error loading Pokemon ${index + 1}:`, error);
              // Return proper fallback structure
              return {
                id: index + 1,
                name: pokemon.name,
                url: pokemon.url,
                sprites: { front_default: '', other: { 'official-artwork': { front_default: '' } } },
                types: [],
                stats: [],
                height: 0,
                weight: 0,
                abilities: []
              };
            }
          })
        );
        setPokemonList(detailedPokemon.filter(p => p.id !== 0));
      }
    } catch (err) {
      console.error('Error in usePokemonByType:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokémon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, [type]);

  return {
    pokemonList,
    loading,
    error,
    refresh: loadPokemon,
  };
};