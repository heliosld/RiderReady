import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { Providers } from '@/components/Providers'
import { Navigation } from '@/components/Navigation'
import { DemoNotice } from '@/components/DemoNotice'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RiderReady - Find Lighting Fixtures & Vendors',
  description: 'The comprehensive database for lighting designers to find automated lights, conventional fixtures, and production vendors.',
  keywords: ['lighting', 'fixtures', 'LD', 'lighting designer', 'automated lights', 'rental', 'vendors'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-gray-200`}>
        <Providers>
          <DemoNotice />
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-black border-t border-gray-800 text-gray-400 py-8 mt-auto">
              <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <img src="/riderready-logo.png" alt="RiderReady" className="h-12 w-auto" />
                    <span className="text-2xl font-bold text-white">RiderReady</span>
                  </div>
                  <p className="text-center">&copy; 2025 RiderReady. Built for Production Professionals.</p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
