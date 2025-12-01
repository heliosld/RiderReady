'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Building2,
  Calendar,
  Package,
  Globe2
} from 'lucide-react';

// Dynamically import VendorMap to avoid SSR issues with Leaflet
const VendorMap = dynamic(
  () => import('@/components/VendorMap').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="bg-dark-secondary rounded-lg p-8 text-center" style={{ height: '500px' }}>
        <p className="text-gray-400">Loading map...</p>
      </div>
    ),
  }
);

export default function DistributorDetailPage() {
  const params = useParams();
  const slug = params.id as string;

  const { data: distributor, isLoading, error } = useQuery({
    queryKey: ['distributor', slug],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3001/api/v1/distributors/slug/${slug}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">Loading distributor details...</p>
        </div>
      </div>
    );
  }

  if (error || !distributor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">Distributor not found</p>
          <Link href="/distributors" className="text-primary-600 hover:underline mt-4 inline-block">
            ← Back to Distributors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/distributors"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Distributors
        </Link>

        {/* Header */}
        <div className="bg-dark-secondary rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">
                {distributor.name}
              </h1>
              {distributor.distributor_type && (
                <span className="inline-block px-3 py-1 bg-amber-900 text-amber-300 rounded-full text-sm font-medium">
                  {distributor.distributor_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
              )}
            </div>
          </div>

          {distributor.description && (
            <p className="text-gray-300 mb-6">
              {distributor.description}
            </p>
          )}

          {/* Brands Carried */}
          {distributor.brands_carried && distributor.brands_carried.length > 0 && (
            <div className="mb-6 p-4 bg-dark-tertiary rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-white">Brands Represented</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {distributor.brands_carried.map((brand: string) => {
                  // Map brand names to manufacturer slugs or fixture search
                  const brandSlugMap: Record<string, string> = {
                    'ETC': 'etc',
                    'Martin': 'martin',
                    'Chauvet': 'chauvet',
                    'Chauvet Professional': 'chauvet',
                    'Ayrton': 'ayrton',
                    'Robe': 'robe',
                    'GLP': 'glp',
                    'Clay Paky': 'clay-paky',
                    'Claypaky': 'clay-paky',
                  };

                  const slug = brandSlugMap[brand];
                  const href = slug 
                    ? `/manufacturers/${slug}` 
                    : `/fixtures?search=${encodeURIComponent(brand)}`;

                  return (
                    <Link
                      key={brand}
                      href={href}
                      className="px-3 py-1 bg-dark-secondary border border-amber-800 text-amber-400 rounded-full text-sm hover:bg-amber-900 hover:border-amber-600 transition-colors cursor-pointer"
                    >
                      {brand}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Territories Served */}
          {distributor.territories_served && distributor.territories_served.length > 0 && (
            <div className="mb-6 p-4 bg-dark-tertiary rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Globe2 className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-white">Territories Served</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {distributor.territories_served.map((territory: string) => (
                  <span 
                    key={territory}
                    className="px-3 py-1 bg-dark-secondary border border-gray-700 text-gray-300 rounded-full text-sm"
                  >
                    {territory}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {distributor.city && distributor.country && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-semibold text-white">
                    {distributor.address_line1 && <>{distributor.address_line1}<br /></>}
                    {distributor.city}{distributor.state_province ? `, ${distributor.state_province}` : ''} {distributor.postal_code}
                    <br />{distributor.country}
                  </p>
                </div>
              </div>
            )}

            {distributor.website && (
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                  <a 
                    href={distributor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:text-amber-400 hover:underline font-semibold"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            )}

            {distributor.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <a 
                    href={`mailto:${distributor.email}`}
                    className="text-amber-500 hover:text-amber-400 hover:underline font-semibold"
                  >
                    {distributor.email}
                  </a>
                </div>
              </div>
            )}

            {distributor.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <a 
                    href={`tel:${distributor.phone}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline font-semibold"
                  >
                    {distributor.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {distributor.established_year && (
            <div className="flex gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Established {distributor.established_year}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Multiple Locations */}
        {distributor.locations && distributor.locations.length > 0 && (
          <div className="bg-dark-secondary rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary-600" />
              Locations ({distributor.locations.length})
            </h2>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Locations List - Left Side */}
              <div className="lg:w-96 flex-shrink-0 space-y-4 max-h-[600px] overflow-y-auto">
                {distributor.locations.map((location: any) => (
                  <div 
                    key={location.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {location.location_name}
                      </h3>
                      {location.is_headquarters && (
                        <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs font-medium">
                          HQ
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-gray-600 dark:text-gray-400">
                          {location.address_line1 && <>{location.address_line1}<br /></>}
                          {location.address_line2 && <>{location.address_line2}<br /></>}
                          {location.city}{location.state_province ? `, ${location.state_province}` : ''} {location.postal_code}
                          <br />{location.country}
                        </div>
                      </div>

                      {location.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a 
                            href={`tel:${location.phone}`}
                            className="text-primary-600 hover:text-primary-700 hover:underline"
                          >
                            {location.phone}
                          </a>
                        </div>
                      )}

                      {location.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a 
                            href={`mailto:${location.email}`}
                            className="text-primary-600 hover:text-primary-700 hover:underline break-all"
                          >
                            {location.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map View - Right Side */}
              <div className="lg:flex-1">
                <VendorMap 
                  locations={distributor.locations} 
                  vendorName={distributor.name}
                  height="600px"
                  zoom={distributor.locations.length === 1 ? 12 : 4}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
