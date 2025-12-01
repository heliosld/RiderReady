'use client';

import { useQuery } from '@tanstack/react-query';
import { manufacturersApi, fixturesApi } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Building2, 
  Globe, 
  MapPin, 
  ExternalLink,
  Lightbulb
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';

export default function ManufacturerDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // For now, we'll need to get all manufacturers and filter by slug
  // In production, you'd want a getBySlug endpoint
  const { data: manufacturers, isLoading: loadingManufacturer } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: manufacturersApi.getAll,
  });

  const manufacturer = manufacturers?.find((m: any) => m.slug === slug);

  const { data: fixtures, isLoading: loadingFixtures } = useQuery({
    queryKey: ['fixtures', manufacturer?.id],
    queryFn: () => fixturesApi.getAll({ manufacturer_id: manufacturer?.id, limit: 100 }),
    enabled: !!manufacturer?.id,
  });

  if (loadingManufacturer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">Loading manufacturer details...</p>
        </div>
      </div>
    );
  }

  if (!manufacturer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">Manufacturer not found</p>
          <Link href="/manufacturers" className="text-primary-600 hover:underline mt-4 inline-block">
            ← Back to Manufacturers
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
          href="/manufacturers"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Manufacturers
        </Link>

        {/* Header */}
        <div className="bg-dark-secondary rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center p-4 flex-shrink-0">
            <ImageWithFallback
              src={manufacturer.logo_url}
              alt={`${manufacturer.name} logo`}
              className="max-w-full max-h-full object-contain"
              fallbackIcon={<Building2 className="w-16 h-16 text-gray-400" />}
              containerClassName="w-full h-full"
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4 text-white">
              {manufacturer.name}
            </h1>
            
            {manufacturer.description && (
              <p className="text-gray-300 mb-4 text-lg">
                {manufacturer.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              {manufacturer.country && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>{manufacturer.country}</span>
                </div>
              )}
              
              {manufacturer.website && (
                <a
                  href={manufacturer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-amber-500 hover:text-amber-400 hover:underline"
                >
                  <Globe className="w-5 h-5" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Fixtures */}
        <div className="bg-dark-secondary rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            Fixtures by {manufacturer.name}
          </h2>

          {loadingFixtures ? (
            <div className="text-center py-8">
              <p className="text-gray-300">Loading fixtures...</p>
            </div>
          ) : !fixtures?.data || fixtures.data.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No fixtures available from this manufacturer yet
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fixtures.data.map((fixture: any) => (
                <Link
                  key={fixture.id}
                  href={`/fixtures/${fixture.slug}`}
                  className="bg-dark-tertiary rounded-lg overflow-hidden hover:shadow-md transition-shadow border border-gray-700 hover:border-amber-600"
                >
                  <div className="aspect-video bg-white flex items-center justify-center p-4">
                    <ImageWithFallback
                      src={fixture.primary_image_url}
                      alt={fixture.name}
                      className="max-w-full max-h-full object-contain"
                      fallbackIcon={<Lightbulb className="w-12 h-12 text-gray-400" />}
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-white">
                      {fixture.name}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      {fixture.weight_kg && (
                        <span>{fixture.weight_kg} kg</span>
                      )}
                      {fixture.power_consumption_watts && (
                        <span>{fixture.power_consumption_watts}W</span>
                      )}
                    </div>
                    {fixture.fixture_type && (
                      <p className="text-sm text-amber-500 mt-2">
                        {fixture.fixture_type.name}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
