'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fixturesApi, manufacturersApi, type Fixture } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Zap, Lightbulb, Palette, Eye, ThumbsUp, ThumbsDown, GitCompare } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import CertifiedBadge from '@/components/CertifiedBadge';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function FixturesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [manufacturerId, setManufacturerId] = useState('');
  const [fixtureType, setFixtureType] = useState('');
  const [lightSource, setLightSource] = useState('');
  const [colorMixing, setColorMixing] = useState('');
  const [minPower, setMinPower] = useState('');
  const [maxPower, setMaxPower] = useState('');
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [hasGobo, setHasGobo] = useState<boolean | null>(null);
  const [hasPrism, setHasPrism] = useState<boolean | null>(null);
  const [hasIris, setHasIris] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState('name-asc');
  const [useImperial, setUseImperial] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Load unit preference from localStorage
  useEffect(() => {
    const savedPref = localStorage.getItem('riderready-unit-preference');
    if (savedPref === 'imperial') {
      setUseImperial(true);
    }
  }, []);

  // Save unit preference to localStorage
  const toggleUnits = () => {
    const newValue = !useImperial;
    setUseImperial(newValue);
    localStorage.setItem('riderready-unit-preference', newValue ? 'imperial' : 'metric');
  };

  const { 
    data: fixtures, 
    isLoading: fixturesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['fixtures', search, manufacturerId],
    queryFn: ({ pageParam = 1 }) => fixturesApi.getAll({ 
      page: pageParam, 
      limit: 30, 
      search: search || undefined,
      manufacturer_id: manufacturerId || undefined 
    }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { data: manufacturers } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: manufacturersApi.getAll,
  });

  // Fetch certified fixtures
  const { data: certifiedFixtures } = useQuery({
    queryKey: ['certified-fixtures'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/api/v1/endorsement-issues/certified');
      return response.data.certified;
    },
  });

  // Flatten all pages of fixtures
  const allFixtures = fixtures?.pages.flatMap(page => page.data) || [];

  // Apply filters EXCEPT power and weight to get the base filtered set for range calculation
  const baseFilteredFixtures = allFixtures.filter((fixture: Fixture) => {
    if (fixtureType && fixture.fixture_type?.slug !== fixtureType) return false;
    if (lightSource && fixture.light_source_type?.toLowerCase() !== lightSource.toLowerCase()) return false;
    if (colorMixing && fixture.color_mixing_type?.toLowerCase() !== colorMixing.toLowerCase()) return false;
    if (hasGobo !== null && (fixture.gobo_wheels_count || 0) > 0 !== hasGobo) return false;
    if (hasPrism !== null && fixture.prism !== hasPrism) return false;
    if (hasIris !== null && fixture.iris !== hasIris) return false;
    return true;
  });

  // Calculate actual ranges from filtered data (excluding power/weight filters)
  const powerRange = baseFilteredFixtures.reduce((acc, f) => {
    if (f.power_consumption_watts) {
      return {
        min: Math.min(acc.min, f.power_consumption_watts),
        max: Math.max(acc.max, f.power_consumption_watts)
      };
    }
    return acc;
  }, { min: Infinity, max: 0 });

  const weightRange = baseFilteredFixtures.reduce((acc, f) => {
    if (f.weight_kg) {
      const weight = useImperial ? f.weight_lbs || (f.weight_kg * 2.20462) : f.weight_kg;
      return {
        min: Math.min(acc.min, weight),
        max: Math.max(acc.max, weight)
      };
    }
    return acc;
  }, { min: Infinity, max: 0 });

  // Round ranges to nice numbers and ensure valid bounds
  const minPowerBound = powerRange.min === Infinity ? 0 : Math.floor(powerRange.min / 50) * 50;
  const maxPowerBound = powerRange.max === 0 ? 1000 : Math.ceil(powerRange.max / 100) * 100;
  const minWeightBound = weightRange.min === Infinity ? 0 : Math.floor(weightRange.min / (useImperial ? 5 : 1)) * (useImperial ? 5 : 1);
  const maxWeightBound = weightRange.max === 0 ? (useImperial ? 100 : 50) : Math.ceil(weightRange.max / (useImperial ? 10 : 5)) * (useImperial ? 10 : 5);

  // Apply all filters including power and weight
  const filteredFixtures = baseFilteredFixtures.filter((fixture: Fixture) => {
    if (minPower && fixture.power_consumption_watts && fixture.power_consumption_watts < parseInt(minPower)) return false;
    if (maxPower && fixture.power_consumption_watts && fixture.power_consumption_watts > parseInt(maxPower)) return false;
    
    // Weight filtering - convert to the correct unit for comparison
    if (minWeight || maxWeight) {
      if (!fixture.weight_kg) return false;
      const fixtureWeight = useImperial ? (fixture.weight_lbs || fixture.weight_kg * 2.20462) : fixture.weight_kg;
      if (minWeight && fixtureWeight < parseFloat(minWeight)) return false;
      if (maxWeight && fixtureWeight > parseFloat(maxWeight)) return false;
    }
    
    if (hasGobo !== null && (fixture.gobo_wheels_count || 0) > 0 !== hasGobo) return false;
    if (hasPrism !== null && fixture.prism !== hasPrism) return false;
    if (hasIris !== null && fixture.iris !== hasIris) return false;
    return true;
  });

  // Sort fixtures
  const sortedFixtures = [...filteredFixtures].sort((a, b) => {
    switch (sortBy) {
      case 'rating-desc': {
        // Calculate approval ratings
        const aUpvotes = a.endorsements?.reduce((sum: number, e: any) => sum + (e.upvotes || 0), 0) || 0;
        const aDownvotes = a.endorsements?.reduce((sum: number, e: any) => sum + (e.downvotes || 0), 0) || 0;
        const aTotalVotes = aUpvotes + aDownvotes;
        const aRating = aTotalVotes > 0 ? (aUpvotes / aTotalVotes) * 100 : -1;
        
        const bUpvotes = b.endorsements?.reduce((sum: number, e: any) => sum + (e.upvotes || 0), 0) || 0;
        const bDownvotes = b.endorsements?.reduce((sum: number, e: any) => sum + (e.downvotes || 0), 0) || 0;
        const bTotalVotes = bUpvotes + bDownvotes;
        const bRating = bTotalVotes > 0 ? (bUpvotes / bTotalVotes) * 100 : -1;
        
        return bRating - aRating; // Higher rating first
      }
      case 'rating-asc': {
        // Calculate approval ratings
        const aUpvotes = a.endorsements?.reduce((sum: number, e: any) => sum + (e.upvotes || 0), 0) || 0;
        const aDownvotes = a.endorsements?.reduce((sum: number, e: any) => sum + (e.downvotes || 0), 0) || 0;
        const aTotalVotes = aUpvotes + aDownvotes;
        const aRating = aTotalVotes > 0 ? (aUpvotes / aTotalVotes) * 100 : 101; // Put unrated at end
        
        const bUpvotes = b.endorsements?.reduce((sum: number, e: any) => sum + (e.upvotes || 0), 0) || 0;
        const bDownvotes = b.endorsements?.reduce((sum: number, e: any) => sum + (e.downvotes || 0), 0) || 0;
        const bTotalVotes = bUpvotes + bDownvotes;
        const bRating = bTotalVotes > 0 ? (bUpvotes / bTotalVotes) * 100 : 101; // Put unrated at end
        
        return aRating - bRating; // Lower rating first
      }
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'manufacturer-asc':
        return (a.manufacturer?.name || '').localeCompare(b.manufacturer?.name || '');
      case 'manufacturer-desc':
        return (b.manufacturer?.name || '').localeCompare(a.manufacturer?.name || '');
      case 'power-asc':
        return (a.power_consumption_watts || 0) - (b.power_consumption_watts || 0);
      case 'power-desc':
        return (b.power_consumption_watts || 0) - (a.power_consumption_watts || 0);
      case 'weight-asc':
        return (a.weight_kg || 0) - (b.weight_kg || 0);
      case 'weight-desc':
        return (b.weight_kg || 0) - (a.weight_kg || 0);
      case 'lumens-asc':
        return (a.total_lumens || 0) - (b.total_lumens || 0);
      case 'lumens-desc':
        return (b.total_lumens || 0) - (a.total_lumens || 0);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearch('');
    setManufacturerId('');
    setFixtureType('');
    setLightSource('');
    setColorMixing('');
    setMinPower('');
    setMaxPower('');
    setMinWeight('');
    setMaxWeight('');
    setHasGobo(null);
    setHasPrism(null);
    setHasIris(null);
  };

  const activeFilterCount = [
    search, manufacturerId, fixtureType, lightSource, colorMixing,
    minPower, maxPower, minWeight, maxWeight,
    hasGobo !== null, hasPrism !== null, hasIris !== null
  ].filter(Boolean).length;

  return (
    <div className="page-wrapper">
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Automated Lighting Fixtures
          </h1>
          <Link href="/hero" className="inline-flex items-center gap-2 mt-2 text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors">
            <span>★</span>
            View Best-in-Class Fixtures
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {selectedForCompare.length > 0 && (
            <button
              onClick={() => router.push(`/fixtures/compare?fixtures=${selectedForCompare.join(',')}`)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <GitCompare className="w-4 h-4" />
              Compare ({selectedForCompare.length})
            </button>
          )}
          <button
            onClick={toggleUnits}
            className="px-3 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            title="Toggle between metric and imperial units"
          >
            {useImperial ? 'lbs' : 'kg'}
          </button>
          <label className="text-sm font-medium text-gray-300">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-700 rounded-lg px-4 py-2 bg-dark-secondary text-gray-200 text-sm min-w-[200px]"
          >
            <option value="rating-desc">Rating (Highest First)</option>
            <option value="rating-asc">Rating (Lowest First)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="manufacturer-asc">Manufacturer (A-Z)</option>
            <option value="manufacturer-desc">Manufacturer (Z-A)</option>
            <option value="power-asc">Power (Low to High)</option>
            <option value="power-desc">Power (High to Low)</option>
            <option value="weight-asc">Weight (Light to Heavy)</option>
            <option value="weight-desc">Weight (Heavy to Light)</option>
            <option value="lumens-asc">Brightness (Low to High)</option>
            <option value="lumens-desc">Brightness (High to Low)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className="w-80 flex-shrink-0">
          <div className="card-dark p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-white">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="bg-amber-600 text-black text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-400 hover:text-amber-400 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search
              </label>
              <div className="flex items-center gap-2 border border-gray-700 rounded-lg px-3 py-2 bg-dark-tertiary">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Fixture name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Manufacturer */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Manufacturer
              </label>
              <select
                value={manufacturerId}
                onChange={(e) => setManufacturerId(e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-dark-tertiary text-gray-200 text-sm"
              >
                <option value="">All Manufacturers</option>
                {manufacturers?.map((mfr: any) => (
                  <option key={mfr.id} value={mfr.id}>
                    {mfr.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fixture Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lightbulb className="w-4 h-4 inline mr-1" />
                Fixture Type
              </label>
              <select
                value={fixtureType}
                onChange={(e) => setFixtureType(e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-dark-tertiary text-gray-200 text-sm"
              >
                <option value="">All Types</option>
                <optgroup label="Moving Head">
                  <option value="spot">Spot</option>
                  <option value="wash">Wash</option>
                  <option value="beam">Beam</option>
                  <option value="profile">Profile</option>
                  <option value="hybrid">Hybrid</option>
                </optgroup>
                <optgroup label="Scanner">
                  <option value="scanner">Scanner</option>
                </optgroup>
                <optgroup label="Static">
                  <option value="led-par">LED Par</option>
                  <option value="led-strip">LED Strip</option>
                  <option value="blinder">Blinder</option>
                </optgroup>
              </select>
            </div>

            {/* Light Source */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Zap className="w-4 h-4 inline mr-1" />
                Light Source
              </label>
              <select
                value={lightSource}
                onChange={(e) => setLightSource(e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-dark-tertiary text-gray-200 text-sm"
              >
                <option value="">All Sources</option>
                <option value="led">LED</option>
                <option value="discharge">Discharge</option>
                <option value="halogen">Halogen</option>
                <option value="laser">Laser</option>
              </select>
            </div>

            {/* Color Mixing */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Palette className="w-4 h-4 inline mr-1" />
                Color Mixing
              </label>
              <select
                value={colorMixing}
                onChange={(e) => setColorMixing(e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-dark-tertiary text-gray-200 text-sm"
              >
                <option value="">All Types</option>
                <option value="cmy">CMY</option>
                <option value="rgb">RGB</option>
                <option value="rgbw">RGBW</option>
                <option value="rgba">RGBA</option>
                <option value="rgbma">RGBMA</option>
              </select>
            </div>

            {/* Power Consumption */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Power Consumption (W)
              </label>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{minPower || minPowerBound} W</span>
                  <span>{maxPower || maxPowerBound} W</span>
                </div>
                <div className="relative h-2">
                  {/* Track */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-700 rounded"></div>
                  {/* Active range */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-1 bg-amber-600 rounded"
                    style={{
                      left: `${((parseInt(minPower) || minPowerBound) - minPowerBound) / (maxPowerBound - minPowerBound) * 100}%`,
                      right: `${100 - ((parseInt(maxPower) || maxPowerBound) - minPowerBound) / (maxPowerBound - minPowerBound) * 100}%`
                    }}
                  ></div>
                  {/* Min slider */}
                  <input
                    type="range"
                    min={minPowerBound}
                    max={maxPowerBound}
                    step="50"
                    value={minPower || minPowerBound}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (maxPower && parseInt(val) > parseInt(maxPower)) {
                        setMinPower(maxPower);
                      } else {
                        setMinPower(val === String(minPowerBound) ? '' : val);
                      }
                    }}
                    className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-900"
                  />
                  {/* Max slider */}
                  <input
                    type="range"
                    min={minPowerBound}
                    max={maxPowerBound}
                    step="50"
                    value={maxPower || maxPowerBound}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (minPower && parseInt(val) < parseInt(minPower)) {
                        setMaxPower(minPower);
                      } else {
                        setMaxPower(val === String(maxPowerBound) ? '' : val);
                      }
                    }}
                    className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Weight */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Weight ({useImperial ? 'lbs' : 'kg'})
              </label>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{minWeight || minWeightBound} {useImperial ? 'lbs' : 'kg'}</span>
                  <span>{maxWeight || maxWeightBound} {useImperial ? 'lbs' : 'kg'}</span>
                </div>
                <div className="relative h-2">
                  {/* Track */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-700 rounded"></div>
                  {/* Active range */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-1 bg-amber-600 rounded"
                    style={{
                      left: `${((parseFloat(minWeight) || minWeightBound) - minWeightBound) / (maxWeightBound - minWeightBound) * 100}%`,
                      right: `${100 - ((parseFloat(maxWeight) || maxWeightBound) - minWeightBound) / (maxWeightBound - minWeightBound) * 100}%`
                    }}
                  ></div>
                  {/* Min slider */}
                  <input
                    type="range"
                    min={minWeightBound}
                    max={maxWeightBound}
                    step={useImperial ? '5' : '1'}
                    value={minWeight || minWeightBound}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (maxWeight && parseFloat(val) > parseFloat(maxWeight)) {
                        setMinWeight(maxWeight);
                      } else {
                        setMinWeight(val === String(minWeightBound) ? '' : val);
                      }
                    }}
                    className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-900"
                  />
                  {/* Max slider */}
                  <input
                    type="range"
                    min={minWeightBound}
                    max={maxWeightBound}
                    step={useImperial ? '5' : '1'}
                    value={maxWeight || maxWeightBound}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (minWeight && parseFloat(val) < parseFloat(minWeight)) {
                        setMaxWeight(minWeight);
                      } else {
                        setMaxWeight(val === String(maxWeightBound) ? '' : val);
                      }
                    }}
                    className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Feature Filters */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Eye className="w-4 h-4 inline mr-1" />
                Features
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hasGobo === true}
                    onChange={(e) => setHasGobo(e.target.checked ? true : null)}
                    className="rounded accent-amber-600"
                  />
                  <span className="text-gray-300">Has Gobos</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hasPrism === true}
                    onChange={(e) => setHasPrism(e.target.checked ? true : null)}
                    className="rounded accent-amber-600"
                  />
                  <span className="text-gray-300">Has Prism</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hasIris === true}
                    onChange={(e) => setHasIris(e.target.checked ? true : null)}
                    className="rounded accent-amber-600"
                  />
                  <span className="text-gray-300">Has Iris</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">

          {/* Results */}
          {fixturesLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading fixtures...</p>
            </div>
          ) : !sortedFixtures || sortedFixtures.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No fixtures found</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-amber-500 hover:text-amber-400 text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                  Showing {sortedFixtures.length} fixture{sortedFixtures.length !== 1 ? 's' : ''}
                  {hasNextPage && ' (scroll for more)'}
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
                {sortedFixtures.map((fixture: Fixture) => {
                  const isCertified = certifiedFixtures?.some((cert: any) => cert.fixture_id === fixture.id);
                  
                  // Calculate overall endorsement percentage
                  const totalUpvotes = fixture.endorsements?.reduce((sum: number, e: any) => sum + (e.upvotes || 0), 0) || 0;
                  const totalDownvotes = fixture.endorsements?.reduce((sum: number, e: any) => sum + (e.downvotes || 0), 0) || 0;
                  const totalVotes = totalUpvotes + totalDownvotes;
                  const approvalPercent = totalVotes > 0 ? Math.round((totalUpvotes / totalVotes) * 100) : null;

                  const isSelected = selectedForCompare.includes(fixture.id);
                  
                  return (
              <div
                key={fixture.id}
                className="card-dark hover:border-amber-600 transition-all overflow-hidden flex flex-col group relative"
              >
                {/* Compare Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (isSelected) {
                        setSelectedForCompare(selectedForCompare.filter(id => id !== fixture.id));
                      } else {
                        if (selectedForCompare.length < 5) {
                          setSelectedForCompare([...selectedForCompare, fixture.id]);
                        }
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 rounded accent-amber-600 cursor-pointer"
                    title="Select for comparison"
                  />
                </div>
                
                <Link href={`/fixtures/${fixture.slug}`} className="flex flex-col flex-1">
                  <div className="aspect-[3/4] bg-white flex items-center justify-center overflow-hidden p-4 relative">
                    {isCertified && (
                      <div className="absolute top-2 right-2 z-10">
                        <CertifiedBadge size="sm" />
                      </div>
                    )}
                    <ImageWithFallback
                      src={fixture.primary_image_url}
                      alt={fixture.name}
                      className="w-full h-full object-contain"
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <p className="text-xs text-amber-500 font-medium mb-1">
                      {fixture.manufacturer.name}
                    </p>
                    <h3 className="font-bold text-sm mb-2 text-white line-clamp-2 flex-1 group-hover:text-amber-400 transition-colors">
                      {fixture.name}
                    </h3>
                  
                  {/* Endorsement Rating */}
                  {approvalPercent !== null && (
                    <div className="flex items-center gap-1 mb-2 text-xs">
                      <ThumbsUp className={`w-3 h-3 ${
                        approvalPercent >= 95 ? 'text-green-300' :
                        approvalPercent >= 75 ? 'text-green-500' :
                        approvalPercent >= 60 ? 'text-amber-500' :
                        'text-red-500'
                      }`} />
                      <span className={`font-bold ${
                        approvalPercent >= 95 ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-300 drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]' :
                        approvalPercent >= 75 ? 'text-green-400' :
                        approvalPercent >= 60 ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                        {approvalPercent}%
                      </span>
                      <span className="text-gray-500">({totalVotes})</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1 text-xs text-gray-400">
                    {fixture.weight_kg && (
                      <span>
                        {useImperial 
                          ? `${fixture.weight_lbs || (fixture.weight_kg * 2.20462).toFixed(1)} lbs`
                          : `${fixture.weight_kg} kg`
                        }
                      </span>
                    )}
                    {fixture.power_consumption_watts && (
                      <span>{fixture.power_consumption_watts}W</span>
                    )}
                  </div>
                </div>
              </Link>
              </div>
                  );
                })}
              </div>

              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isFetchingNextPage && (
                  <div className="text-gray-400">Loading more fixtures...</div>
                )}
                {!hasNextPage && filteredFixtures.length > 0 && (
                  <div className="text-gray-500 text-sm">All fixtures loaded</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
