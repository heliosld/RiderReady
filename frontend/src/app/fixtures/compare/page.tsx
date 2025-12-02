'use client';

import { useQuery } from '@tanstack/react-query';
import { fixturesApi, type Fixture } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Minus } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ImageWithFallback';

export default function CompareFixturesPage() {
  const searchParams = useSearchParams();
  const fixtureIds = searchParams.get('fixtures')?.split(',') || [];
  
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFixtures() {
      if (fixtureIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // First get basic fixture data to get slugs
        const basicFixtures = await Promise.all(
          fixtureIds.map(id => fixturesApi.getById(id))
        );
        
        // Then fetch full data with endorsements using slugs
        const loadedFixtures = await Promise.all(
          basicFixtures.map(f => fixturesApi.getBySlug(f.slug))
        );
        setFixtures(loadedFixtures);
      } catch (error) {
        console.error('Error loading fixtures:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFixtures();
  }, [fixtureIds.join(',')]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          <div className="text-center text-gray-400">Loading fixtures...</div>
        </div>
      </div>
    );
  }

  if (fixtures.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          <Link 
            href="/fixtures"
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Fixtures
          </Link>
          <div className="text-center text-gray-400">
            No fixtures selected for comparison. Please select fixtures from the fixtures page.
          </div>
        </div>
      </div>
    );
  }

  // Helper function to render comparison cell
  const CompareCell = ({ value, highlight = false }: { value: any; highlight?: boolean }) => {
    if (value === null || value === undefined) {
      return <td className="px-4 py-3 text-center text-gray-500 border-r border-gray-700/30 last:border-r-0"><Minus className="w-4 h-4 inline" /></td>;
    }
    if (typeof value === 'boolean') {
      return (
        <td className={`px-4 py-3 text-center border-r border-gray-700/30 last:border-r-0 ${highlight ? 'bg-gray-700/30' : ''}`}>
          {value ? <Check className="w-5 h-5 text-gray-400 inline" /> : <Minus className="w-5 h-5 text-gray-500 inline" />}
        </td>
      );
    }
    return (
      <td className={`px-4 py-3 text-center text-gray-300 border-r border-gray-700/30 last:border-r-0 ${highlight ? 'bg-gray-700/30 font-semibold text-white' : ''}`}>
        {value}
      </td>
    );
  };

  // Calculate approval percentages for each fixture
  const fixtureRatings = fixtures.map(fixture => {
    const upvotes = fixture.endorsements?.reduce((sum: number, e: any) => sum + (e.upvotes || 0), 0) || 0;
    const downvotes = fixture.endorsements?.reduce((sum: number, e: any) => sum + (e.downvotes || 0), 0) || 0;
    const totalVotes = upvotes + downvotes;
    return totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0;
  });

  const maxRating = Math.max(...fixtureRatings);

  // Determine which features are relevant based on fixture types
  const hasAnyGobos = fixtures.some(f => (f.rotating_gobos_count || 0) > 0 || (f.static_gobos_count || 0) > 0);
  const hasAnyPrism = fixtures.some(f => f.prism);
  const hasAnyIris = fixtures.some(f => f.iris);

  return (
    <div className="page-wrapper">
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <Link 
          href="/fixtures"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fixtures
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-white">
          Compare Fixtures ({fixtures.length})
        </h1>

        <div className="card-dark overflow-x-auto shadow-xl">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-600 bg-gray-800/80">
                <th className="px-4 py-4 text-left text-gray-300 font-semibold w-48 sticky left-0 bg-gray-800 z-10 border-r border-gray-700">
                  Specification
                </th>
                {fixtures.map((fixture) => (
                  <th key={fixture.id} className="px-4 py-4 text-center w-[220px] border-r border-gray-700 last:border-r-0">
                    <Link href={`/fixtures/${fixture.slug}`} className="flex flex-col items-center gap-3 group">
                      <div className="w-32 h-40 relative rounded-lg overflow-hidden bg-white group-hover:ring-2 group-hover:ring-amber-500 transition-all mx-auto">
                        <ImageWithFallback
                          src={fixture.primary_image_url || ''}
                          alt={fixture.name}
                          className="object-contain p-2 w-full h-full"
                        />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg group-hover:text-amber-400 transition-colors">{fixture.name}</div>
                        <div className="text-gray-400 text-sm">{fixture.manufacturer?.name}</div>
                      </div>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {/* User Rating */}
              <tr className="hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-300 sticky left-0 bg-dark-secondary border-r border-gray-700">
                  User Rating
                </td>
                {fixtures.map((fixture, index) => {
                  const rating = fixtureRatings[index];
                  const isHighest = rating === maxRating && rating > 0;
                  const upvotes = fixture.endorsements?.reduce((sum: number, e: any) => sum + (e.upvotes || 0), 0) || 0;
                  const downvotes = fixture.endorsements?.reduce((sum: number, e: any) => sum + (e.downvotes || 0), 0) || 0;
                  const totalVotes = upvotes + downvotes;
                  
                  return (
                    <td key={fixture.id} className={`px-4 py-3 border-r border-gray-700/30 last:border-r-0 ${isHighest ? 'bg-gray-700/30' : ''}`}>
                      {rating > 0 ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-2xl font-bold">
                            <span className={
                              rating >= 95 ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-300' :
                              rating >= 75 ? 'text-green-400' :
                              rating >= 60 ? 'text-amber-400' :
                              'text-red-400'
                            }>
                              {rating.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                rating >= 95 ? 'bg-gradient-to-r from-emerald-400 to-green-400' :
                                rating >= 75 ? 'bg-green-500' :
                                rating >= 60 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${rating}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {upvotes}↑ {downvotes}↓
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No ratings</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Basic Info */}
              <tr className="bg-gray-800/80">
                <td colSpan={fixtures.length + 1} className="px-4 py-2 font-bold text-amber-500 text-sm uppercase tracking-wider sticky left-0 bg-gray-800/80 border-y border-gray-600">
                  Basic Information
                </td>
              </tr>
              <tr className="hover:bg-gray-800/40 transition-colors even:bg-gray-800/20">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary border-r border-gray-700">Model Number</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.model_number} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Fixture Type</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.fixture_type?.name} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Year Introduced</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.year_introduced} />)}
              </tr>

              {/* Light Source */}
              <tr className="hover:bg-gray-800/30 bg-gray-800/20">
                <td colSpan={fixtures.length + 1} className="px-4 py-2 font-semibold text-amber-500 text-sm uppercase tracking-wide sticky left-0 bg-dark-secondary">
                  Light Source
                </td>
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Type</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.light_source_type} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Total Lumens</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.total_lumens?.toLocaleString()} highlight={f.total_lumens === Math.max(...fixtures.map(fx => fx.total_lumens || 0))} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Color Temperature (K)</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.color_temperature_kelvin?.toLocaleString()} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">CRI Rating</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.cri_rating} highlight={f.cri_rating === Math.max(...fixtures.map(fx => fx.cri_rating || 0))} />)}
              </tr>

              {/* Optics */}
              <tr className="hover:bg-gray-800/30 bg-gray-800/20">
                <td colSpan={fixtures.length + 1} className="px-4 py-2 font-semibold text-amber-500 text-sm uppercase tracking-wide sticky left-0 bg-dark-secondary">
                  Optics
                </td>
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Beam Angle</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.beam_angle_min && f.beam_angle_max ? `${f.beam_angle_min}° - ${f.beam_angle_max}°` : null} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Zoom Type</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.zoom_type} />)}
              </tr>

              {/* Color System */}
              <tr className="hover:bg-gray-800/30 bg-gray-800/20">
                <td colSpan={fixtures.length + 1} className="px-4 py-2 font-semibold text-amber-500 text-sm uppercase tracking-wide sticky left-0 bg-dark-secondary">
                  Color System
                </td>
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Color Mixing</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.color_mixing_type} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Color Wheels</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.color_wheels_count || 0} />)}
              </tr>

              {/* Effects - Only show section if at least one fixture has these features */}
              {(hasAnyGobos || hasAnyPrism || hasAnyIris) && (
                <>
                  <tr className="hover:bg-gray-800/30 bg-gray-800/20">
                    <td colSpan={fixtures.length + 1} className="px-4 py-2 font-semibold text-amber-500 text-sm uppercase tracking-wide sticky left-0 bg-dark-secondary border-y border-gray-600">
                      Effects
                    </td>
                  </tr>
                  {hasAnyGobos && (
                    <tr className="hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Gobos (Rotating/Static)</td>
                      {fixtures.map(f => <CompareCell key={f.id} value={f.rotating_gobos_count || f.static_gobos_count ? `${f.rotating_gobos_count || 0}/${f.static_gobos_count || 0}` : null} />)}
                    </tr>
                  )}
                  {hasAnyPrism && (
                    <tr className="hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Prism</td>
                      {fixtures.map(f => <CompareCell key={f.id} value={f.prism} />)}
                    </tr>
                  )}
                  <tr className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Frost</td>
                    {fixtures.map(f => <CompareCell key={f.id} value={f.frost} />)}
                  </tr>
                  {hasAnyIris && (
                    <tr className="hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Iris</td>
                      {fixtures.map(f => <CompareCell key={f.id} value={f.iris} />)}
                    </tr>
                  )}
                </>
              )}

              {/* Movement */}
              <tr className="hover:bg-gray-800/30 bg-gray-800/20">
                <td colSpan={fixtures.length + 1} className="px-4 py-2 font-semibold text-amber-500 text-sm uppercase tracking-wide sticky left-0 bg-dark-secondary">
                  Movement
                </td>
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Pan Range</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.pan_range_degrees ? `${f.pan_range_degrees}°` : null} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Tilt Range</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.tilt_range_degrees ? `${f.tilt_range_degrees}°` : null} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">16-bit Pan/Tilt</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.pan_tilt_16bit} />)}
              </tr>

              {/* Power & Physical */}
              <tr className="hover:bg-gray-800/30 bg-gray-800/20">
                <td colSpan={fixtures.length + 1} className="px-4 py-2 font-semibold text-amber-500 text-sm uppercase tracking-wide sticky left-0 bg-dark-secondary">
                  Power & Physical
                </td>
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Power Consumption</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.power_consumption_watts ? `${f.power_consumption_watts}W` : null} highlight={f.power_consumption_watts === Math.min(...fixtures.map(fx => fx.power_consumption_watts || Infinity).filter(p => p !== Infinity))} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Weight</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.weight_kg ? `${f.weight_kg} kg (${f.weight_lbs} lbs)` : null} highlight={f.weight_kg === Math.min(...fixtures.map(fx => fx.weight_kg || Infinity).filter(w => w !== Infinity))} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Dimensions (W×H×D)</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.width_mm && f.height_mm && f.depth_mm ? `${f.width_mm}×${f.height_mm}×${f.depth_mm} mm` : null} />)}
              </tr>

              {/* Control */}
              <tr className="hover:bg-gray-800/30 bg-gray-800/20">
                <td colSpan={fixtures.length + 1} className="px-4 py-2 font-semibold text-amber-500 text-sm uppercase tracking-wide sticky left-0 bg-dark-secondary">
                  Control
                </td>
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">DMX Channels</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.dmx_channels_min && f.dmx_channels_max ? `${f.dmx_channels_min}-${f.dmx_channels_max}` : null} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">RDM Support</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.rdm_support} />)}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 sticky left-0 bg-dark-secondary">Art-Net Support</td>
                {fixtures.map(f => <CompareCell key={f.id} value={f.art_net} />)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
