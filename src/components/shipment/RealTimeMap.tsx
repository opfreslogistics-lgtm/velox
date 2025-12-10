'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { geocodeAddress } from '@/lib/geocode';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color: string, icon: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
          font-weight: bold;
        ">${icon}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const originIcon = createCustomIcon('#10B981', 'O');
const destinationIcon = createCustomIcon('#EF4444', 'D');
const currentLocationIcon = createCustomIcon('#3B82F6', '📍');

// Animated pulsing circle for current location
const PulsingMarker = ({ position }: { position: [number, number] }) => {
  return (
    <>
      <Circle
        center={position}
        radius={1000}
        pathOptions={{
          fillColor: '#3B82F6',
          fillOpacity: 0.1,
          color: '#3B82F6',
          weight: 2,
        }}
      />
      <Circle
        center={position}
        radius={500}
        pathOptions={{
          fillColor: '#3B82F6',
          fillOpacity: 0.2,
          color: '#3B82F6',
          weight: 2,
        }}
      />
    </>
  );
};

function FitBounds({ positions }: { positions: L.LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      const bounds = L.latLngBounds(positions as any);
      map.fitBounds(bounds, { padding: [50, 50] } as any);
    } else if (positions.length === 1) {
      map.setView(positions[0] as [number, number], 10);
    }
  }, [positions, map]);
  return null;
}

function AutoUpdateMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface RealTimeMapProps {
  originAddress: string;
  destinationAddress: string;
  currentLocation?: {
    lat: number;
    lng: number;
    name?: string;
  };
  showRoute?: boolean;
  height?: string;
}

export default function RealTimeMap({
  originAddress,
  destinationAddress,
  currentLocation,
  showRoute = true,
  height = '500px',
}: RealTimeMapProps) {
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        const [originData, destData] = await Promise.all([
          geocodeAddress(originAddress),
          geocodeAddress(destinationAddress),
        ]);

        if (originData) {
          setOrigin([originData.lat, originData.lon]);
        }
        if (destData) {
          setDestination([destData.lat, destData.lon]);
        }

        if (!originData || !destData) {
          setError('Could not geocode addresses. Please check the addresses.');
        }
      } catch (err) {
        setError('Failed to load map data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [originAddress, destinationAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error || !origin || !destination) {
    return (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl" style={{ height }}>
        <div className="text-center p-8">
          <p className="text-red-500 mb-2">{error || 'Unable to display map'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Origin: {originAddress}<br />
            Destination: {destinationAddress}
          </p>
        </div>
      </div>
    );
  }

  const currentPos: [number, number] | null = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : null;

  const allPositions: L.LatLngExpression[] = [origin];
  if (currentPos) allPositions.push(currentPos);
  allPositions.push(destination);

  // Create route points (simple straight line or via current location)
  const routePoints: L.LatLngExpression[] = showRoute
    ? currentPos
      ? [origin, currentPos, destination]
      : [origin, destination]
    : [];

  const mapCenter: [number, number] = currentPos || [
    (origin[0] + destination[0]) / 2,
    (origin[1] + destination[1]) / 2,
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={currentPos ? 6 : 5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Origin Marker */}
        <Marker position={origin} icon={originIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-green-600">Origin</p>
              <p className="text-sm">{originAddress}</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={destination} icon={destinationIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-red-600">Destination</p>
              <p className="text-sm">{destinationAddress}</p>
            </div>
          </Popup>
        </Marker>

        {/* Current Location Marker with Animation */}
        {currentPos && (
          <>
            <PulsingMarker position={currentPos} />
            <Marker position={currentPos} icon={currentLocationIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-blue-600">Current Location</p>
                  <p className="text-sm">{currentLocation?.name || 'In Transit'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentPos[0].toFixed(4)}, {currentPos[1].toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Route Line */}
        {showRoute && routePoints.length >= 2 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: '#D40511',
              weight: 4,
              opacity: 0.8,
              dashArray: currentPos ? '10, 5' : undefined,
            }}
          />
        )}

        {/* Auto-fit bounds */}
        <FitBounds positions={allPositions} />

        {/* Auto-update center if current location changes */}
        {currentPos && <AutoUpdateMap center={currentPos} />}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000] border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span className="font-semibold">Origin</span>
          </div>
          {currentPos && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white animate-pulse"></div>
              <span className="font-semibold">Current Location</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="font-semibold">Destination</span>
          </div>
        </div>
      </div>
    </div>
  );
}

