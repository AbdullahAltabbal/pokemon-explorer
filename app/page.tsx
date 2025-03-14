'use client';

import HomeHeader from '@/components/HomeHeader';
import PokemonCard from '@/components/pokemon-card';
import PokemonCardSkeleton from '@/components/pokemon-card-skeleton';
import { Button } from '@/components/ui/button';
import { useGetPokemons } from '@/hooks/useGetPokemons';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { pokemons, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetPokemons();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="container py-8 md:py-12">
      <HomeHeader />

      <section>
        <h2 className="text-3xl font-bold mb-6">Pokémon Collection</h2>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <PokemonCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {pokemons.map((pokemon) => {
                return <PokemonCard key={pokemon.id} image={pokemon.image} name={pokemon.name} id={pokemon.id} />;
              })}
            </motion.div>

            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <Button onClick={() => fetchNextPage()} disabled={isLoading} size="lg" className="gap-2">
                  {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
                  Load More Pokémon
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
