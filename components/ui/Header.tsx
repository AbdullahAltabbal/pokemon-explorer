'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import { Menu, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SearchPokemon from './SearchPokemon';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
              delay: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 10,
            }}
          >
            <div className="rounded-full border-4 border-white dark:border-gray-800 relative">
              <Image src="/pokemon.webp" alt="Pokémon Logo" width={32} height={32} />
            </div>
          </motion.div>
          <span className="font-bold text-xl">Pokémon Explorer</span>
        </Link>

        <div className="flex items-center gap-4">
          {showSearch ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '300px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden sm:block"
            >
              <SearchPokemon onClose={() => setShowSearch(false)} />
            </motion.div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)} aria-label="Search" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
          )}

          <div className="border-l pl-4 dark:border-gray-700">
            <ThemeToggle />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 ml-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Home
            </Link>
            <Link
              href="/favorites"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/favorites' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Favorites
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col gap-6 mt-6">
                <div className="px-2">
                  <SearchPokemon onClose={() => {}} />
                </div>
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/"
                    className={`px-2 py-1 rounded-md text-sm font-medium transition-colors hover:bg-muted ${pathname === '/' ? 'bg-muted' : ''}`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/favorites"
                    className={`px-2 py-1 rounded-md text-sm font-medium transition-colors hover:bg-muted ${
                      pathname === '/favorites' ? 'bg-muted' : ''
                    }`}
                  >
                    Favorites
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
