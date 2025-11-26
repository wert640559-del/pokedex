import { useState, useEffect } from 'react';
import { Pokemon, PokemonListResponse } from '../types/pokemon';
import { PokemonAPI } from '../services/api';

export const usePokemon = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPokemon = async (loadOffset = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const data: PokemonListResponse = await PokemonAPI.getPokemonList(loadOffset);
      
      // Get detailed information for each Pokemon
      const detailedPokemon = await Promise.all(
        data.results.map(async (pokemon, index) => {
          try {
            return await PokemonAPI.getPokemonDetail(loadOffset + index + 1);
          } catch {
            // Fallback to basic info if detail fetch fails
            return { ...pokemon, id: loadOffset + index + 1 };
          }
        })
      );

      if (loadOffset === 0) {
        setPokemonList(detailedPokemon);
      } else {
        setPokemonList(prev => [...prev, ...detailedPokemon]);
      }

      setHasMore(!!data.next);
      setOffset(loadOffset + 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokémon');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setOffset(0);
    loadPokemon(0);
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  return {
    pokemonList,
    loading,
    error,
    hasMore,
    loadMore: () => loadPokemon(offset),
    refresh,
  };
};