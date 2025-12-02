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
  ShieldCheck,
  Mail
} from 'lucide-react';
import dynamic from 'next/dynamic';
import IssueReportModal from '@/components/IssueReportModal';
import CertifiedBadge from '@/components/CertifiedBadge';
import UseCaseSelector from '@/components/UseCaseSelector';
import UseCaseInsights from '@/components/UseCaseInsights';
import ComparisonQuickAdd from '@/components/ComparisonQuickAdd';
import EngagementBanner from '@/components/EngagementBanner';
import DemoRequestModal from '@/components/DemoRequestModal';
import SimilarFixtures from '@/components/SimilarFixtures';

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
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedEndorsement, setSelectedEndorsement] = useState<{id: string, name: string} | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showEngagementBanner, setShowEngagementBanner] = useState(true);

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

  // Fetch fixture issues
  const { data: fixtureIssues } = useQuery({
    queryKey: ['fixture-issues', fixture?.id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3001/api/v1/endorsement-issues/fixture/${fixture?.id}`);
      return response.data.issues;
    },
    enabled: !!fixture?.id,
  });

  // Check if fixture is certified
  const { data: certifiedData } = useQuery({
    queryKey: ['certified-fixtures'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/api/v1/endorsement-issues/certified');
      return response.data.certified;
    },
  });

  const isCertified = certifiedData?.some((cert: any) => cert.fixture_id === fixture?.id);

  const voteMutation = useMutation({
    mutationFn: async ({ categorySlug, voteType, endorsementId }: { categorySlug: string; voteType: 'up' | 'down'; endorsementId?: string }) => {
      const response = await axios.post(
        `http://localhost:3001/api/v1/fixtures/${slug}/endorsements/${categorySlug}/vote`,
        { voteType, sessionId }
      );
      return response.data;
    },
    onSuccess: () => {
      // Refetch fixture data to get updated vote counts
      queryClient.invalidateQueries({ queryKey: ['fixture', slug] });
      queryClient.invalidateQueries({ queryKey: ['fixture-issues', fixture?.id] });
    },
  });

  const handleVote = (endorsementId: string, categorySlug: string, categoryName: string, voteType: 'up' | 'down') => {
    if (!sessionId) return;
    
    // Vote immediately for both up and down votes
    voteMutation.mutate({ categorySlug, voteType, endorsementId });
  };

  const handleIssueReported = () => {
    // After issue is reported, complete the downvote
    if (selectedEndorsement) {
      const endorsement = fixture?.endorsements?.find((e: any) => e.id === selectedEndorsement.id);
      if (endorsement) {
        voteMutation.mutate({ categorySlug: endorsement.slug, voteType: 'down', endorsementId: selectedEndorsement.id });
      }
    }
  };

  const handleUseCaseSelect = async (useCase: string, userRole?: string) => {
    setSelectedUseCase(useCase);
    if (fixture?.id && sessionId) {
      try {
        await axios.post(`http://localhost:3001/api/v1/tracking/fixtures/${fixture.id}/use-case`, {
          sessionId,
          useCase,
          userRole
        });
      } catch (error) {
        console.error('Error tracking use case:', error);
      }
    }
  };

  const handleComparisonAdd = async () => {
    if (fixture?.id && sessionId) {
      try {
        const comparison = JSON.parse(localStorage.getItem('riderready-comparison') || '[]');
        if (comparison.length >= 2) {
          await axios.post(`http://localhost:3001/api/v1/tracking/comparisons`, {
            sessionId,
            fixtureIds: comparison.map((item: any) => item.id)
          });
        }
      } catch (error) {
        console.error('Error tracking comparison:', error);
      }
    }
  };

  const handleEngagementClick = () => {
    setShowEngagementBanner(false);
    // Scroll to ratings section
    const ratingsSection = document.querySelector('#performance-ratings');
    if (ratingsSection) {
      ratingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Use endorsements directly from the fixture data
  const endorsementsList = fixture?.endorsements || [];

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

      {/* Use Case Selector */}
      <UseCaseSelector 
        onSelect={handleUseCaseSelect}
        currentSelection={selectedUseCase}
      />

      {/* Use Case Insights - shown after selection */}
      {selectedUseCase && (
        <UseCaseInsights 
          useCase={selectedUseCase}
          fixture={fixture}
        />
      )}

      {/* Comparison & Demo Request Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
        <ComparisonQuickAdd 
          fixtureId={fixture.id}
          fixtureName={fixture.name}
          onAdd={handleComparisonAdd}
        />
        <button
          onClick={() => setShowDemoModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-amber-500 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold transition-all"
        >
          <Mail className="w-5 h-5" />
          <span>Request Demo from {fixture.manufacturer.name}</span>
        </button>
      </div>

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

      {/* Performance Ratings */}
      <div id="performance-ratings" className="card-dark p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-amber-500" />
            Performance Ratings
          </h2>
          {isCertified && <CertifiedBadge size="md" showLabel />}
        </div>

        {endorsementsList && endorsementsList.length > 0 ? (
          (() => {
            // Group categories by feature_group
            const grouped = endorsementsList.reduce((acc: any, endorsement: any) => {
              const group = endorsement.feature_group || 'General';
              if (!acc[group]) acc[group] = [];
              acc[group].push(endorsement);
              return acc;
            }, {});

            return (
              <div className="space-y-8">
                {Object.entries(grouped).map(([groupName, groupEndorsements]: [string, any]) => (
                  <div key={groupName}>
                    {(() => {
                      // Calculate if this group has 95%+ approval
                      const groupTotalVotes = groupEndorsements.reduce((sum: number, e: any) => sum + e.upvotes + e.downvotes, 0);
                      const groupUpvotes = groupEndorsements.reduce((sum: number, e: any) => sum + e.upvotes, 0);
                      const groupApproval = groupTotalVotes > 0 ? Math.round((groupUpvotes / groupTotalVotes) * 100) : 0;
                      const isVerified = groupApproval >= 95 && groupTotalVotes >= 10;
                      
                      return (
                        <h3 className="text-lg font-semibold text-amber-400 mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                          {groupName}
                          {isVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-emerald-900/40 to-green-900/40 border border-emerald-500/50 rounded-full text-xs font-semibold text-emerald-300">
                              <ShieldCheck className="w-3 h-3" />
                              Verified Excellence
                            </span>
                          )}
                        </h3>
                      );
                    })()}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {groupEndorsements.map((endorsement: any) => {
                        const totalVotes = endorsement.upvotes + endorsement.downvotes;
                        const upvotePercent = totalVotes > 0 
                          ? Math.round((endorsement.upvotes / totalVotes) * 100) 
                          : 0;
                        const hasVotes = totalVotes > 0;
                        
                        // Find the top issue for this category
                        const topIssue = fixtureIssues?.find(
                          (issue: any) => issue.category_slug === endorsement.slug
                        );

                        return (
                          <div 
                            key={endorsement.slug}
                            className={`bg-dark-secondary border rounded-lg p-4 transition-all ${
                              hasVotes 
                                ? 'border-gray-700 hover:border-amber-600' 
                                : 'border-gray-800 border-dashed opacity-50'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-200 mb-1">
                                  {endorsement.name}
                                </h3>
                                {endorsement.description && (
                                  <p className="text-xs text-gray-500 mb-2">
                                    {endorsement.description}
                                  </p>
                                )}
                                {hasVotes && (
                                  <div className="text-sm">
                                    <span className={`font-bold ${
                                      upvotePercent >= 95 ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-300 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                      upvotePercent >= 75 ? 'text-green-400' :
                                      upvotePercent >= 60 ? 'text-amber-400' :
                                      'text-red-400'
                                    }`}>{upvotePercent}%</span>
                                    <span className="text-gray-400"> positive ({totalVotes} vote{totalVotes !== 1 ? 's' : ''})</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Vote buttons */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleVote(endorsement.id, endorsement.slug, endorsement.name, 'up')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                  endorsement.upvotes > 0
                                    ? 'bg-green-900/30 text-green-400 border border-green-700'
                                    : 'bg-dark-tertiary text-gray-400 border border-gray-700 hover:border-green-600 hover:text-green-400'
                                }`}
                                disabled={voteMutation.isPending}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-sm font-medium">{endorsement.upvotes}</span>
                              </button>
                              <button
                                onClick={() => handleVote(endorsement.id, endorsement.slug, endorsement.name, 'down')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                  endorsement.downvotes > 0
                                    ? 'bg-red-900/30 text-red-400 border border-red-700'
                                    : 'bg-dark-tertiary text-gray-400 border border-gray-700 hover:border-red-600 hover:text-red-400'
                                }`}
                                disabled={voteMutation.isPending}
                              >
                                <ThumbsDown className="w-4 h-4" />
                                <span className="text-sm font-medium">{endorsement.downvotes}</span>
                              </button>
                            </div>

                            {/* Show top issue if downvotes exist */}
                            {topIssue && topIssue.total_reports > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-700">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-400 mb-1">Most reported issue:</p>
                                    <p className="text-sm text-amber-400 font-medium">
                                      {topIssue.tag_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {topIssue.total_reports} report{topIssue.total_reports !== 1 ? 's' : ''} 
                                      ({topIssue.percentage}% of downvotes)
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        ) : (
          <p className="text-gray-400 text-center py-8">
            No performance ratings available for this fixture yet.
          </p>
        )}
      </div>

      {/* Similar Fixtures */}
      <SimilarFixtures 
        fixtureId={fixture.id}
        fixtureName={fixture.name}
        limit={6}
      />

        {/* Issue Report Modal */}
        {showIssueModal && selectedEndorsement && (
          <IssueReportModal
            isOpen={showIssueModal}
            onClose={() => {
              setShowIssueModal(false);
              setSelectedEndorsement(null);
            }}
            endorsementId={selectedEndorsement.id}
            categoryName={selectedEndorsement.name}
            onReportSuccess={handleIssueReported}
          />
        )}

        {/* Demo Request Modal */}
        <DemoRequestModal
          fixtureId={fixture.id}
          fixtureName={fixture.name}
          manufacturerName={fixture.manufacturer.name}
          manufacturerId={fixture.manufacturer.id}
          vendors={fixture.vendors || []}
          distributors={fixture.distributors || []}
          isOpen={showDemoModal}
          onClose={() => setShowDemoModal(false)}
          sessionId={sessionId}
          useCase={selectedUseCase}
        />

        {/* Engagement Banner */}
        {showEngagementBanner && (
          <EngagementBanner
            fixtureName={fixture.name}
            onEngaged={handleEngagementClick}
          />
        )}
      </div>
    </div>
  );
}
