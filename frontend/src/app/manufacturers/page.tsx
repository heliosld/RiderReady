'use client';

import { useQuery } from '@tanstack/react-query';
import { manufacturersApi } from '@/lib/api';
import Link from 'next/link';
import { Building2, Globe, MapPin } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';

export default function ManufacturersPage() {
  const { data: manufacturers, isLoading } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: manufacturersApi.getAll,
  });

  return (
    <div className="page-wrapper">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white">
          Manufacturers
        </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-300">Loading manufacturers...</p>
          </div>
        ) : !manufacturers || manufacturers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300">No manufacturers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {manufacturers.map((manufacturer: any) => (
              <Link
                key={manufacturer.id}
                href={`/manufacturers/${manufacturer.slug}`}
                className="card-dark hover:border-amber-600 transition-all group flex flex-col overflow-hidden"
              >
                <div className="w-full aspect-[3/4] bg-white flex items-center justify-center p-6">
                  <ImageWithFallback
                    src={manufacturer.logo_url}
                    alt={`${manufacturer.name} logo`}
                    className="max-w-full max-h-full object-contain"
                    fallbackIcon={<Building2 className="w-16 h-16 text-gray-400" />}
                    containerClassName="w-full h-full"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-base mb-2 text-white group-hover:text-amber-500">
                    {manufacturer.name}
                  </h3>
                  
                  <div className="flex flex-col gap-2 text-xs text-gray-400 mt-auto">
                    {manufacturer.country && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{manufacturer.country}</span>
                      </div>
                    )}
                    
                    {manufacturer.fixture_count > 0 && (
                      <p className="text-amber-500 font-medium">
                        {manufacturer.fixture_count} fixture{manufacturer.fixture_count !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
