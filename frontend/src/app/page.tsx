'use client';

import Link from 'next/link';
import { Search, Lightbulb, Speaker, Monitor, Guitar, Construction, Zap, Users, Boxes } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fixturesApi, manufacturersApi, vendorsApi } from '@/lib/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: fixtures } = useQuery({
    queryKey: ['fixtures'],
    queryFn: () => fixturesApi.getAll({ limit: 100 }),
  });

  const { data: manufacturers } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: manufacturersApi.getAll,
  });

  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => vendorsApi.getAll({ limit: 100 }),
  });

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    if (!fixtures && !manufacturers && !vendors) return null;

    const query = searchQuery.toLowerCase();
    const fixtureList = fixtures?.data || [];
    const manufacturerList = manufacturers || [];
    const vendorList = vendors?.data || [];
    
    const results = {
      fixtures: fixtureList.filter((f: any) => 
        f.name?.toLowerCase().includes(query) || 
        f.manufacturer?.name?.toLowerCase().includes(query)
      ).slice(0, 5),
      manufacturers: manufacturerList.filter((m: any) =>
        m.name?.toLowerCase().includes(query)
      ).slice(0, 3),
      vendors: vendorList.filter((v: any) =>
        v.name?.toLowerCase().includes(query) ||
        v.city?.toLowerCase().includes(query)
      ).slice(0, 3)
    };

    return results;
  }, [searchQuery, fixtures, manufacturers, vendors]);
  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="py-20 text-center bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <img src="/RiderReadyBig.png" alt="RiderReady" className="h-96 w-auto" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-white">
            Your Production Equipment Database
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            The comprehensive platform for touring production professionals across all departments—lighting, audio, video, backline, and beyond.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <Link 
              href="/hubs"
              className="bg-amber-600 hover:bg-amber-700 text-black px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore Equipment Hubs
            </Link>
            <Link 
              href="/vendors"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Find Vendors
            </Link>
          </div>
          
          {/* Search Box */}
          <div className="bg-dark-secondary border-2 border-gray-800 hover:border-amber-600 transition-colors shadow-lg p-6 max-w-2xl mx-auto rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-6 h-6 text-amber-500" />
              <input
                type="text"
                placeholder="Search for fixtures, manufacturers, or vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-200 placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-500 hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchResults && (searchResults.fixtures.length > 0 || searchResults.manufacturers.length > 0 || searchResults.vendors.length > 0) ? (
            <div className="mt-4 border-t-2 border-amber-600 pt-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Fixtures Results */}
              {searchResults.fixtures.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-amber-500 mb-2 uppercase tracking-wide">Fixtures</h3>
                  <div className="space-y-2">
                    {searchResults.fixtures.map((fixture: any) => (
                      <Link
                        key={fixture.id}
                        href={`/fixtures/${fixture.slug}`}
                        className="block p-3 bg-dark-tertiary border-2 border-gray-800 rounded-lg hover:border-amber-500 hover:bg-dark transition-all"
                        onClick={() => setSearchQuery('')}
                      >
                        <div className="font-semibold text-white">{fixture.name}</div>
                        <div className="text-xs text-amber-500">{fixture.manufacturer.name}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Manufacturers Results */}
              {searchResults.manufacturers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-amber-500 mb-2 uppercase tracking-wide">Manufacturers</h3>
                  <div className="space-y-2">
                    {searchResults.manufacturers.map((manufacturer: any) => (
                      <Link
                        key={manufacturer.id}
                        href={`/manufacturers/${manufacturer.slug}`}
                        className="block p-3 bg-dark-tertiary border-2 border-gray-800 rounded-lg hover:border-amber-500 hover:bg-dark transition-all"
                        onClick={() => setSearchQuery('')}
                      >
                        <div className="font-semibold text-white">{manufacturer.name}</div>
                        {manufacturer.country && (
                          <div className="text-xs text-gray-400">{manufacturer.country}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Vendors Results */}
              {searchResults.vendors.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-amber-500 mb-2 uppercase tracking-wide">Vendors</h3>
                  <div className="space-y-2">
                    {searchResults.vendors.map((vendor: any) => (
                      <Link
                        key={vendor.id}
                        href={`/vendors/${vendor.slug}`}
                        className="block p-3 bg-dark-tertiary border-2 border-gray-800 rounded-lg hover:border-amber-500 hover:bg-dark transition-all"
                        onClick={() => setSearchQuery('')}
                      >
                        <div className="font-semibold text-white">{vendor.name}</div>
                        {vendor.city && vendor.country && (
                          <div className="text-xs text-gray-400">{vendor.city}, {vendor.country}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : searchQuery.trim() ? (
            <div className="mt-4 border-t border-gray-800 pt-4 text-center text-gray-400">
              No results found for "{searchQuery}"
            </div>
          ) : null}
            </div>
            
            {/* Demo Notice */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Demo prototype with limited fixtures and data
            </p>
          </div>
        </div>
      </section>

      {/* Equipment Hubs Section */}
      <section className="py-16 section-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Equipment Hubs
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Specialized databases for every production department. Search equipment, compare specs, and find vendors—all in one place.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Lighting Hub - Available */}
            <Link href="/fixtures" className="card-darker p-6 hover:border-amber-500 transition-all relative group">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-2 py-1 rounded bg-green-900 text-green-300 border border-green-700">
                  BETA TEST NOW
                </span>
              </div>
              <div className="mb-4">
                <Lightbulb className="w-12 h-12 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Lighting Hub</h3>
              <p className="text-sm text-gray-400">
                Automated lights, conventionals, consoles, and accessories with detailed specs
              </p>
            </Link>

            {/* Audio Hub - Coming Soon */}
            <div className="card-darker p-6 opacity-60 cursor-not-allowed relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  COMING SOON
                </span>
              </div>
              <div className="mb-4">
                <Speaker className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Audio Hub</h3>
              <p className="text-sm text-gray-400">
                PA systems, monitors, mixers, mics, and audio processing gear
              </p>
            </div>

            {/* Video Hub - Coming Soon */}
            <div className="card-darker p-6 opacity-60 cursor-not-allowed relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  COMING SOON
                </span>
              </div>
              <div className="mb-4">
                <Monitor className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Video Hub</h3>
              <p className="text-sm text-gray-400">
                LED walls, projectors, cameras, processors, and control systems
              </p>
            </div>

            {/* Backline Hub - Coming Soon */}
            <div className="card-darker p-6 opacity-60 cursor-not-allowed relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  COMING SOON
                </span>
              </div>
              <div className="mb-4">
                <Guitar className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Backline Hub</h3>
              <p className="text-sm text-gray-400">
                Instruments, amplifiers, drums, keyboards, and stage gear
              </p>
            </div>

            {/* Staging Hub - Coming Soon */}
            <div className="card-darker p-6 opacity-60 cursor-not-allowed relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  COMING SOON
                </span>
              </div>
              <div className="mb-4">
                <Construction className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Staging & Rigging</h3>
              <p className="text-sm text-gray-400">
                Truss, stages, lifts, hoists, and structural equipment
              </p>
            </div>

            {/* Power Hub - Coming Soon */}
            <div className="card-darker p-6 opacity-60 cursor-not-allowed relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  COMING SOON
                </span>
              </div>
              <div className="mb-4">
                <Zap className="w-12 h-12 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Power & Distribution</h3>
              <p className="text-sm text-gray-400">
                Generators, distros, cable, transformers, and power systems
              </p>
            </div>

            {/* Crew Hub - Coming Soon */}
            <div className="card-darker p-6 opacity-60 cursor-not-allowed relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  COMING SOON
                </span>
              </div>
              <div className="mb-4">
                <Users className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Crew & Labor</h3>
              <p className="text-sm text-gray-400">
                Local crew services, labor providers, and staffing resources
              </p>
            </div>

            {/* Services Hub - Coming Soon */}
            <div className="card-darker p-6 opacity-60 cursor-not-allowed relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  COMING SOON
                </span>
              </div>
              <div className="mb-4">
                <Boxes className="w-12 h-12 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Production Services</h3>
              <p className="text-sm text-gray-400">
                Transport, freight, warehousing, and logistics services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Built for Production Professionals
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Smart Search
                </h3>
                <p className="text-gray-400">
                  Search across fixtures, manufacturers, and vendors with intelligent filtering and detailed specifications
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Community Driven
                </h3>
                <p className="text-gray-400">
                  Vote on vendor endorsements, share experiences, and help the community find reliable suppliers
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Boxes className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Multi-Department
                </h3>
                <p className="text-gray-400">
                  One platform for all production departments—lighting, audio, video, backline, staging, and more
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="py-16 section-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              On the Roadmap
            </h2>
            <p className="text-gray-400 mb-8">
              Features we're building to make RiderReady even more powerful
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-darker p-6 text-left">
                <h3 className="font-bold text-lg mb-2 text-white">
                  Rider Builder
                </h3>
                <p className="text-gray-400">
                  Create and export professional technical riders with drag-and-drop equipment selection
                </p>
              </div>
              <div className="card-darker p-6 text-left">
                <h3 className="font-bold text-lg mb-2 text-white">
                  Inventory Tracking
                </h3>
                <p className="text-gray-400">
                  Real-time vendor availability and inventory status across multiple cities
                </p>
              </div>
              <div className="card-darker p-6 text-left">
                <h3 className="font-bold text-lg mb-2 text-white">
                  Tour Planning
                </h3>
                <p className="text-gray-400">
                  Plan multi-city tours with vendor availability and routing optimization
                </p>
              </div>
              <div className="card-darker p-6 text-left">
                <h3 className="font-bold text-lg mb-2 text-white">
                  Mobile App
                </h3>
                <p className="text-gray-400">
                  Access RiderReady on the go with native iOS and Android applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
