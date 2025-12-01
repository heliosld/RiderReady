'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

interface VendorLocationData {
  id: number;
  vendor_id: number;
  vendor_name: string;
  vendor_slug: string;
  location_name: string;
  is_headquarters: boolean;
  latitude?: number;
  longitude?: number;
  address_line1: string;
  city: string;
  state_province: string;
  country: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  vendor_type?: string;
}

interface AllVendorsMapProps {
  locations: VendorLocationData[];
  height?: string;
}

export default function AllVendorsMap({ locations, height = '600px' }: AllVendorsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      const leaflet = L.default;

      // Filter valid locations
      const validLocations = locations
        .map(loc => ({
          ...loc,
          latitude: typeof loc.latitude === 'string' ? parseFloat(loc.latitude) : loc.latitude,
          longitude: typeof loc.longitude === 'string' ? parseFloat(loc.longitude) : loc.longitude
        }))
        .filter(
          loc => loc.latitude && loc.longitude && 
                 !isNaN(loc.latitude) && !isNaN(loc.longitude)
        );

      if (validLocations.length === 0) return;

      // Try to get user's location, fallback to calculated center
      const centerLat = validLocations.reduce((sum, loc) => sum + loc.latitude!, 0) / validLocations.length;
      const centerLng = validLocations.reduce((sum, loc) => sum + loc.longitude!, 0) / validLocations.length;

      // Create map with default center
      const map = leaflet.map(mapRef.current!).setView([centerLat, centerLng], 2);
      mapInstanceRef.current = map;

      // Try to get user's geolocation and recenter
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Center above user's city with appropriate zoom
            map.setView([position.coords.latitude, position.coords.longitude], 5);
          },
          () => {
            // If geolocation fails, keep default center
            console.log('Geolocation not available, using default center');
          },
          { timeout: 5000 }
        );
      }

      // Add tile layer
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Rental House icons (blue) - smaller size
      const rentalIcon = leaflet.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [18, 30],
        iconAnchor: [9, 30],
        popupAnchor: [1, -26],
        shadowSize: [30, 30]
      });

      // Distributor icons (red) - smaller size
      const distributorIcon = leaflet.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [18, 30],
        iconAnchor: [9, 30],
        popupAnchor: [1, -26],
        shadowSize: [30, 30]
      });

      // Add markers
      validLocations.forEach((location) => {
        const isDistributor = location.vendor_type === 'Distributor';

        // Choose icon based on type
        const markerIcon = isDistributor ? distributorIcon : rentalIcon;        const marker = leaflet.marker(
          [location.latitude!, location.longitude!],
          { icon: markerIcon }
        ).addTo(map);

        const popupContent = `
          <div style="min-width: 200px;">
            <a 
              href="/vendors/${location.vendor_slug}"
              style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.25rem; color: #2563eb; text-decoration: none;"
            >
              ${location.vendor_name}
            </a>
            <h4 style="font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
              ${location.location_name}
            </h4>
            ${location.vendor_type === 'Distributor' ? '<span style="display: inline-block; background-color: #d1fae5; color: #065f46; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-bottom: 0.5rem; margin-right: 0.25rem;">Distributor</span>' : '<span style="display: inline-block; background-color: #dbeafe; color: #1e40af; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-bottom: 0.5rem; margin-right: 0.25rem;">Rental House</span>'}
            ${location.is_headquarters ? '<span style="display: inline-block; background-color: #fee2e2; color: #991b1b; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-bottom: 0.5rem;">Headquarters</span>' : ''}
            <br>
            <div style="font-size: 0.875rem; color: #374151;">
              <p>${location.address_line1}</p>
              <p>${location.city}, ${location.state_province} ${location.postal_code || ''}</p>
              <p>${location.country}</p>
              ${location.phone ? `<p style="margin-top: 0.5rem;"><strong>Phone:</strong> ${location.phone}</p>` : ''}
              ${location.email ? `<p><strong>Email:</strong> <a href="mailto:${location.email}" style="color: #2563eb;">${location.email}</a></p>` : ''}
            </div>
            <a
              href="/vendors/${location.vendor_slug}"
              style="margin-top: 0.75rem; display: block; text-align: center; background-color: #2563eb; color: white; font-size: 0.875rem; padding: 0.375rem 0.75rem; border-radius: 0.5rem; text-decoration: none;"
            >
              View Vendor Details
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
      });
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  // Filter out locations without valid coordinates for fallback
  const validLocations = locations
    .map(loc => ({
      ...loc,
      latitude: typeof loc.latitude === 'string' ? parseFloat(loc.latitude) : loc.latitude,
      longitude: typeof loc.longitude === 'string' ? parseFloat(loc.longitude) : loc.longitude
    }))
    .filter(
      loc => loc.latitude && loc.longitude && 
             !isNaN(loc.latitude) && !isNaN(loc.longitude)
    );

  if (validLocations.length === 0) {
    if (locations.length > 0) {
      return (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200" style={{ height, overflowY: 'auto' }}>
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Vendor Locations</h3>
          <div className="space-y-4">
            {locations.map((location) => (
              <div key={location.id} className="bg-white p-4 rounded border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <Link 
                      href={`/vendors/${location.vendor_slug}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                    >
                      {location.vendor_name}
                    </Link>
                    <p className="text-sm text-gray-700 mt-1">{location.location_name}</p>
                    {location.is_headquarters && (
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-1">
                        Headquarters
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p>{location.address_line1}</p>
                  <p>{location.city}, {location.state_province} {location.postal_code}</p>
                  <p>{location.country}</p>
                  {location.phone && <p className="mt-2"><span className="font-medium">Phone:</span> {location.phone}</p>}
                  {location.email && (
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      <a href={`mailto:${location.email}`} className="text-blue-600 hover:underline">
                        {location.email}
                      </a>
                    </p>
                  )}
                </div>
                <Link
                  href={`/vendors/${location.vendor_slug}`}
                  className="mt-3 inline-block text-center bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded"
                >
                  View Vendor Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center" style={{ height }}>
        <p className="text-gray-600">No location data available</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="rounded-lg overflow-hidden border border-gray-200" 
      style={{ height, width: '100%', position: 'relative' }}
    />
  );
}
