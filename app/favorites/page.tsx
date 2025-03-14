'use client';

import { useFavorites } from '@/components/ui/hooks/use-favorites';
import PokemonCard from '@/components/ui/PokemonCard';
import PokemonCardSkeleton from '@/components/ui/PokemonCardSkeleton';
import { motion } from 'framer-motion';

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

export default function FavoritesPage() {
  const { pokemonDetails, removeFavorite, isLoading } = useFavorites();

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

  if (!pokemonDetails)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
        <p className="text-muted-foreground">Visit a Pokémon's page and click the favorite button to add it to your favorites.</p>
      </div>
    );

  if (isLoading)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: pokemonDetails.length || 4 }).map((_, index) => (
          <PokemonCardSkeleton key={index} />
        ))}
      </div>
    );

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Pokémon</h1>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {pokemonDetails.map((pokemon) => {
          return (
            <motion.div key={pokemon.id} variants={item}>
              <PokemonCard
                image={pokemon.sprites?.other['official-artwork'].front_default || ''}
                name={pokemon.name}
                id={pokemon.id}
                types={pokemon.types.map((t) => t.type.name)}
                sprites={pokemon.sprites}
                onRemoveFavorite={() => removeFavorite(pokemon.name)}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
