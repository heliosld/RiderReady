'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MapPin, Globe, Mail, Phone, Search, Filter, X, Package } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const AllVendorsMap = dynamic(
  () => import('@/components/AllVendorsMap').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="bg-dark-secondary rounded-lg p-8 text-center" style={{ height: '600px' }}>
        <p className="text-gray-400">Loading map...</p>
      </div>
    ),
  }
);

export default function DistributorsPage() {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const { data: distributors, isLoading } = useQuery({
    queryKey: ['distributors'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/api/v1/distributors?limit=100');
      return response.data;
    },
  });

  const { data: locations } = useQuery({
    queryKey: ['distributor-locations'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/api/v1/distributors/locations');
      return response.data;
    },
  });

  // Get unique countries for filters
  const countries = useMemo(() => {
    if (!distributors?.data) return [];
    
    const countriesSet = new Set<string>();
    
    distributors.data.forEach((d: any) => {
      if (d.country) countriesSet.add(d.country);
    });
    
    return Array.from(countriesSet).sort();
  }, [distributors?.data]);

  // Filter distributors
  const filteredDistributors = useMemo(() => {
    if (!distributors?.data) return [];
    
    return distributors.data.filter((distributor: any) => {
      if (search && !distributor.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (countryFilter && distributor.country !== countryFilter) {
        return false;
      }
      return true;
    });
  }, [distributors?.data, search, countryFilter]);

  // Filter locations based on filtered distributors
  const filteredLocations = useMemo(() => {
    if (!locations) return [];
    const distributorIds = new Set(filteredDistributors.map((d: any) => d.id));
    return locations.filter((loc: any) => distributorIds.has(loc.distributor_id));
  }, [locations, filteredDistributors]);

  const clearFilters = () => {
    setSearch('');
    setCountryFilter('');
  };

  const activeFilterCount = [search, countryFilter].filter(Boolean).length;

  return (
    <div className="page-wrapper">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-white">
        Distributors & Dealers
      </h1>
      <p className="text-gray-400 mb-8">
        Find authorized distributors and dealers for entertainment production equipment
      </p>

      {/* Filters */}
      <div className="card-dark p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <div className="flex items-center gap-2 border border-gray-700 bg-dark-tertiary rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Distributor name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-dark-tertiary text-gray-200 text-sm"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredDistributors.length} of {distributors?.data.length || 0} distributors
        </div>
      </div>

      {/* Map and List Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Distributor List - Left Side */}
        <div className="lg:w-96 flex-shrink-0">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading distributors...</p>
            </div>
          ) : filteredDistributors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No distributors found</p>
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
            <div className="space-y-3 max-h-[800px] overflow-y-auto">
              {filteredDistributors.map((distributor: any) => (
                <Link
                  key={distributor.id}
                  href={`/distributors/${distributor.slug}`}
                  className="block card-dark p-4 hover:border-amber-600 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-2 text-white">
                    {distributor.name}
                  </h3>

                  {distributor.brands_carried && distributor.brands_carried.length > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <Package className="w-3 h-3 text-amber-500" />
                      <span className="text-xs text-amber-500">
                        {distributor.brands_carried.slice(0, 3).join(', ')}
                        {distributor.brands_carried.length > 3 && ` +${distributor.brands_carried.length - 3} more`}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1 text-xs text-gray-400">
                    {distributor.city && distributor.country && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{distributor.city}, {distributor.country}</span>
                      </div>
                    )}
                    
                    {distributor.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{distributor.email}</span>
                      </div>
                    )}
                    
                    {distributor.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{distributor.phone}</span>
                      </div>
                    )}
                    
                    {distributor.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span className="text-amber-500 hover:text-amber-400">
                          Website
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Map Section - Right Side */}
        <div className="lg:flex-1">
          {filteredLocations && filteredLocations.length > 0 ? (
            <AllVendorsMap 
              locations={filteredLocations.map((loc: any) => ({
                id: loc.id,
                vendor_id: loc.distributor_id,
                vendor_name: loc.distributor_name,
                vendor_slug: loc.distributor_slug,
                location_name: loc.location_name,
                is_headquarters: loc.is_headquarters,
                latitude: loc.latitude,
                longitude: loc.longitude,
                address_line1: loc.address_line1,
                city: loc.city,
                state_province: loc.state_province,
                country: loc.country,
                postal_code: loc.postal_code,
                phone: loc.phone,
                email: loc.email
              }))} 
              height="800px" 
            />
          ) : (
            <div className="bg-dark-secondary rounded-lg p-8 text-center" style={{ height: '800px' }}>
              <p className="text-gray-400">No locations to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
