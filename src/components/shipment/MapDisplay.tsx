'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { geocodeAddress } from '@/lib/geocode';

const senderIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const recipientIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitBounds({ positions }: { positions: L.LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length) {
      const bounds = L.latLngBounds(positions as any);
      map.fitBounds(bounds, { padding: [30, 30] } as any);
    }
  }, [positions, map]);
  return null;
}

export default function MapDisplay({ senderAddress, recipientAddress }: { senderAddress: string; recipientAddress: string; }) {
  const [points, setPoints] = useState<L.LatLngExpression[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r] = await Promise.all([
          geocodeAddress(senderAddress),
          geocodeAddress(recipientAddress),
        ]);
        const pts: L.LatLngExpression[] = [];
        if (s) pts.push([s.lat, s.lon]);
        if (r) pts.push([r.lat, r.lon]);
        setPoints(pts);
      } catch {
        setPoints([]);
      }
    };
    load();
  }, [senderAddress, recipientAddress]);

  if (!points.length) {
    return <div className="text-sm text-gray-500">Map unavailable right now.</div>;
  }

  return (
    <div className="h-80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <MapContainer center={points[0]} zoom={5} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {points[0] && <Marker position={points[0]} icon={senderIcon}></Marker>}
        {points[1] && <Marker position={points[1]} icon={recipientIcon}></Marker>}
        {points.length === 2 && <Polyline positions={points} color="#D40511" />}
        <FitBounds positions={points} />
      </MapContainer>
    </div>
  );
}


