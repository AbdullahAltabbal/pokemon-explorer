import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Pokémon Explorer. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
            PokéAPI
          </Link>
          <Link href="https://altabbal.net" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
            Created by Abdullah Al Tabbal
          </Link>
        </div>
      </div>
    </footer>
  );
}
