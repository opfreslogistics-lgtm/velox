'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { geocodeAddress } from '@/lib/geocode';
import 'mapbox-gl/dist/mapbox-gl.css';

interface GoogleMapProps {
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

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';
const BRAND_RED = '#D40511';

export default function GoogleMapComponent({
  originAddress,
  destinationAddress,
  currentLocation,
  showRoute = true,
  height = '500px',
}: GoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [currentLocationCoords, setCurrentLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Load coordinates (geocode addresses if needed)
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        const geocodePromises = [geocodeAddress(originAddress), geocodeAddress(destinationAddress)];
        if (currentLocation?.name && !currentLocation.lat) {
          geocodePromises.push(geocodeAddress(currentLocation.name));
        }

        const results = await Promise.all(geocodePromises);
        const [originData, destData, currentData] = results;

        if (originData) setOrigin({ lat: originData.lat, lng: originData.lon });
        if (destData) setDestination({ lat: destData.lat, lng: destData.lon });

        if (currentLocation) {
          if (currentLocation.lat && currentLocation.lng) {
            setCurrentLocationCoords({ lat: currentLocation.lat, lng: currentLocation.lng });
          } else if (currentData) {
            setCurrentLocationCoords({ lat: currentData.lat, lng: currentData.lon });
          }
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
  }, [originAddress, destinationAddress, currentLocation]);

  // Initialize Mapbox map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [0, 0],
      zoom: 1.5,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.on('load', () => setMapReady(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers, polyline, and fit bounds whenever data changes
  useEffect(() => {
    if (!mapRef.current || !mapReady || !origin || !destination) return;
    const map = mapRef.current;

    // Clear previous markers and route
    const existingMarkers = map.getContainer().querySelectorAll('.velox-marker');
    existingMarkers.forEach((el) => el.remove());
    if (map.getLayer('route-line')) {
      map.removeLayer('route-line');
    }
    if (map.getSource('route')) {
      map.removeSource('route');
    }

    const points: [number, number, string][] = [
      [origin.lng, origin.lat, 'Sender Location'],
    ];
    if (currentLocationCoords) {
      points.push([currentLocationCoords.lng, currentLocationCoords.lat, 'Current Location']);
    }
    points.push([destination.lng, destination.lat, 'Receiver Location']);

    const createMarker = (coords: [number, number], color: string, label: string, pulsing = false) => {
      const el = document.createElement('div');
      el.className = 'velox-marker';
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.borderRadius = '50%';
      el.style.background = color;
      el.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.9)';
      el.style.border = '2px solid #ffffff';
      if (pulsing) {
        el.style.animation = 'velox-pulse 1.4s infinite';
      }
      const marker = new mapboxgl.Marker(el).setLngLat(coords).setPopup(new mapboxgl.Popup({ offset: 12 }).setText(label));
      marker.addTo(map);
    };

    // Markers
    createMarker([origin.lng, origin.lat], '#0EA5E9', 'Sender Location');
    if (currentLocationCoords) {
      createMarker([currentLocationCoords.lng, currentLocationCoords.lat], '#FFCC00', 'Current Location', true);
    }
    createMarker([destination.lng, destination.lat], '#22C55E', 'Receiver Location');

    // Polyline
    if (showRoute && points.length >= 2) {
      const coordinates = points.map((p) => [p[0], p[1]]);
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
          properties: {},
        },
      });
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': BRAND_RED,
          'line-width': 4,
          'line-opacity': 0.9,
        },
      });
    }

    // Fit bounds
    const bounds = new mapboxgl.LngLatBounds();
    points.forEach((p) => bounds.extend([p[0], p[1]]));
    map.fitBounds(bounds, { padding: 60, animate: true });
  }, [mapReady, origin, destination, currentLocationCoords, showRoute]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl" style={{ height }}>
        <div className="text-center p-8">
          <p className="text-red-500 mb-2">Mapbox token not configured</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local</p>
        </div>
      </div>
    );
  }

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
            Origin: {originAddress}
            <br />
            Destination: {destinationAddress}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg relative" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      <style jsx>{`
        @keyframes velox-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.4);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(255, 204, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 204, 0, 0);
          }
        }
      `}</style>
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000] border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white"></div>
            <span className="font-semibold">Sender Location</span>
          </div>
          {currentLocationCoords && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white animate-pulse"></div>
              <span className="font-semibold">Current Location</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span className="font-semibold">Receiver Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}

