import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

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
  showRoute?: boolean;
  interactive?: boolean;
}

// Custom icons using clean inline SVG HTML for Leaflet DivIcon
const createCustomIcon = (type: MapMarker['type'], title: string) => {
  let iconHtml = '';
  let className = '';

  if (type === 'pickup') {
    iconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-2 bg-red-500/30 rounded-full animate-ping"></div>
        <div class="w-10 h-10 bg-gradient-to-tr from-red-600 to-rose-400 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
      </div>
    `;
    className = 'pickup-marker';
  } else if (type === 'truck') {
    iconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-3 bg-cyan-400/30 rounded-full animate-pulse"></div>
        <div class="w-11 h-11 bg-gradient-to-tr from-cyan-600 to-sky-400 rounded-full flex items-center justify-center text-slate-950 shadow-xl border-2 border-cyan-200">
          <svg class="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7h8m-8 4h5m4 0h3a1 1 0 011 1v6a1 1 0 01-1 1h-2m-9 0H7m0 0a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4zM3 13V6a1 1 0 011-1h7a1 1 0 011 1v7m-9 0h9"/>
          </svg>
        </div>
      </div>
    `;
    className = 'truck-marker';
  } else if (type === 'dropoff') {
    iconHtml = `
      <div class="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
    `;
    className = 'dropoff-marker';
  } else {
    iconHtml = `
      <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white">
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
      doubleClickZoom: interactive,
      attributionControl: false
    });

    // Dark sleek OpenStreetMap tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap & CartoDB'
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <div style="font-weight: 700; font-size: 13px; color: #00D2FF; margin-bottom: 2px;">${m.title}</div>
          ${m.subtitle ? `<div style="font-size: 11px; color: #94a3b8;">${m.subtitle}</div>` : ''}
          <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Lat: ${m.lat.toFixed(4)}, Lng: ${m.lng.toFixed(4)}</div>
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
        color: '#00D2FF',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);
      routeLayerRef.current = polyline;
    }

    // Auto-fit bounds
    if (latLngList.length > 1) {
      const bounds = L.latLngBounds(latLngList);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (latLngList.length === 1) {
      map.setView(latLngList[0], Math.max(map.getZoom(), 14));
    }
  }, [markers, showRoute, onMarkerDragEnd]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-700/60 shadow-xl ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[280px]" />
      
      {/* Visual Overlay Accent */}
      <div className="absolute top-2 left-2 z-[400] bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-cyan-300 border border-slate-700/60 flex items-center gap-1.5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Live GPS Map (OSM / VoltGIS™)
      </div>
    </div>
  );
};
