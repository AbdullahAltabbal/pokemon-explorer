import CookieConsent from '@/components/cookie-consent';
import { QueryProvider } from '@/components/QueryProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/ui/Header';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pokémon Explorer',
  description: 'Explore the world of Pokémon with detailed information and beautiful images',
  generator: 'v0.dev',
  icons: {
    icon: '/pokemon.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <CookieConsent />
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import Footer from '@/components/footer';
import './globals.css';
