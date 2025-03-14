'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadFavorites, saveFavorites } from '@/lib/cookies';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
      dream_world: {
        front_default: string;
      };
    };
  };
}

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

const formatStatName = (stat: string) => {
  switch (stat) {
    case 'hp':
      return 'HP';
    case 'attack':
      return 'Attack';
    case 'defense':
      return 'Defense';
    case 'special-attack':
      return 'Sp. Atk';
    case 'special-defense':
      return 'Sp. Def';
    case 'speed':
      return 'Speed';
    default:
      return stat;
  }
};

export default function PokemonDetailsPage() {
  const { name } = useParams<{ name: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // This needs to run client-side only
    if (typeof window !== 'undefined') {
      const favorites = loadFavorites();
      setIsFavorite(favorites.includes(name));
    }
  }, [name]);

  const toggleFavorite = () => {
    const favorites = loadFavorites();
    let newFavorites: string[];

    if (isFavorite) {
      newFavorites = favorites.filter((n) => n !== name);
    } else newFavorites = [...favorites, name];

    saveFavorites(newFavorites);
    setIsFavorite(!isFavorite);

    // Trigger a storage event for other components to detect the change
    window.dispatchEvent(new Event('storage'));
  };

  const { data, isLoading, error } = useQuery<PokemonDetails>({
    queryKey: ['pokemon', name],
    queryFn: async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon details');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">Failed to load Pokémon details</p>
        <Button asChild>
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    );
  }

  const images = [
    { url: data.sprites.other['official-artwork'].front_default, label: 'Official Artwork' },
    { url: data.sprites.other['dream_world'].front_default, label: 'Dream World' },
  ];

  return (
    <div className="container px-4 sm:px-6 py-6 sm:py-8 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Button variant="outline" size="sm" onClick={toggleFavorite} className="flex items-center gap-1 w-full sm:w-auto">
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-20">
        {/* Image Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="order-1 md:order-1">
          <div className="bg-muted rounded-lg p-4 sm:p-6 h-full">
            <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="h-full" spaceBetween={20}>
              {images.map((image, index) => (
                <SwiperSlide key={index} className="flex flex-col items-center justify-center">
                  <div className="relative aspect-square w-full max-w-[300px] mx-auto">
                    <Image src={image.url || '/placeholder.svg'} alt={`${data.name} - ${image.label}`} fill className="object-contain" />
                  </div>
                  <p className="text-center mt-4 text-sm text-muted-foreground">{image.label}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="order-2 md:order-2"
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">#{data.id.toString().padStart(3, '0')}</p>
              <h1 className="text-3xl md:text-4xl font-bold capitalize">{data.name}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.types.map((type) => (
                  <Badge key={type.type.name} className={`${typeColors[type.type.name] || 'bg-gray-500'} text-white`}>
                    {type.type.name}
                  </Badge>
                ))}
              </div>
            </div>

            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="abilities">Abilities</TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="space-y-4 pt-4">
                {data.stats.map((stat) => (
                  <div key={stat.stat.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{formatStatName(stat.stat.name)}</span>
                      <span className="text-sm text-muted-foreground">{stat.base_stat}</span>
                    </div>
                    <Progress value={stat.base_stat} max={255} className="h-2" />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="about" className="pt-4">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Height</dt>
                    <dd className="text-lg">{(data.height / 10).toFixed(1)} m</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Weight</dt>
                    <dd className="text-lg">{(data.weight / 10).toFixed(1)} kg</dd>
                  </div>
                </dl>
              </TabsContent>

              <TabsContent value="abilities" className="pt-4">
                <ul className="space-y-2">
                  {data.abilities.map((ability) => (
                    <li key={ability.ability.name} className="flex items-center">
                      <span className="capitalize">{ability.ability.name.replace('-', ' ')}</span>
                      {ability.is_hidden && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Hidden
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
