"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import PokemonCard from "@/components/pokemon-card"
import PokemonCardSkeleton from "@/components/pokemon-card-skeleton"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Pokemon {
  name: string
  url: string
}

interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Pokemon[]
}

interface PokemonDetails {
  id: number
  types: {
    slot: number
    type: {
      name: string
    }
  }[]
  sprites?: {
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
}

export default function Home() {
  const [displayCount, setDisplayCount] = useState(20)
  const [loadingMore, setLoadingMore] = useState(false)
  const [allPokemonDetails, setAllPokemonDetails] = useState<Record<string, PokemonDetails>>({})

  // Fetch the list of all Pokémon
  const { data: pokemonList, isLoading: isLoadingList } = useQuery<PokemonListResponse>({
    queryKey: ["pokemonList"],
    queryFn: async () => {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    },
  })

  // Fetch initial Pokémon details
  const { data: initialPokemonDetails, isLoading: isLoadingInitial } = useQuery<Record<string, PokemonDetails>>({
    queryKey: ["initialPokemonDetails"],
    queryFn: async () => {
      if (!pokemonList) return {}

      const details: Record<string, PokemonDetails> = {}

      // Fetch first 20 Pokémon details
      const initialPokemon = pokemonList.results.slice(0, 20)

      await Promise.all(
        initialPokemon.map(async (pokemon) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch details for ${pokemon.name}`)
          }
          const data = await response.json()
          details[pokemon.name] = {
            id: data.id,
            types: data.types,
            sprites: data.sprites,
          }
        }),
      )

      return details
    },
    enabled: !!pokemonList,
  })

  // Update allPokemonDetails when initialPokemonDetails changes
  useEffect(() => {
    if (initialPokemonDetails) {
      setAllPokemonDetails((prev) => ({
        ...prev,
        ...initialPokemonDetails,
      }))
    }
  }, [initialPokemonDetails])

  // Function to load more Pokémon
  const handleLoadMore = async () => {
    if (!pokemonList || loadingMore) return

    setLoadingMore(true)
    const newDisplayCount = Math.min(displayCount + 20, 151)

    try {
      // Fetch details for the next batch of Pokémon
      const newPokemonToFetch = pokemonList.results.slice(displayCount, newDisplayCount)

      const newDetails: Record<string, PokemonDetails> = {}

      await Promise.all(
        newPokemonToFetch.map(async (pokemon) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch details for ${pokemon.name}`)
          }
          const data = await response.json()
          newDetails[pokemon.name] = {
            id: data.id,
            types: data.types,
            sprites: data.sprites,
          }
        }),
      )

      // Update state with new details
      setAllPokemonDetails((prev) => ({
        ...prev,
        ...newDetails,
      }))

      // Update display count after successful fetch
      setDisplayCount(newDisplayCount)
    } catch (error) {
      console.error("Error loading more Pokémon:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  const isLoading = isLoadingList || isLoadingInitial

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container py-8 md:py-12">
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 py-16 px-6 text-center shadow-xl">
          <div className="relative z-10">
            <motion.h1
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to Pokémon Explorer
            </motion.h1>
            <motion.p
              className="mx-auto max-w-2xl text-lg text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover and learn about your favorite Pokémon from the original 151 Kanto region Pokédex.
            </motion.p>
          </div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-yellow-400 opacity-50"></div>
          <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-red-500 opacity-50"></div>

          {/* Pokemon Image */}
          <div className="relative mt-8 mx-auto max-w-3xl">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MVk3J4cBmu2yjVpDnKbpSqh5Jk9Qaz.png"
              alt="Pokémon Collection"
              width={800}
              height={200}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

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
              {pokemonList?.results.slice(0, displayCount).map((pokemon) => {
                const details = allPokemonDetails?.[pokemon.name]

                // If we have the details, show the card
                if (details) {
                  return (
                    <motion.div key={pokemon.name} variants={item}>
                      <PokemonCard
                        name={pokemon.name}
                        id={details.id}
                        types={details.types.map((t) => t.type.name)}
                        sprites={details.sprites}
                      />
                    </motion.div>
                  )
                }

                // Show skeleton for items that are still loading
                return <PokemonCardSkeleton key={pokemon.name} />
              })}
            </motion.div>

            {displayCount < 151 && (
              <div className="mt-8 flex justify-center">
                <Button onClick={handleLoadMore} disabled={loadingMore} size="lg" className="gap-2">
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  Load More Pokémon
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

