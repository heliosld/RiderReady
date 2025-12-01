'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsApi } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { 
  ArrowLeft, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Building2,
  Calendar,
  CheckCircle,
  Package,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  ShieldCheck
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

export default function VendorDetailPage() {
  const params = useParams();
  const slug = params.id as string;
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string>('');

  // Generate or retrieve session ID
  useEffect(() => {
    let id = localStorage.getItem('riderready-session-id');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('riderready-session-id', id);
    }
    setSessionId(id);
  }, []);

  const { data: vendor, isLoading, error } = useQuery({
    queryKey: ['vendor', slug],
    queryFn: () => vendorsApi.getBySlug(slug),
  });

  // Fetch all endorsement categories
  const { data: allCategories } = useQuery({
    queryKey: ['endorsement-categories', slug],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3001/api/v1/vendors/${slug}/endorsement-categories`);
      return response.data;
    },
    enabled: !!slug,
  });

  const voteMutation = useMutation({
    mutationFn: async ({ categorySlug, voteType }: { categorySlug: string; voteType: 'up' | 'down' }) => {
      const response = await axios.post(
        `http://localhost:3001/api/v1/vendors/${slug}/endorsements/${categorySlug}/vote`,
        { voteType, sessionId }
      );
      return response.data;
    },
    onSuccess: () => {
      // Refetch vendor data to get updated vote counts
      queryClient.invalidateQueries({ queryKey: ['vendor', slug] });
    },
  });

  const handleVote = (categorySlug: string, voteType: 'up' | 'down') => {
    if (!sessionId) return;
    voteMutation.mutate({ categorySlug, voteType });
  };

  // Merge categories with endorsement data
  const endorsementsList = allCategories?.map((category: any) => {
    const existingEndorsement = vendor?.endorsements?.find(
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
          <p className="text-gray-600 dark:text-gray-300">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">Vendor not found</p>
          <Link href="/vendors" className="text-primary-600 hover:underline mt-4 inline-block">
            ← Back to Vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        href="/vendors"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Vendors
      </Link>

      {/* Header */}
      <div className="bg-dark-secondary rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {vendor.logo_url ? (
              <img 
                src={vendor.logo_url} 
                alt={`${vendor.name} logo`}
                className="w-20 h-20 object-contain"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                {vendor.name}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                {vendor.vendor_type && (
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full font-medium">
                    {vendor.vendor_type}
                  </span>
                )}
                {vendor.verified && (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {vendor.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            {vendor.description}
          </p>
        )}

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(vendor.city || vendor.country) && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="font-semibold">
                  {vendor.address_line1 && <>{vendor.address_line1}<br /></>}
                  {vendor.city}{vendor.state_province ? `, ${vendor.state_province}` : ''}
                  {vendor.country && <><br />{vendor.country}</>}
                </p>
              </div>
            </div>
          )}

          {vendor.website && (
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                <a 
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline font-semibold"
                >
                  Visit Website
                </a>
              </div>
            </div>
          )}

          {vendor.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <a 
                  href={`mailto:${vendor.email}`}
                  className="text-primary-600 hover:text-primary-700 hover:underline font-semibold break-all"
                >
                  {vendor.email}
                </a>
              </div>
            </div>
          )}

          {vendor.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <a 
                  href={`tel:${vendor.phone}`}
                  className="text-primary-600 hover:text-primary-700 hover:underline font-semibold"
                >
                  {vendor.phone}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {(vendor.established_year || vendor.service_radius_km) && (
          <div className="flex gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {vendor.established_year && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Established {vendor.established_year}
                </span>
              </div>
            )}
            {vendor.service_radius_km && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Service Radius: {vendor.service_radius_km} km
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Multiple Locations */}
      {vendor.locations && vendor.locations.length > 0 && (
        <div className="bg-dark-secondary rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary-600" />
            Locations ({vendor.locations.length})
          </h2>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Locations List - Left Side */}
            <div className="lg:w-96 flex-shrink-0 space-y-4 max-h-[600px] overflow-y-auto">
            {vendor.locations.map((location: any) => (
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

                  {location.services_offered && location.services_offered.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {location.services_offered.map((service: string) => (
                        <span 
                          key={service}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>

            {/* Map View - Right Side */}
            <div className="lg:flex-1">
              <VendorMap 
                locations={vendor.locations} 
                vendorName={vendor.name}
                height="600px"
                zoom={vendor.locations.length === 1 ? 12 : 4}
              />
            </div>
          </div>
        </div>
      )}

      {/* Endorsements */}
      {endorsementsList && endorsementsList.length > 0 && (
        <div className="bg-dark-secondary rounded-lg shadow-lg p-6 mb-6">
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
                        <div className="flex items-start justify-between mb-2">
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
              💡 Community endorsements reflect real-world experiences.
            </p>
          </div>
        </div>
      )}

      {/* Inventory */}
      <div className="bg-dark-secondary rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-primary-600" />
          Available Equipment
        </h2>

        {!vendor.inventory || vendor.inventory.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No inventory information available
          </p>
        ) : (
          <div className="space-y-4">
            {vendor.inventory.map((item: any) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 transition-colors"
              >
                <div className="flex-1">
                  <Link
                    href={`/fixtures/${item.fixture.slug}`}
                    className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600"
                  >
                    {item.fixture.name}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.fixture.manufacturer.name}
                  </p>
                  {item.notes && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-6 ml-4">
                  {item.quantity && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {item.available_for_rental && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        Rental
                      </span>
                    )}
                    {item.available_for_purchase && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
