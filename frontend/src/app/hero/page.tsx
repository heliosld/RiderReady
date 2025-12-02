'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Zap, Eye, Lightbulb, Sparkles, Target } from 'lucide-react';

interface Endorsement {
  upvotes: number;
  downvotes: number;
}

interface Fixture {
  id: string;
  slug: string;
  name: string;
  manufacturer: {
    name: string;
  };
  fixture_type: {
    name: string;
    slug: string;
  };
  primary_image_url?: string;
  endorsements: Endorsement[];
  total_lumens?: number;
}

interface CategoryData {
  name: string;
  slug: string;
  icon: any;
  description: string;
  fixtures: Fixture[];
}

const categoryConfig = [
  { slug: 'spot', name: 'Moving Head Spots', icon: Target, description: 'Precision beam control with gobos and effects' },
  { slug: 'wash', name: 'Moving Head Washes', icon: Lightbulb, description: 'Smooth color mixing and wide coverage' },
  { slug: 'beam', name: 'Moving Head Beams', icon: Zap, description: 'Intense parallel beams for dramatic effects' },
  { slug: 'profile', name: 'Profile Fixtures', icon: Eye, description: 'Sharp edges and precise shuttering' },
  { slug: 'hybrid', name: 'Hybrid Fixtures', icon: Sparkles, description: 'Versatile spot, beam, and wash combinations' },
];

export default function HeroPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopFixtures = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        
        // Load all fixtures
        const response = await fetch(`${apiBase}/fixtures?limit=100`);
        if (!response.ok) throw new Error('Failed to load fixtures');
        
        const data = await response.json();
        const allFixtures = data.data;

        // Group by fixture type and calculate ratings
        const fixturesByType = allFixtures.reduce((acc: any, fixture: Fixture) => {
          const typeSlug = fixture.fixture_type.slug;
          if (!acc[typeSlug]) acc[typeSlug] = [];
          
          // Calculate approval rating
          const totalUpvotes = fixture.endorsements?.reduce((sum, e) => sum + e.upvotes, 0) || 0;
          const totalDownvotes = fixture.endorsements?.reduce((sum, e) => sum + e.downvotes, 0) || 0;
          const totalVotes = totalUpvotes + totalDownvotes;
          const rating = totalVotes > 0 ? (totalUpvotes / totalVotes) : 0;
          
          acc[typeSlug].push({ ...fixture, rating, totalUpvotes, totalDownvotes });
          return acc;
        }, {});

        // Get top 5 for each category
        const categoryData = categoryConfig.map(config => {
          const fixtures = (fixturesByType[config.slug] || [])
            .sort((a: any, b: any) => b.rating - a.rating)
            .slice(0, 5);
          
          return {
            ...config,
            fixtures
          };
        }).filter(cat => cat.fixtures.length > 0);

        setCategories(categoryData);
      } catch (error) {
        console.error('Error loading fixtures:', error);
        setError(error instanceof Error ? error.message : 'Failed to load fixtures');
      } finally {
        setLoading(false);
      }
    };

    loadTopFixtures();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading top-rated fixtures...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-4">Error loading fixtures</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-gray-900 to-dark-primary border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Top-Rated Fixtures
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the highest-rated automated lighting fixtures in each category, 
            ranked by the professional lighting community.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <div key={category.slug} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Icon className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                  <p className="text-gray-400 mt-1">{category.description}</p>
                </div>
              </div>

              {/* Fixtures List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.fixtures.map((fixture: any, index: number) => {
                  const totalVotes = fixture.totalUpvotes + fixture.totalDownvotes;
                  const approvalPercent = Math.round(fixture.rating * 100);
                  const isWinner = index === 0;
                  
                  return (
                    <Link
                      key={fixture.id}
                      href={`/fixtures/${fixture.slug}`}
                      className={`group bg-dark-secondary rounded-lg p-4 border transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 ${
                        isWinner ? 'border-amber-500/50 hover:border-amber-500' : 'border-gray-700/50 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-8 flex items-center justify-center">
                          <span className={`text-2xl font-bold ${
                            index === 0 ? 'text-amber-500' :
                            index === 1 ? 'text-gray-400' :
                            index === 2 ? 'text-orange-700' :
                            'text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                        </div>

                        {/* Image - only for #1 */}
                        {isWinner && (
                          <div className="flex-shrink-0">
                            <div className="relative w-20 h-24 bg-white rounded-lg overflow-hidden">
                              {fixture.primary_image_url ? (
                                <Image
                                  src={fixture.primary_image_url}
                                  alt={fixture.name}
                                  fill
                                  className="object-contain p-1"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">
                            {fixture.name}
                          </h3>
                          <p className="text-gray-400 text-sm">{fixture.manufacturer.name}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex-shrink-0 text-right">
                          <div className="text-2xl font-bold text-emerald-400">
                            {approvalPercent}%
                          </div>
                          <div className="text-xs text-gray-600">
                            {fixture.totalUpvotes}↑ {fixture.totalDownvotes}↓
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>


            </div>
          );
        })}
      </div>

      {/* Best by Endorsement Category */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-800">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-3">Best by Feature</h2>
          <p className="text-gray-400">Top-rated fixtures for specific performance characteristics</p>
        </div>

        <EndorsementLeaders allFixtures={categories.flatMap(c => c.fixtures)} />
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center border-t border-gray-800">
        <Link
          href="/fixtures"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
        >
          Browse All Fixtures
        </Link>
      </div>
    </div>
  );
}

function EndorsementLeaders({ allFixtures }: { allFixtures: any[] }) {
  const [endorsementLeaders, setEndorsementLeaders] = useState<any[]>([]);

  useEffect(() => {
    // Collect all unique endorsement categories
    const categoryMap = new Map();

    allFixtures.forEach(fixture => {
      fixture.endorsements?.forEach((endorsement: any) => {
        const key = endorsement.slug;
        const rating = endorsement.upvotes / (endorsement.upvotes + endorsement.downvotes || 1);
        
        if (!categoryMap.has(key) || categoryMap.get(key).rating < rating) {
          categoryMap.set(key, {
            categoryName: endorsement.name,
            categorySlug: key,
            fixture: fixture,
            rating: rating,
            upvotes: endorsement.upvotes,
            downvotes: endorsement.downvotes
          });
        }
      });
    });

    const leaders = Array.from(categoryMap.values())
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName));

    setEndorsementLeaders(leaders);
  }, [allFixtures]);

  if (endorsementLeaders.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {endorsementLeaders.map((leader, idx) => {
        const approvalPercent = Math.round(leader.rating * 100);
        
        return (
          <Link
            key={idx}
            href={`/fixtures/${leader.fixture.slug}`}
            className="group bg-dark-secondary rounded-lg p-4 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-amber-500 uppercase mb-1">
                  {leader.categoryName}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-500 transition-colors truncate">
                  {leader.fixture.name}
                </h3>
                <p className="text-xs text-gray-500 truncate">{leader.fixture.manufacturer.name}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-xl font-bold text-emerald-400">
                  {approvalPercent}%
                </div>
                <div className="text-xs text-gray-600">
                  {leader.upvotes}↑
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
