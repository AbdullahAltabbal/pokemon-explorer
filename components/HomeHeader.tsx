import { motion } from "framer-motion";
import Image from "next/image";

export default function HomeHeader() {
	return (
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
						Discover and learn about your favorite Pokémon from the original 151
						Kanto region Pokédex.
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
	);
}
