'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getCurrentMapProvider } from '@/lib/mapProvider';

interface UnifiedMapProps {
  originAddress: string;
  destinationAddress: string;
  currentLocation?: {
    lat: number;
    lng: number;
    name?: string;
  };
  // For OpenStreetMap - use stored coordinates
  originCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
  timelineCoords?: Array<{ lat: number; lng: number; location?: string }>;
  showRoute?: boolean;
  height?: string;
}

// Dynamically import map components to avoid SSR issues
// Note: GoogleMap.tsx currently uses Mapbox GL - this will need to be updated for true Google Maps
const MapboxMapComponent = dynamic(() => import('@/components/shipment/GoogleMap'), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
});

const LeafletMapComponent = dynamic(() => import('@/components/shipment/RealTimeMap'), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
});

function MapLoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl" style={{ height: '500px' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  );
}

export default function UnifiedMap({
  originAddress,
  destinationAddress,
  currentLocation,
  originCoords,
  destinationCoords,
  timelineCoords,
  showRoute = true,
  height = '500px',
}: UnifiedMapProps) {
  const [mapProvider, setMapProvider] = useState<'google' | 'openstreetmap' | 'mapbox'>('google');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentMapProvider().then((provider) => {
      setMapProvider(provider);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <MapLoadingPlaceholder />;
  }

  // For OpenStreetMap, use coordinates if available
  if (mapProvider === 'openstreetmap') {
    return (
      <LeafletMapComponent
        originAddress={originCoords ? `${originCoords.lat}, ${originCoords.lng}` : originAddress}
        destinationAddress={destinationCoords ? `${destinationCoords.lat}, ${destinationCoords.lng}` : destinationAddress}
        currentLocation={currentLocation}
        showRoute={showRoute}
        height={height}
      />
    );
  }

  // For Mapbox or Google Maps (both use geocoding)
  // Note: Currently GoogleMap.tsx uses Mapbox GL - a true Google Maps component should be created
  if (mapProvider === 'mapbox' || mapProvider === 'google') {
    return (
      <MapboxMapComponent
        originAddress={originAddress}
        destinationAddress={destinationAddress}
        currentLocation={currentLocation}
        showRoute={showRoute}
        height={height}
      />
    );
  }

  // Default fallback (should not reach here)
  return <MapLoadingPlaceholder />;
}

