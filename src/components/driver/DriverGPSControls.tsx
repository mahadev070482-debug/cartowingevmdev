import React, { useState, useEffect, useRef } from 'react';
import { TowRequest, TowTruck } from '../../types';
import { store } from '../../services/store';
import { Navigation, Phone, Radio, ExternalLink } from 'lucide-react';

interface DriverGPSControlsProps {
  request: TowRequest;
  truck: TowTruck;
}

export const DriverGPSControls: React.FC<DriverGPSControlsProps> = ({ request, truck }) => {
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [simulatedHeading, setSimulatedHeading] = useState(45);
  const watchIdRef = useRef<number | null>(null);
  const lastWriteTimeRef = useRef<number>(0);

  const broadcastCoordinates = (lat: number, lng: number, heading = 0, speed = 32) => {
    const now = Date.now();
    if (now - lastWriteTimeRef.current < 4500) {
      return;
    }
    lastWriteTimeRef.current = now;
    store.updateDriverLocation(truck.id, lat, lng, heading, speed);
  };

  useEffect(() => {
    if (!gpsEnabled) {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, heading, speed } = pos.coords;
            broadcastCoordinates(latitude, longitude, heading || 0, speed ? Math.round(speed * 3.6) : 30);
          },
          (err) => {
            console.warn('Geolocation watch error (falling back to realistic simulator):', err.message);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 4000,
            timeout: 10000
          }
        );
        watchIdRef.current = id;
      } catch (e) {
        console.warn('Geolocation not accessible:', e);
      }
    }

    const interval = setInterval(() => {
      const targetLat = request.status === 'in_transit' 
        ? request.pickupLocation.lat + 0.03
        : request.pickupLocation.lat;
      const targetLng = request.status === 'in_transit'
        ? request.pickupLocation.lng + 0.03
        : request.pickupLocation.lng;

      const currentLat = truck.currentLocation.lat;
      const currentLng = truck.currentLocation.lng;

      const deltaLat = (targetLat - currentLat) * 0.08;
      const deltaLng = (targetLng - currentLng) * 0.08;

      const nextLat = currentLat + deltaLat;
      const nextLng = currentLng + deltaLng;
      const nextHeading = (simulatedHeading + 10) % 360;
      setSimulatedHeading(nextHeading);

      broadcastCoordinates(nextLat, nextLng, nextHeading, 34);
    }, 5000);

    return () => {
      clearInterval(interval);
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [gpsEnabled, request.status, truck.id]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${request.pickupLocation.lat},${request.pickupLocation.lng}`;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      
      {/* GPS Status Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className={`w-4 h-4 ${gpsEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span className="text-xs font-bold text-slate-900">Live GPS Telemetry</span>
          <span className="text-[10px] text-slate-500 font-mono">
            (5s Throttled)
          </span>
        </div>

        {/* GPS Toggle Switch */}
        <button
          onClick={() => setGpsEnabled(!gpsEnabled)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
            gpsEnabled
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-white text-slate-600 border border-slate-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${gpsEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          <span>{gpsEnabled ? 'GPS Sharing: ON' : 'GPS Sharing: OFF'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-600 px-0.5">
        <span>Current Coordinates:</span>
        <span className="font-mono text-slate-800 font-medium">
          {truck.currentLocation.lat.toFixed(4)}°N, {truck.currentLocation.lng.toFixed(4)}°E
        </span>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Navigation className="w-4 h-4" />
          <span>Google Maps Nav</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>

        <a
          href={`tel:${request.customerPhone.replace(/\s+/g, '')}`}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Phone className="w-4 h-4" />
          <span>Call Customer</span>
        </a>
      </div>

    </div>
  );
};
