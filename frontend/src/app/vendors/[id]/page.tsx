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
  ShieldCheck,
  MessageSquare
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
  const [activeTab, setActiveTab] = useState<'equipment' | 'locations' | 'feedback'>('locations');

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

        {/* About Section */}
        {vendor.about && (
          <div className="bg-gray-50 dark:bg-dark-tertiary rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">About</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {vendor.about}
            </p>
          </div>
        )}

        {/* Services */}
        {vendor.services && vendor.services.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Services Offered
            </h3>
            <div className="flex flex-wrap gap-2">
              {vendor.services.map((service: string) => (
                <span 
                  key={service}
                  className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Specialties */}
        {vendor.specialties && vendor.specialties.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {vendor.specialties.map((specialty: string) => (
                <span 
                  key={specialty}
                  className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {vendor.certifications && vendor.certifications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Certifications & Credentials
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {vendor.certifications.map((cert: any, idx: number) => (
                <div 
                  key={idx}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-dark-tertiary"
                >
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {cert.issuer}{cert.year ? ` • ${cert.year}` : ''}
                      </p>
                      {cert.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

        {/* Company Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {vendor.established_year && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Established</p>
                <p className="font-semibold text-gray-900 dark:text-white">{vendor.established_year}</p>
              </div>
            </div>
          )}
          {vendor.years_in_business && (
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Experience</p>
                <p className="font-semibold text-gray-900 dark:text-white">{vendor.years_in_business} years</p>
              </div>
            </div>
          )}
          {vendor.team_size && (
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Team Size</p>
                <p className="font-semibold text-gray-900 dark:text-white">{vendor.team_size}</p>
              </div>
            </div>
          )}
          {vendor.response_time && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Response Time</p>
                <p className="font-semibold text-gray-900 dark:text-white">{vendor.response_time}</p>
              </div>
            </div>
          )}
          {vendor.service_radius_km && (
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Service Radius</p>
                <p className="font-semibold text-gray-900 dark:text-white">{vendor.service_radius_km} km</p>
              </div>
            </div>
          )}
          {vendor.service_area && (
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Service Area</p>
                <p className="font-semibold text-gray-900 dark:text-white">{vendor.service_area}</p>
              </div>
            </div>
          )}
        </div>

        {/* Hours of Operation */}
        {vendor.hours_of_operation && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Hours of Operation</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                const hours = vendor.hours_of_operation[day];
                if (!hours) return null;
                return (
                  <div key={day} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-dark-tertiary rounded">
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{day}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{hours}</span>
                  </div>
                );
              })}
            </div>
            {vendor.hours_of_operation.notes && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
                {vendor.hours_of_operation.notes}
              </p>
            )}
          </div>
        )}

        {/* Social Media */}
        {vendor.social_media && Object.keys(vendor.social_media).length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {vendor.social_media.website && (
                <a 
                  href={vendor.social_media.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-tertiary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">Website</span>
                </a>
              )}
              {vendor.social_media.facebook && (
                <a 
                  href={vendor.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">Facebook</span>
                </a>
              )}
              {vendor.social_media.instagram && (
                <a 
                  href={vendor.social_media.instagram.startsWith('http') ? vendor.social_media.instagram : `https://instagram.com/${vendor.social_media.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-400 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">Instagram</span>
                </a>
              )}
              {vendor.social_media.linkedin && (
                <a 
                  href={vendor.social_media.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
              {vendor.social_media.twitter && (
                <a 
                  href={vendor.social_media.twitter.startsWith('http') ? vendor.social_media.twitter : `https://twitter.com/${vendor.social_media.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-sky-100 dark:bg-sky-900/30 hover:bg-sky-200 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-400 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">Twitter</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabbed Content Section */}
      <div className="bg-dark-secondary rounded-lg shadow-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="bg-dark-tertiary">
          <div className="flex gap-1 px-1 pt-1">
            <button
              onClick={() => setActiveTab('locations')}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold transition-all ${
                activeTab === 'locations'
                  ? 'bg-dark-secondary text-white border-t-2 border-amber-500'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-dark-secondary/50'
              }`}
            >
              <MapPin className="w-5 h-5" />
              Locations
              {vendor.locations && vendor.locations.length > 0 && (
                <span className="px-2 py-0.5 bg-amber-500 text-black rounded-full text-xs font-bold">
                  {vendor.locations.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold transition-all ${
                activeTab === 'feedback'
                  ? 'bg-dark-secondary text-white border-t-2 border-amber-500'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-dark-secondary/50'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Community Feedback
              {endorsementsList && endorsementsList.length > 0 && (
                <span className="px-2 py-0.5 bg-amber-500 text-black rounded-full text-xs font-bold">
                  {endorsementsList.filter((e: any) => e.net_score !== 0).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold transition-all ${
                activeTab === 'equipment'
                  ? 'bg-dark-secondary text-white border-t-2 border-amber-500'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-dark-secondary/50'
              }`}
            >
              <Package className="w-5 h-5" />
              Available Equipment
              {vendor.inventory && vendor.inventory.length > 0 && (
                <span className="px-2 py-0.5 bg-amber-500 text-black rounded-full text-xs font-bold">
                  {vendor.inventory.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div>
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
          )}

          {/* Locations Tab */}
          {activeTab === 'locations' && vendor.locations && vendor.locations.length > 0 && (
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
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && endorsementsList && endorsementsList.length > 0 && (
            <div>
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
        </div>
      </div>
    </div>
  );
}
