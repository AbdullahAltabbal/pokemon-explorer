'use client';

import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export default function SearchPokemon({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data, isLoading } = useQuery<PokemonListResponse>({
    queryKey: ['pokemonList', searchTerm],
    queryFn: async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const filteredResults = searchTerm
        ? data.results.filter((pokemon: Pokemon) => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : data.results;
      return {
        ...data,
        results: filteredResults,
      };
    },
    enabled: searchTerm.length > 0, // Only run query when there's a search term
  });

  useEffect(() => {
    setIsDropdownOpen(searchTerm.length > 0);
  }, [searchTerm]);

  const handlePokemonSelect = (pokemonName: string) => {
    router.push(`/pokemon/${pokemonName}`);
    setIsDropdownOpen(false);
    onClose();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        {searchTerm && (
          <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearchTerm('')}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto"
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : data && data?.results?.length > 0 ? (
              <ul>
                {data?.results.map((pokemon) => {
                  const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
                  return (
                    <li key={pokemon.name}>
                      <button className="flex items-center w-full p-2 hover:bg-muted text-left" onClick={() => handlePokemonSelect(pokemon.name)}>
                        <div className="w-10 h-10 mr-3 relative">
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                            alt={pokemon.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="capitalize">{pokemon.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-4 text-center text-muted-foreground">No Pokémon found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
