'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { geocodeAddress } from '@/lib/geocode';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 0,
  lng: 0,
};

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

export default function GoogleMapComponent({
  originAddress,
  destinationAddress,
  currentLocation,
  showRoute = true,
  height = '500px',
}: GoogleMapProps) {
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [currentLocationCoords, setCurrentLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.LatLng[]>([]);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Geocode all addresses
        const geocodePromises = [
          geocodeAddress(originAddress),
          geocodeAddress(destinationAddress),
        ];

        // If current location is provided as a name, geocode it too
        if (currentLocation?.name && !currentLocation.lat) {
          geocodePromises.push(geocodeAddress(currentLocation.name));
        }

        const results = await Promise.all(geocodePromises);
        const [originData, destData, currentData] = results;

        if (originData) {
          setOrigin({ lat: originData.lat, lng: originData.lon });
        }
        if (destData) {
          setDestination({ lat: destData.lat, lng: destData.lon });
        }

        // Handle current location
        if (currentLocation) {
          if (currentLocation.lat && currentLocation.lng) {
            // Already has coordinates
            setCurrentLocationCoords({ lat: currentLocation.lat, lng: currentLocation.lng });
          } else if (currentData) {
            // Geocoded from name
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

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // Initialize directions service
    if (typeof google !== 'undefined') {
      const service = new google.maps.DirectionsService();
      setDirectionsService(service);
    }
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Calculate route when locations are ready
  useEffect(() => {
    if (!directionsService || !origin || !destination || typeof google === 'undefined') return;

    const waypoints: google.maps.DirectionsWaypoint[] = [];
    if (currentLocationCoords) {
      waypoints.push({
        location: new google.maps.LatLng(currentLocationCoords.lat, currentLocationCoords.lng),
        stopover: true,
      });
    }

    directionsService.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints.length > 0 ? waypoints : undefined,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          const path: google.maps.LatLng[] = [];
          result.routes[0].legs.forEach((leg) => {
            leg.steps.forEach((step) => {
              step.path.forEach((point) => {
                path.push(point);
              });
            });
          });
          setRoutePath(path);
        } else {
          // Fallback: create simple straight line path
          const simplePath: google.maps.LatLng[] = [
            new google.maps.LatLng(origin.lat, origin.lng),
          ];
          if (currentLocationCoords) {
            simplePath.push(new google.maps.LatLng(currentLocationCoords.lat, currentLocationCoords.lng));
          }
          simplePath.push(new google.maps.LatLng(destination.lat, destination.lng));
          setRoutePath(simplePath);
        }
      }
    );
  }, [directionsService, origin, destination, currentLocationCoords]);

  // Fit bounds when locations change
  useEffect(() => {
    if (!map || !origin || !destination || typeof google === 'undefined') return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(origin.lat, origin.lng));
    bounds.extend(new google.maps.LatLng(destination.lat, destination.lng));
    
    if (currentLocationCoords) {
      bounds.extend(new google.maps.LatLng(currentLocationCoords.lat, currentLocationCoords.lng));
    }

    map.fitBounds(bounds, { padding: 50 });
  }, [map, origin, destination, currentLocationCoords]);

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

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl" style={{ height }}>
        <div className="text-center p-8">
          <p className="text-red-500 mb-2">Google Maps API Key not configured</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
          </p>
        </div>
      </div>
    );
  }

  const center = currentLocationCoords
    ? { lat: currentLocationCoords.lat, lng: currentLocationCoords.lng }
    : {
        lat: (origin.lat + destination.lat) / 2,
        lng: (origin.lng + destination.lng) / 2,
      };

  // Custom marker icons (only create if google is loaded)
  const createMarkerIcon = (color: string, label: string) => {
    const g = (typeof window !== 'undefined' ? (window as any).google : undefined);
    if (!g || !g.maps || !g.maps.SymbolPath) return undefined;
    return {
      path: g.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      label: {
        text: label,
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    };
  };

  const originIcon = createMarkerIcon('#10B981', 'O');
  const destinationIcon = createMarkerIcon('#EF4444', 'D');
  const currentLocationIcon = createMarkerIcon('#3B82F6', '📍');

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg relative" style={{ height }}>
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['places', 'geometry']}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={currentLocation ? 6 : 5}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
        >
          {/* Origin Marker */}
          <Marker
            position={origin}
            icon={originIcon}
            onClick={() => setSelectedMarker('origin')}
          >
            {selectedMarker === 'origin' && (
              <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                <div className="text-center">
                  <p className="font-bold text-green-600">Origin</p>
                  <p className="text-sm">{originAddress}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>

          {/* Destination Marker */}
          <Marker
            position={destination}
            icon={destinationIcon}
            onClick={() => setSelectedMarker('destination')}
          >
            {selectedMarker === 'destination' && (
              <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                <div className="text-center">
                  <p className="font-bold text-red-600">Destination</p>
                  <p className="text-sm">{destinationAddress}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>

          {/* Current Location Marker */}
          {currentLocationCoords && (
            <Marker
              position={{ lat: currentLocationCoords.lat, lng: currentLocationCoords.lng }}
              icon={currentLocationIcon}
              onClick={() => setSelectedMarker('current')}
              animation={typeof google !== 'undefined' ? google.maps.Animation.BOUNCE : undefined}
            >
              {selectedMarker === 'current' && (
                <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <div className="text-center">
                    <p className="font-bold text-blue-600">Current Location</p>
                    <p className="text-sm">{currentLocation?.name || 'In Transit'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentLocationCoords.lat.toFixed(4)}, {currentLocationCoords.lng.toFixed(4)}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}

          {/* Route Polyline */}
          {showRoute && routePath.length > 0 && typeof google !== 'undefined' && (
            <Polyline
              path={routePath}
              options={{
                strokeColor: '#D40511',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                geodesic: true,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000] border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span className="font-semibold">Origin</span>
          </div>
          {currentLocationCoords && (
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

