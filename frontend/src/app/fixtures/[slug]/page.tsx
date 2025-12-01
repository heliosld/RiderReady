'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fixturesApi } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { 
  ArrowLeft, 
  Weight, 
  Zap, 
  Gauge, 
  Lightbulb, 
  Palette, 
  Eye,
  Settings,
  FileText,
  ExternalLink,
  Store,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import dynamic from 'next/dynamic';

const VendorMap = dynamic(() => import('@/components/VendorMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
});

export default function FixtureDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string>('');
  const [useImperial, setUseImperial] = useState(false);

  // Generate or retrieve session ID
  useEffect(() => {
    let id = localStorage.getItem('riderready-session-id');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('riderready-session-id', id);
    }
    setSessionId(id);
  }, []);

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

  const { data: fixture, isLoading, error } = useQuery({
    queryKey: ['fixture', slug],
    queryFn: () => fixturesApi.getBySlug(slug),
  });

  // Fetch all endorsement categories
  const { data: allCategories } = useQuery({
    queryKey: ['fixture-endorsement-categories', slug],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3001/api/v1/fixtures/${slug}/endorsement-categories`);
      return response.data;
    },
    enabled: !!slug,
  });

  const voteMutation = useMutation({
    mutationFn: async ({ categorySlug, voteType }: { categorySlug: string; voteType: 'up' | 'down' }) => {
      const response = await axios.post(
        `http://localhost:3001/api/v1/fixtures/${slug}/endorsements/${categorySlug}/vote`,
        { voteType, sessionId }
      );
      return response.data;
    },
    onSuccess: () => {
      // Refetch fixture data to get updated vote counts
      queryClient.invalidateQueries({ queryKey: ['fixture', slug] });
    },
  });

  const handleVote = (categorySlug: string, voteType: 'up' | 'down') => {
    if (!sessionId) return;
    voteMutation.mutate({ categorySlug, voteType });
  };

  // Merge categories with endorsement data
  const endorsementsList = allCategories?.map((category: any) => {
    const existingEndorsement = fixture?.endorsements?.find(
      (e: any) => e.slug === category.slug
    );
    
    return {
      ...category,
      id: existingEndorsement?.id || null,
      upvotes: existingEndorsement?.upvotes || 0,
      downvotes: existingEndorsement?.downvotes || 0,
      net_score: existingEndorsement?.net_score || 0,
    };
  }) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-400">Loading fixture details...</p>
        </div>
      </div>
    );
  }

  if (error || !fixture) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500">Fixture not found</p>
          <Link href="/fixtures" className="text-amber-500 hover:text-amber-400 mt-4 inline-block">
            ← Back to Fixtures
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
        href="/fixtures"
        className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Fixtures
      </Link>

      {/* Header */}
      <div className="card-dark overflow-hidden mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Image and Basic Info */}
          <div className="lg:w-96 flex-shrink-0 space-y-4">
            {/* Image */}
            <div className="aspect-[3/4] bg-white rounded-lg flex items-center justify-center overflow-hidden">
              {fixture.primary_image_url ? (
                <img
                  src={fixture.primary_image_url}
                  alt={fixture.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-400">No image available</span>
              )}
            </div>

            {/* Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <Link 
                  href={`/manufacturers/${fixture.manufacturer.slug}`}
                  className="text-amber-500 hover:text-amber-400 font-medium inline-block"
                >
                  {fixture.manufacturer.name}
                </Link>
                <button
                  onClick={toggleUnits}
                  className="px-3 py-1 bg-dark-tertiary border border-gray-700 rounded-lg text-xs text-gray-300 hover:bg-gray-800 transition-colors"
                  title="Toggle between metric and imperial units"
                >
                  {useImperial ? 'lbs' : 'kg'}
                </button>
              </div>
              <h1 className="text-3xl font-bold mb-3 text-white">
                {fixture.name}
              </h1>
              
              {fixture.description && (
                <p className="text-gray-400 mb-4 text-sm">
                  {fixture.description}
                </p>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {fixture.weight_kg && (
                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="font-semibold text-sm text-gray-200">
                        {useImperial 
                          ? `${fixture.weight_lbs || (fixture.weight_kg * 2.20462).toFixed(1)} lbs`
                          : `${fixture.weight_kg} kg`
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                {fixture.power_consumption_watts && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs text-gray-500">Power</p>
                      <p className="font-semibold text-sm text-gray-200">{fixture.power_consumption_watts}W</p>
                    </div>
                  </div>
                )}
                
                {fixture.light_source_type && (
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs text-gray-500">Light Source</p>
                      <p className="font-semibold text-sm text-gray-200">{fixture.light_source_type}</p>
                    </div>
                  </div>
                )}
                
                {fixture.fixture_type && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-semibold text-sm text-gray-200">{fixture.fixture_type.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Links */}
              {fixture.manual_url && (
                <a
                  href={fixture.manual_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-black px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                >
                  <FileText className="w-4 h-4" />
                  Download Manual
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Vendors Availability Section */}
          {fixture.vendors && fixture.vendors.length > 0 && (
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                <Store className="w-6 h-6 text-amber-500" />
                Available from {fixture.vendors.length} Vendor{fixture.vendors.length !== 1 ? 's' : ''}
              </h2>
              
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Vendor List - Left Column */}
                <div className="lg:w-72 flex-shrink-0 space-y-2 max-h-[600px] overflow-y-auto">
                  {fixture.vendors.map((vendor: any) => (
                    <Link
                      key={vendor.id}
                      href={`/vendors/${vendor.slug}`}
                      className="block border border-gray-800 bg-dark-tertiary rounded-lg p-3 hover:border-amber-600 transition-all"
                    >
                      <h3 className="font-semibold text-sm mb-1 text-white">
                        {vendor.name}
                      </h3>
                      {(vendor.city || vendor.state_province || vendor.country) && (
                        <div className="flex items-start gap-1 text-xs text-gray-400 mb-2">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>
                            {[vendor.city, vendor.state_province, vendor.country]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {vendor.available_for_rental && (
                          <span className="text-xs bg-green-900 text-green-200 px-2 py-0.5 rounded">
                            Rental
                          </span>
                        )}
                        {vendor.available_for_purchase && (
                          <span className="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded">
                            Purchase
                          </span>
                        )}
                        {vendor.quantity && (
                          <span className="text-xs bg-gray-800 text-gray-200 px-2 py-0.5 rounded">
                            Qty: {vendor.quantity}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Map - Right Side */}
                <div className="flex-1 min-h-[600px]">
                  <VendorMap 
                    locations={fixture.vendors.flatMap((vendor: any) => 
                      (vendor.locations || []).map((loc: any) => ({
                        ...loc,
                        vendorName: vendor.name,
                        quantity: vendor.quantity,
                        available_for_rental: vendor.available_for_rental
                      }))
                    )}
                    height="600px"
                    zoom={4}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Endorsements */}
      {endorsementsList && endorsementsList.length > 0 && (
        <div className="card-dark p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-500" />
            Community Feedback
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {endorsementsList
              .sort((a: any, b: any) => {
                // Sort by net score (highest first)
                return b.net_score - a.net_score;
              })
              .map((endorsement: any) => {
                const hasVotes = endorsement.net_score !== 0;
                const isConfirmed = endorsement.net_score > 0;
                
                const borderColor = !hasVotes ? 'border-gray-700' : (isConfirmed ? 'border-green-800' : 'border-red-800');
                const bgColor = !hasVotes ? 'bg-dark-tertiary' : (isConfirmed ? 'bg-green-950/30' : 'bg-red-950/30');
                const titleColor = !hasVotes ? 'text-gray-300' : (isConfirmed ? 'text-green-400' : 'text-red-400');
                const scoreColor = !hasVotes ? 'text-gray-500' : (isConfirmed ? 'text-green-400' : 'text-red-400');
                
                const totalVotes = endorsement.upvotes + endorsement.downvotes;
                const netScore = endorsement.net_score;
                const maxScore = Math.max(Math.abs(netScore), 10); // Minimum scale of 10
                const scorePercent = totalVotes > 0 ? Math.min((Math.abs(netScore) / maxScore) * 50, 50) : 0;
                const isPositive = netScore > 0;
                
                return (
                  <div 
                    key={endorsement.slug}
                    className={`border rounded-lg p-3 ${borderColor} ${bgColor}`}
                  >
                    <div className="flex gap-2">
                      {/* Vote buttons stacked on left */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleVote(endorsement.slug, 'up')}
                          disabled={voteMutation.isPending}
                          className="flex flex-col items-center justify-center px-1.5 py-0.5 bg-green-900/30 hover:bg-green-900/50 border border-green-800 rounded transition-colors disabled:opacity-50 min-w-[40px]"
                          title="Agree - this is a strength"
                        >
                          <ThumbsUp className="w-3 h-3 text-green-400" />
                          <span className="text-[10px] font-semibold text-green-400 mt-0.5">{endorsement.upvotes}</span>
                        </button>
                        <button
                          onClick={() => handleVote(endorsement.slug, 'down')}
                          disabled={voteMutation.isPending}
                          className="flex flex-col items-center justify-center px-1.5 py-0.5 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded transition-colors disabled:opacity-50 min-w-[40px]"
                          title="Disagree - not a strength"
                        >
                          <ThumbsDown className="w-3 h-3 text-red-400" />
                          <span className="text-[10px] font-semibold text-red-400 mt-0.5">{endorsement.downvotes}</span>
                        </button>
                      </div>
                      
                      {/* Content on right */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex-1">
                            <h4 className={`font-semibold text-sm mb-0.5 ${titleColor}`}>
                              {endorsement.name}
                            </h4>
                            <p className="text-[11px] text-gray-400 leading-tight">{endorsement.description}</p>
                          </div>
                          <div className="flex flex-col items-end ml-3">
                            <div className="flex items-center gap-1">
                              {isConfirmed && hasVotes && <ThumbsUp className="w-3 h-3 text-green-400" />}
                              {!isConfirmed && hasVotes && <ThumbsDown className="w-3 h-3 text-red-400" />}
                              <span className={`text-lg font-bold ${scoreColor}`}>
                                {endorsement.net_score > 0 ? '+' : ''}{endorsement.net_score}
                              </span>
                            </div>
                            {totalVotes > 0 && (
                              <span className="text-[10px] text-gray-500">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Centered Scale Bar */}
                        <div className="mb-1.5">
                          <div className="relative h-6 rounded-full overflow-hidden bg-gray-950 border border-gray-700">
                            {/* Center line */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-600 z-10"></div>
                            
                            {/* Bar extending from center (only if there are votes) */}
                            {totalVotes > 0 && (
                              <div 
                                className={`absolute top-0 bottom-0 transition-all duration-300 ${
                                  isPositive 
                                    ? 'left-1/2 bg-gradient-to-r from-green-600 to-green-500' 
                                    : 'right-1/2 bg-gradient-to-l from-red-600 to-red-500'
                                } flex items-center ${
                                  isPositive ? 'justify-end pr-1.5' : 'justify-start pl-1.5'
                                }`}
                                style={{ width: `${scorePercent}%` }}
                              >
                                {scorePercent > 15 && (
                                  <span className="text-[10px] font-bold text-white">
                                    {isPositive ? '+' : ''}{netScore}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {/* Neutral indicator */}
                            {totalVotes === 0 && (
                              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-medium">
                                No votes yet
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="mt-4 p-3 bg-dark-tertiary rounded-lg border border-gray-800">
            <p className="text-xs text-gray-400 text-center">
              💡 Community endorsements reflect real-world experiences from LD's, PM's, and tour staff.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Specifications */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Physical Specifications */}
        <div className="card-dark p-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <Weight className="w-6 h-6 text-amber-500" />
            Physical Specifications
          </h2>
          <dl className="space-y-3">
            {fixture.weight_kg && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Weight</dt>
                <dd className="font-semibold text-gray-200">
                  {useImperial 
                    ? `${fixture.weight_lbs || (fixture.weight_kg * 2.20462).toFixed(1)} lbs (${fixture.weight_kg} kg)`
                    : `${fixture.weight_kg} kg (${fixture.weight_lbs || (fixture.weight_kg * 2.20462).toFixed(1)} lbs)`
                  }
                </dd>
              </div>
            )}
            {fixture.width_mm && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Dimensions (W×H×D)</dt>
                <dd className="font-semibold text-gray-200">
                  {fixture.width_mm} × {fixture.height_mm} × {fixture.depth_mm} mm
                </dd>
              </div>
            )}
            {fixture.ip_rating && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">IP Rating</dt>
                <dd className="font-semibold text-gray-200">{fixture.ip_rating}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Electrical Specifications */}
        <div className="bg-dark-secondary border border-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            Electrical Specifications
          </h2>
          <dl className="space-y-3">
            {fixture.power_consumption_watts && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Power Consumption</dt>
                <dd className="font-semibold text-gray-200">{fixture.power_consumption_watts}W</dd>
              </div>
            )}
            {fixture.voltage && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Voltage</dt>
                <dd className="font-semibold text-gray-200">{fixture.voltage}</dd>
              </div>
            )}
            {fixture.power_connector && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Power Connector</dt>
                <dd className="font-semibold text-gray-200">{fixture.power_connector}</dd>
              </div>
            )}
            {fixture.auto_sensing_power !== null && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Auto-Sensing</dt>
                <dd className="font-semibold text-gray-200">{fixture.auto_sensing_power ? 'Yes' : 'No'}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Optical Specifications */}
        <div className="bg-dark-secondary border border-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <Eye className="w-6 h-6 text-amber-500" />
            Optical Specifications
          </h2>
          <dl className="space-y-3">
            {fixture.total_lumens && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Light Output</dt>
                <dd className="font-semibold text-gray-200">{fixture.total_lumens.toLocaleString()} lumens</dd>
              </div>
            )}
            {fixture.beam_angle_min && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Beam Angle</dt>
                <dd className="font-semibold text-gray-200">
                  {fixture.beam_angle_min}° - {fixture.beam_angle_max}°
                </dd>
              </div>
            )}
            {fixture.field_angle_min && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Field Angle</dt>
                <dd className="font-semibold text-gray-200">
                  {fixture.field_angle_min}° - {fixture.field_angle_max}°
                </dd>
              </div>
            )}
            {fixture.zoom_type && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Zoom Type</dt>
                <dd className="font-semibold text-gray-200">{fixture.zoom_type}</dd>
              </div>
            )}
            {fixture.color_temperature_kelvin && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Color Temperature</dt>
                <dd className="font-semibold text-gray-200">{fixture.color_temperature_kelvin}K</dd>
              </div>
            )}
            {fixture.cri_rating && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">CRI</dt>
                <dd className="font-semibold text-gray-200">{fixture.cri_rating}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Color & Effects */}
        <div className="bg-dark-secondary border border-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-500" />
            Color & Effects
          </h2>
          <dl className="space-y-3">
            {fixture.color_mixing_type && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Color Mixing</dt>
                <dd className="font-semibold text-gray-200">{fixture.color_mixing_type}</dd>
              </div>
            )}
            {fixture.color_wheels_count > 0 && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Color Wheels</dt>
                <dd className="font-semibold text-gray-200">{fixture.color_wheels_count}</dd>
              </div>
            )}
            {fixture.gobo_wheels_count > 0 && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Gobo Wheels</dt>
                <dd className="font-semibold text-gray-200">
                  {fixture.gobo_wheels_count} 
                  ({fixture.rotating_gobos_count} rotating, {fixture.static_gobos_count} static)
                </dd>
              </div>
            )}
            {fixture.prism && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Prism</dt>
                <dd className="font-semibold text-gray-200">{fixture.prism_facets || 'Yes'}</dd>
              </div>
            )}
            {fixture.animation_wheel && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Animation Wheel</dt>
                <dd className="font-semibold text-gray-200">Yes</dd>
              </div>
            )}
            {fixture.frost && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Frost</dt>
                <dd className="font-semibold text-gray-200">Yes</dd>
              </div>
            )}
            {fixture.iris && (
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Iris</dt>
                <dd className="font-semibold text-gray-200">Yes</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Control */}
        <div className="bg-dark-secondary border border-gray-800 rounded-lg p-6 md:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-500" />
            Control & Movement
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <dl className="space-y-3">
              {fixture.dmx_channels_min && (
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <dt className="text-gray-400">DMX Channels</dt>
                  <dd className="font-semibold text-gray-200">
                    {fixture.dmx_channels_min} - {fixture.dmx_channels_max}
                  </dd>
                </div>
              )}
              {fixture.rdm_support && (
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <dt className="text-gray-400">RDM</dt>
                  <dd className="font-semibold text-gray-200">Supported</dd>
                </div>
              )}
              {fixture.art_net && (
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <dt className="text-gray-400">Art-Net</dt>
                  <dd className="font-semibold text-gray-200">Yes</dd>
                </div>
              )}
              {fixture.sacn && (
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <dt className="text-gray-400">sACN</dt>
                  <dd className="font-semibold text-gray-200">Yes</dd>
                </div>
              )}
            </dl>
            <dl className="space-y-3">
              {fixture.pan_range_degrees && (
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <dt className="text-gray-400">Pan Range</dt>
                  <dd className="font-semibold text-gray-200">{fixture.pan_range_degrees}°</dd>
                </div>
              )}
              {fixture.tilt_range_degrees && (
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <dt className="text-gray-400">Tilt Range</dt>
                  <dd className="font-semibold text-gray-200">{fixture.tilt_range_degrees}°</dd>
                </div>
              )}
              {fixture.pan_tilt_16bit && (
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <dt className="text-gray-400">16-bit Pan/Tilt</dt>
                  <dd className="font-semibold text-gray-200">Yes</dd>
                </div>
              )}
              {fixture.noise_level_db && (
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <dt className="text-gray-400">Noise Level</dt>
                  <dd className="font-semibold text-gray-200">{fixture.noise_level_db} dB</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
