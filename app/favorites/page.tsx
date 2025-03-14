'use client';

import PokemonCard from '@/components/ui/PokemonCard';
import PokemonCardSkeleton from '@/components/ui/PokemonCardSkeleton';
import { loadFavorites, saveFavorites } from '@/lib/cookies';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PokemonDetails {
  id: number;
  name: string;
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  sprites?: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load favorites on mount and when localStorage changes
  useEffect(() => {
    const loadFavoritesData = () => {
      const storedFavorites = loadFavorites();
      setFavorites(storedFavorites);
      console.log('Loaded favorites:', storedFavorites);
    };

    // Mark that we're client-side
    setIsClient(true);

    // Load favorites initially
    loadFavoritesData();

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      loadFavoritesData();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const {
    data: pokemonDetails,
    isLoading,
    refetch,
  } = useQuery<Record<string, PokemonDetails>>({
    queryKey: ['favoritePokemonDetails', favorites],
    queryFn: async () => {
      if (favorites.length === 0) return {};

      const details: Record<string, PokemonDetails> = {};

      await Promise.all(
        favorites.map(async (pokemonName) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch details for ${pokemonName}`);
          }
          const data = await response.json();
          details[pokemonName] = {
            id: data.id,
            name: data.name,
            types: data.types,
            sprites: data.sprites,
          };
        })
      );

      return details;
    },
    enabled: isClient && favorites.length > 0,
  });

  const handleRemoveFavorite = (pokemonName: string) => {
    // Update local state immediately
    setFavorites((prev) => prev.filter((name) => name !== pokemonName));

    // Update localStorage
    const currentFavorites = loadFavorites();
    const newFavorites = currentFavorites.filter((name) => name !== pokemonName);
    saveFavorites(newFavorites);

    // Trigger a storage event for other components to detect the change
    window.dispatchEvent(new Event('storage'));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Don't render anything during SSR to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="container py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Your Favorite Pokémon</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <PokemonCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Pokémon</h1>

      {isLoading && favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: favorites.length || 4 }).map((_, index) => (
            <PokemonCardSkeleton key={index} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
          <p className="text-muted-foreground">Visit a Pokémon's page and click the favorite button to add it to your favorites.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {favorites.map((pokemonName) => {
            const details = pokemonDetails?.[pokemonName];
            if (!details) return <PokemonCardSkeleton key={pokemonName} />;

            return (
              <motion.div key={pokemonName} variants={item}>
                <PokemonCard
                  name={details.name}
                  id={details.id}
                  types={details.types.map((t) => t.type.name)}
                  sprites={details.sprites}
                  onRemoveFavorite={() => handleRemoveFavorite(pokemonName)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
