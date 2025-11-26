// FILE: ./hooks/usePokemonByType.ts

import { useState, useEffect } from 'react';
import { Pokemon } from '../types/pokemon';
import { PokemonAPI } from '../services/api';

export const usePokemonByType = (type: string | null) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPokemon = async (loadOffset = 0, loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      if (type) {
        // Load by type - tetap 20 untuk performance
        const typeData = await PokemonAPI.getPokemonByType(type);
        console.log('Type data:', typeData);
        
        const detailedPokemon = await Promise.all(
          typeData.pokemon.slice(0, 20).map(async (p: any) => {
            try {
              const pokemonName = p.pokemon.name;
              const pokemonDetail = await PokemonAPI.getPokemonDetail(pokemonName);
              return pokemonDetail;
            } catch (error) {
              console.error(`Error loading ${p.pokemon.name}:`, error);
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
        setPokemonList(detailedPokemon.filter(p => p.id !== 0));
        setHasMore(false); // Untuk type-based, tidak ada load more
      } else {
        // Load all - IMPLEMENTASI INFINITE SCROLL
        const limit = 20; // Load 20 per batch
        const data = await PokemonAPI.getPokemonList(loadOffset, limit);
        console.log(`Loading Pokémon ${loadOffset} to ${loadOffset + limit}`);
        
        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon, index) => {
            try {
              // Gunakan ID dari URL atau index
              const pokemonId = loadOffset + index + 1;
              return await PokemonAPI.getPokemonDetail(pokemonId);
            } catch (error) {
              console.error(`Error loading Pokemon ${loadOffset + index + 1}:`, error);
              return {
                id: loadOffset + index + 1,
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

        const validPokemon = detailedPokemon.filter(p => p.id !== 0);
        
        if (loadOffset === 0) {
          setPokemonList(validPokemon);
        } else {
          setPokemonList(prev => [...prev, ...validPokemon]);
        }

        setHasMore(!!data.next);
        setOffset(loadOffset + limit);
      }
    } catch (err) {
      console.error('Error in usePokemonByType:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokémon');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore && !type) { // Hanya untuk tab "All"
      loadPokemon(offset, true);
    }
  };

  const refresh = () => {
    setOffset(0);
    setHasMore(true);
    loadPokemon(0);
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    loadPokemon(0);
  }, [type]);

  return {
    pokemonList,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};