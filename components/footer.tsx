import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-red-500 border-2 border-white dark:border-gray-800 relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-[1px] bg-white dark:bg-gray-800"></div>
            </div>
            <span className="font-semibold">Pokémon Explorer</span>
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Pokémon Explorer. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            PokéAPI
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}

