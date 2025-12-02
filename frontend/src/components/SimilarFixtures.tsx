'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';

interface SimilarFixturesProps {
  fixtureId: string;
  fixtureName: string;
  limit?: number;
}

interface SimilarFixture {
  id: string;
  name: string;
  slug: string;
  primary_image_url: string | null;
  manufacturer_name: string;
  manufacturer_slug: string;
  fixture_type_name: string;
  similarity_score: number;
  match_reasons: {
    same_type: boolean;
    same_light_source: boolean;
    similar_brightness: boolean;
    similar_power: boolean;
    has_color_mixing: boolean;
    has_movement: boolean;
  };
  weight_kg: number | null;
  power_consumption_watts: number | null;
  lumens: number | null;
}

export default function SimilarFixtures({ fixtureId, fixtureName, limit = 6 }: SimilarFixturesProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['similar-fixtures', fixtureId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3001/api/v1/similar/fixtures/${fixtureId}/similar?limit=${limit}`
      );
      console.log('Similar fixtures response:', response.data);
      return response.data;
    },
    enabled: !!fixtureId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-dark-secondary border border-gray-700 rounded-lg p-6 mt-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading similar fixtures:', error);
    return (
      <div className="bg-dark-secondary border border-gray-700 rounded-lg p-6 mt-6">
        <div className="text-center text-gray-400">
          <p className="text-sm">Unable to load similar fixtures</p>
        </div>
      </div>
    );
  }

  if (!data || !data.similar || data.similar.length === 0) {
    console.log('No similar fixtures found');
    return (
      <div className="bg-dark-secondary border border-gray-700 rounded-lg p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Lightbulb className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Similar Fixtures</h2>
            <p className="text-sm text-gray-400">No similar fixtures found at this time</p>
          </div>
        </div>
      </div>
    );
  }

  const getMatchBadges = (reasons: SimilarFixture['match_reasons']) => {
    const badges = [];
    if (reasons.same_type) badges.push('Same Type');
    if (reasons.same_light_source) badges.push('Same Light Source');
    if (reasons.similar_brightness) badges.push('Similar Brightness');
    if (reasons.has_color_mixing) badges.push('Color Mixing');
    if (reasons.has_movement) badges.push('Moving Head');
    return badges;
  };

  return (
    <div className="bg-dark-secondary border border-gray-700 rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Lightbulb className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Similar Fixtures</h2>
            <p className="text-sm text-gray-400">Based on specs and capabilities</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>Smart matched</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {data.similar.map((fixture: SimilarFixture) => {
          const matchBadges = getMatchBadges(fixture.match_reasons);
          
          return (
            <Link
              key={fixture.id}
              href={`/fixtures/${fixture.slug}`}
              className="group bg-dark-tertiary border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-all hover:scale-105"
            >
              {/* Image */}
              <div className="aspect-square bg-white flex items-center justify-center relative overflow-hidden">
                {fixture.primary_image_url ? (
                  <img
                    src={fixture.primary_image_url}
                    alt={fixture.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-gray-400 text-xs text-center p-4">No image</div>
                )}
                
                {/* Similarity Score Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600 rounded-full">
                  <span className="text-xs font-bold text-white">
                    {Math.round(fixture.similarity_score)}%
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm text-white mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {fixture.name}
                </h3>
                <p className="text-xs text-gray-400 mb-2">{fixture.manufacturer_name}</p>

                {/* Key Specs */}
                <div className="space-y-1 mb-2">
                  {fixture.lumens && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Lumens:</span>
                      <span className="text-gray-300 font-medium">{fixture.lumens.toLocaleString()}</span>
                    </div>
                  )}
                  {fixture.power_consumption_watts && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Power:</span>
                      <span className="text-gray-300 font-medium">{fixture.power_consumption_watts}W</span>
                    </div>
                  )}
                  {fixture.weight_kg && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Weight:</span>
                      <span className="text-gray-300 font-medium">{fixture.weight_kg}kg</span>
                    </div>
                  )}
                </div>

                {/* Match Reasons */}
                {matchBadges.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-700">
                    {matchBadges.slice(0, 2).map((badge, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded"
                      >
                        {badge}
                      </span>
                    ))}
                    {matchBadges.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded">
                        +{matchBadges.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* View Details Link */}
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between text-xs text-purple-400 group-hover:text-purple-300">
                    <span className="font-medium">View Details</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {data.similar.length >= limit && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Showing top {limit} matches • Scores based on type, brightness, power, features & more
          </p>
        </div>
      )}
    </div>
  );
}
