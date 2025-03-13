"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import FavoriteButton from "./favorite-button"

interface PokemonCardProps {
  name: string
  id: number
  types: string[]
  sprites?: {
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  showDetails?: boolean
  onRemoveFavorite?: () => void
}

export default function PokemonCard({
  name,
  id,
  types,
  sprites,
  showDetails = false,
  onRemoveFavorite,
}: PokemonCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const imageUrl =
    sprites?.other?.["official-artwork"]?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

  const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-orange-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-300",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-amber-600",
    flying: "bg-indigo-300",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-700",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-700",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
  }

  return (
    <Link href={`/pokemon/${name}`}>
      <motion.div whileHover={{ y: -5 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
        <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
          <CardContent className="p-4 pb-2">
            <div className="relative w-full aspect-square mb-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
              <motion.div
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={name}
                  fill
                  className="object-contain p-2"
                  onError={(e) => {
                    // Fallback to default sprite if official artwork fails to load
                    ;(e.target as HTMLImageElement).src =
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                  }}
                />
              </motion.div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg capitalize mb-2">{name}</h3>
            </div>
          </CardContent>
          <CardFooter className="p-2 pt-0 flex justify-center">
            <FavoriteButton pokemonName={name} onRemoveFavorite={onRemoveFavorite} />
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}

