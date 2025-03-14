import { loadFavorites, saveFavorites } from '@/lib/cookies';
import { useEffect, useState } from 'react';

type PokemonType = {
  slot: number;
  type: {
    name: string;
  };
};

type PokemonSprites = {
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
};

type PokemonDetails = {
  id: number;
  name: string;
  types: PokemonType[];
  sprites?: PokemonSprites;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (favorites.length === 0) {
        setPokemonDetails([]);
        return;
      }

      const details: PokemonDetails[] = [];

      await Promise.all(
        favorites.map(async (pokemonName) => {
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!response.ok) {
              console.error(`Failed to fetch details for ${pokemonName}`);
              return;
            }
            const data = await response.json();
            details.push({
              id: data.id,
              name: data.name,
              types: data.types,
              sprites: data.sprites,
            });
          } catch (error) {
            console.error(`Error fetching details for ${pokemonName}:`, error);
          }
        })
      );

      setPokemonDetails(details);
    };

    fetchPokemonDetails();
  }, [favorites]);

  const addFavorite = (pokemonName: string) => {
    setFavorites((prev) => {
      const updatedFavorites = [...prev, pokemonName];
      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
  };

  const removeFavorite = (pokemonName: string) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.filter((name) => name !== pokemonName);
      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
    setPokemonDetails((prev) => prev.filter((pokemon) => pokemon.name !== pokemonName));
  };

  return {
    pokemonDetails,
    isLoading: false, // Adjust this if you want to manage loading state differently
    addFavorite,
    removeFavorite,
  };
}
