"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import FavoriteButton from "./favorite-button";

interface PokemonCardProps {
	name: string;
	id: number;
	image: string;
	onRemoveFavorite?: () => void;
}

export default function PokemonCard({
	name,
	id,
	image,
	onRemoveFavorite,
}: PokemonCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Link href={`/pokemon/${name}`}>
			<motion.div
				whileHover={{ y: -5 }}
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => setIsHovered(false)}
			>
				<Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
					<CardContent className="p-4 pb-2">
						<div className="relative w-full aspect-square mb-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
							<motion.div
								animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
								transition={{ duration: 0.3 }}
								className="w-full h-full"
							>
								<Image
									src={image}
									alt={name}
									fill
									className="object-contain p-2"
									onError={(e) => {
										// Fallback to default sprite if official artwork fails to load
										(
											e.target as HTMLImageElement
										).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
									}}
								/>
							</motion.div>
						</div>
						<div className="text-center">
							<h3 className="font-semibold text-lg capitalize mb-2">{name}</h3>
						</div>
					</CardContent>
					<CardFooter className="p-2 pt-0 flex justify-center">
						<FavoriteButton
							pokemonName={name}
							onRemoveFavorite={onRemoveFavorite}
						/>
					</CardFooter>
				</Card>
			</motion.div>
		</Link>
	);
}
