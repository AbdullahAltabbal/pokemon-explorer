'use client';

import { Button } from '@/components/ui/button';
import { loadFavorites, saveFavorites } from '@/lib/cookies';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FavoriteButton({ pokemonName, onRemoveFavorite }: { pokemonName: string; onRemoveFavorite?(): void }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This needs to run client-side only
    if (typeof window !== 'undefined') {
      const favorites = loadFavorites();
      setIsFavorite(favorites.includes(pokemonName));
      setIsLoading(false);
    }
  }, [pokemonName]);

  const toggleFavorite = () => {
    const favorites = loadFavorites();
    let newFavorites: string[];

    if (!isFavorite) newFavorites = [...favorites, pokemonName];
    else {
      newFavorites = favorites.filter((name) => name !== pokemonName);
      onRemoveFavorite && onRemoveFavorite();
    }

    saveFavorites(newFavorites);
    setIsFavorite(!isFavorite);
  };

  return (
    <Button
      variant={'ghost'}
      size="sm"
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite();
      }}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className="px-3 gap-2"
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
    </Button>
  );
}
