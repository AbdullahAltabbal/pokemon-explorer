"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { loadFavorites, saveFavorites } from "@/lib/cookies"
import { toast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
  pokemonName: string
  onRemoveFavorite?: () => void
}

export default function FavoriteButton({ pokemonName, onRemoveFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This needs to run client-side only
    if (typeof window !== "undefined") {
      const favorites = loadFavorites()
      setIsFavorite(favorites.includes(pokemonName))
      setIsLoading(false)
    }
  }, [pokemonName])

  const toggleFavorite = () => {
    if (typeof window === "undefined") return

    const favorites = loadFavorites()
    let newFavorites: string[]

    if (isFavorite) {
      newFavorites = favorites.filter((name) => name !== pokemonName)
      toast({
        title: "Removed from favorites",
        description: `${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)} has been removed from your favorites.`,
      })

      // Call the callback if provided (for real-time removal in favorites page)
      if (onRemoveFavorite) {
        onRemoveFavorite()
      }
    } else {
      newFavorites = [...favorites, pokemonName]
      toast({
        title: "Added to favorites",
        description: `${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)} has been added to your favorites.`,
      })
    }

    saveFavorites(newFavorites)
    setIsFavorite(!isFavorite)

    // Debug
    console.log("Favorites saved:", newFavorites)
  }

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      size="sm"
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite()
      }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className="px-3 gap-1"
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-white text-white" : ""}`} />
      {isFavorite ? "Favorited" : "Favorite"}
    </Button>
  )
}

