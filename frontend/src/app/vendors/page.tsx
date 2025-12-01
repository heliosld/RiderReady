'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vendorsApi } from '@/lib/api';
import { MapPin, Globe, Mail, Phone, Search, Filter, X } from 'lucide-react';
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

export default function VendorsPage() {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [vendorTypeFilter, setVendorTypeFilter] = useState('');

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => vendorsApi.getAll({ page: 1, limit: 100 }),
  });

  const { data: locations } = useQuery({
    queryKey: ['vendor-locations'],
    queryFn: () => vendorsApi.getAllLocations(),
  });

  // Get unique countries and vendor types for filters
  const countries = useMemo(() => {
    if (!vendors?.data) return [];
    
    const countriesSet = new Set<string>();
    
    vendors.data.forEach((v: any) => {
      if (v.country) countriesSet.add(v.country);
    });
    
    return Array.from(countriesSet).sort();
  }, [vendors?.data]);

  const vendorTypes = useMemo(() => {
    if (!vendors?.data) return [];
    
    const typesSet = new Set<string>();
    
    vendors.data.forEach((v: any) => {
      if (v.vendor_type) typesSet.add(v.vendor_type);
    });
    
    return Array.from(typesSet).sort();
  }, [vendors?.data]);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    if (!vendors?.data) return [];
    
    return vendors.data.filter((vendor: any) => {
      if (search && !vendor.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (countryFilter && vendor.country !== countryFilter) {
        return false;
      }
      if (vendorTypeFilter && vendor.vendor_type !== vendorTypeFilter) {
        return false;
      }
      return true;
    });
  }, [vendors?.data, search, countryFilter, vendorTypeFilter]);

  // Filter locations based on filtered vendors
  const filteredLocations = useMemo(() => {
    if (!locations) return [];
    const vendorIds = new Set(filteredVendors.map((v: any) => v.id));
    return locations.filter((loc: any) => vendorIds.has(loc.vendor_id));
  }, [locations, filteredVendors]);

  const clearFilters = () => {
    setSearch('');
    setCountryFilter('');
    setVendorTypeFilter('');
  };

  const activeFilterCount = [search, countryFilter, vendorTypeFilter].filter(Boolean).length;

  return (
    <div className="page-wrapper">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Vendors & Rental Houses
      </h1>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <div className="flex items-center gap-2 border border-gray-700 bg-dark-tertiary rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Vendor name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Vendor Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </label>
            <select
              value={vendorTypeFilter}
              onChange={(e) => setVendorTypeFilter(e.target.value)}
              className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-dark-tertiary text-gray-200 text-sm"
            >
              <option value="">All Types</option>
              {vendorTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
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
          Showing {filteredVendors.length} of {vendors?.data.length || 0} vendors
        </div>
      </div>

      {/* Map and List Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Vendor List - Left Side */}
        <div className="lg:w-96 flex-shrink-0">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading vendors...</p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No vendors found</p>
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
              {filteredVendors.map((vendor: any) => (
                <Link
                  key={vendor.id}
                  href={`/vendors/${vendor.slug}`}
                  className="block card-dark p-4 hover:border-amber-600 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-2 text-white">
                    {vendor.name}
                  </h3>

                  <div className="space-y-1 text-xs text-gray-400">
                    {vendor.city && vendor.country && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{vendor.city}, {vendor.country}</span>
                      </div>
                    )}
                    
                    {vendor.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                    )}
                    
                    {vendor.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    
                    {vendor.website && (
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
        {filteredLocations && filteredLocations.length > 0 && (
          <div className="lg:flex-1">
            <AllVendorsMap locations={filteredLocations} height="800px" />
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
