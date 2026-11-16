import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RotateCcw, MapPin, LocateFixed } from 'lucide-react';

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  type: 'pickup' | 'truck' | 'dropoff' | 'base';
  subtitle?: string;
  draggable?: boolean;
}

interface LeafletMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMarkerDragEnd?: (lat: number, lng: number) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onRefreshLocation?: () => void;
  isRefreshing?: boolean;
  showRoute?: boolean;
  interactive?: boolean;
}

// Clean custom icons with crisp white border and natural shadows
const createCustomIcon = (type: MapMarker['type'], _title: string) => {
  let iconHtml = '';
  let className = '';

  if (type === 'pickup') {
    iconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-1.5 bg-red-500/20 rounded-full animate-ping"></div>
        <div class="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
      </div>
    `;
    className = 'pickup-marker';
  } else if (type === 'truck') {
    iconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-2 bg-sky-500/20 rounded-full animate-pulse"></div>
        <div class="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7h8m-8 4h5m4 0h3a1 1 0 011 1v6a1 1 0 01-1 1h-2m-9 0H7m0 0a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4zM3 13V6a1 1 0 011-1h7a1 1 0 011 1v7m-9 0h9"/>
          </svg>
        </div>
      </div>
    `;
    className = 'truck-marker';
  } else if (type === 'dropoff') {
    iconHtml = `
      <div class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
    `;
    className = 'dropoff-marker';
  } else {
    iconHtml = `
      <div class="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      </div>
    `;
    className = 'base-marker';
  }

  return L.divIcon({
    html: iconHtml,
    className: `custom-div-icon ${className}`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22]
  });
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  markers,
  center,
  zoom = 13,
  className = 'h-[360px] w-full',
  onMarkerDragEnd,
  onMapClick,
  onRefreshLocation,
  isRefreshing = false,
  showRoute = true,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialCenter: [number, number] = center || (markers.length > 0 ? [markers[0].lat, markers[0].lng] : [12.9538, 77.6980]);

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: zoom,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive ? 'center' : false,
      doubleClickZoom: onMapClick ? false : interactive,
      attributionControl: false
    });

    // 100% Free OpenStreetMap tile server - Zero API Key required
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle map click for point dropping
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onMapClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [onMapClick]);

  // Update markers and route lines when markers change
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (markers.length === 0) return;

    const latLngList: L.LatLngExpression[] = [];

    markers.forEach((m) => {
      const icon = createCustomIcon(m.type, m.title);
      const marker = L.marker([m.lat, m.lng], {
        icon,
        draggable: !!m.draggable
      });

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; padding: 2px;">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${m.title}</div>
          ${m.subtitle ? `<div style="font-size: 11px; color: #475569;">${m.subtitle}</div>` : ''}
          <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Lat: ${m.lat.toFixed(4)}, Lng: ${m.lng.toFixed(4)}</div>
        </div>
      `);

      if (m.draggable && onMarkerDragEnd) {
        marker.on('dragend', (e) => {
          const latLng = (e.target as L.Marker).getLatLng();
          onMarkerDragEnd(latLng.lat, latLng.lng);
        });
      }

      marker.addTo(markersGroup);
      latLngList.push([m.lat, m.lng]);
    });

    // Draw route line if requested and >= 2 markers
    if (showRoute && latLngList.length >= 2) {
      const polyline = L.polyline(latLngList, {
        color: '#0284c7',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 6',
        lineCap: 'round'
      }).addTo(map);
      routeLayerRef.current = polyline;
    }

    // Auto-fit bounds or pan to single marker
    if (latLngList.length > 1) {
      const bounds = L.latLngBounds(latLngList);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (latLngList.length === 1) {
      // PRESERVE user's current zoom level so tapping/clicking on mobile NEVER zooms out!
      map.panTo(latLngList[0] as [number, number], { animate: true, duration: 0.3 });
    }
  }, [markers, showRoute, onMarkerDragEnd]);

  return (
    <div className={`relative z-0 isolate overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div ref={containerRef} className={`w-full h-full min-h-[260px] ${onMapClick ? 'cursor-crosshair' : ''}`} />
      
      {/* Live GPS Map Badge */}
      <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700 border border-slate-200/80 flex items-center gap-1.5 shadow-sm pointer-events-none select-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Live GPS Map</span>
      </div>

      {/* Re-center / Refresh Location button */}
      {onRefreshLocation && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRefreshLocation();
          }}
          disabled={isRefreshing}
          className="absolute top-2.5 right-2.5 z-10 bg-white/95 hover:bg-white text-slate-700 hover:text-sky-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 shadow-sm flex items-center gap-1.5 transition disabled:opacity-60"
          title="Refresh GPS Location"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : 'text-slate-600'}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Location'}</span>
        </button>
      )}

      {/* Point dropping hint */}
      {onMapClick && (
        <div className="absolute bottom-2.5 left-2.5 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700 border border-slate-200/80 flex items-center gap-1.5 shadow-sm pointer-events-none select-none">
          <MapPin className="w-3.5 h-3.5 text-red-600" />
          <span>Click anywhere to drop vehicle pin</span>
        </div>
      )}
    </div>
  );
};
