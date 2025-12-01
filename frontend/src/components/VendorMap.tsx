'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface VendorLocation {
  id: number;
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
  vendorName?: string;
  quantity?: number;
  available_for_rental?: boolean;
}

interface VendorMapProps {
  locations: VendorLocation[];
  vendorName?: string;
  height?: string;
  zoom?: number;
}

export default function VendorMap({ 
  locations, 
  vendorName, 
  height = '400px',
  zoom = 3 
}: VendorMapProps) {
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

      // Calculate center from locations
      const centerLat = validLocations.reduce((sum, loc) => sum + loc.latitude!, 0) / validLocations.length;
      const centerLng = validLocations.reduce((sum, loc) => sum + loc.longitude!, 0) / validLocations.length;

      // Adjust zoom for single location
      const mapZoom = validLocations.length === 1 ? 12 : zoom;

      // Create map with default center
      const map = leaflet.map(mapRef.current!).setView([centerLat, centerLng], mapZoom);
      mapInstanceRef.current = map;

      // Try to get user's geolocation and recenter if vendor has multiple locations
      if (navigator.geolocation && validLocations.length > 1) {
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

      // Default icon (blue) - smaller size
      const defaultIcon = leaflet.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [18, 30],
        iconAnchor: [9, 30],
        popupAnchor: [1, -26],
        shadowSize: [30, 30]
      });

      // Add markers
      validLocations.forEach((location) => {
        const marker = leaflet.marker(
          [location.latitude!, location.longitude!],
          { icon: defaultIcon }
        ).addTo(map);

        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.25rem;">
              ${(location as any).vendorName || vendorName || location.location_name}
            </h3>
            ${location.is_headquarters ? '<span style="display: inline-block; background-color: #fee2e2; color: #991b1b; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-bottom: 0.5rem;">Headquarters</span>' : ''}
            ${(location as any).quantity ? `<span style="display: inline-block; background-color: #e5e7eb; color: #1f2937; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem 0.25rem 0.5rem 0;">Qty: ${(location as any).quantity}</span>` : ''}
            ${(location as any).available_for_rental ? '<span style="display: inline-block; background-color: #d1fae5; color: #065f46; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-bottom: 0.5rem;">Available for Rental</span>' : ''}
            <div style="font-size: 0.875rem; color: #374151; margin-top: 0.5rem;">
              <p><strong>${location.location_name}</strong></p>
              <p>${location.address_line1}</p>
              <p>${location.city}, ${location.state_province} ${location.postal_code || ''}</p>
              <p>${location.country}</p>
              ${location.phone ? `<p style="margin-top: 0.5rem;"><strong>Phone:</strong> ${location.phone}</p>` : ''}
              ${location.email ? `<p><strong>Email:</strong> <a href="mailto:${location.email}" style="color: #2563eb;">${location.email}</a></p>` : ''}
            </div>
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
  }, [locations, vendorName, zoom]);

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
          <h3 className="font-semibold text-lg mb-4 text-gray-900">
            {vendorName ? `${vendorName} Locations` : 'Locations'}
          </h3>
          <div className="space-y-4">
            {locations.map((location) => (
              <div key={location.id} className="bg-white p-4 rounded border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900">{location.location_name}</h4>
                {location.is_headquarters && (
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-1">
                    Headquarters
                  </span>
                )}
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
