import { Pokemon } from '../types/pokemon';

export type RootStackParamList = {
  MainTabs: undefined;
  PokemonDetail: { pokemon: Pokemon };
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type HomeTopTabParamList = {
  All: undefined;
  Fire: undefined;
  Water: undefined;
  Grass: undefined;
  Electric: undefined;
  Ice: undefined;
  Fighting: undefined;
  Poison: undefined;
  Ground: undefined;
  Flying: undefined;
  Psychic: undefined;
  Bug: undefined;
  Rock: undefined;
  Ghost: undefined;
  Dragon: undefined;
  Dark: undefined;
  Steel: undefined;
  Fairy: undefined;
};