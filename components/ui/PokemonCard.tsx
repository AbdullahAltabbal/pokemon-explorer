'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import FavoriteButton from '../favorite-button';

type PokemonCardProps = {
  name: string;
  id: number;
  image: string;
  types?: string[];
  sprites?: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  onRemoveFavorite?(): void;
};

export default function PokemonCard({ name, id, image, onRemoveFavorite }: PokemonCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/pokemon/${name}`}>
      <motion.div whileHover={{ y: -5 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
        <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
          <CardContent className="p-4 pb-2">
            <div className="relative w-full aspect-square mb-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
              <motion.div animate={isHovered ? { scale: 1.1 } : { scale: 1 }} transition={{ duration: 0.3 }} className="w-full h-full">
                <Image src={image} alt={name} fill className="object-contain p-2" />
              </motion.div>
            </div>
            <div className="text-center"></div>
          </CardContent>
          <CardFooter className="p-2 pt-0 flex justify-center items-center gap-2 text-lg">
            <h3 className="font-semibold  capitalize ">{name}</h3>
            <FavoriteButton pokemonName={name} onRemoveFavorite={onRemoveFavorite} />
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}
