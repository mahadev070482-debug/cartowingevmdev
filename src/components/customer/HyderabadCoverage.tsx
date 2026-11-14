import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { ServiceableLocation } from '../../types';
import {
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  Search,
  ArrowRight,
  Zap,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { BASE_GARAGE } from '../../data/seedData';

interface HyderabadCoverageProps {
  onSelectArea?: (areaName: string, landmark: string) => void;
}

export const HyderabadCoverage: React.FC<HyderabadCoverageProps> = ({ onSelectArea }) => {
  const [locations, setLocations] = useState<ServiceableLocation[]>(store.getServiceableLocations());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeZoneFilter, setActiveZoneFilter] = useState('all');

  useEffect(() => {
    const update = () => {
      setLocations([...store.getServiceableLocations()]);
    };
    const unsubscribe = store.subscribe(update);
    return () => unsubscribe();
  }, []);

  const activeLocations = locations.filter(l => l.isActive);

  // Extract unique zones
  const zones = ['all', ...Array.from(new Set(activeLocations.map(l => l.zone)))];

  const filtered = activeLocations.filter(loc => {
    const matchesZone = activeZoneFilter === 'all' || loc.zone === activeZoneFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      loc.name.toLowerCase().includes(q) ||
      loc.zone.toLowerCase().includes(q) ||
      loc.hubLandmark.toLowerCase().includes(q) ||
      loc.pincodes.some(p => p.includes(q));
    return matchesZone && matchesSearch;
  });

  const handleBookInArea = (loc: ServiceableLocation) => {
    if (onSelectArea) {
      onSelectArea(loc.name, loc.hubLandmark);
    } else {
      const el = document.getElementById('booking-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="coverage-areas" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-sky-200">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Hyderabad & Cyberabad 24/7 Coverage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Serviceable Corridors & EV Flatbed Recovery Hubs
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Our specialized zero-drag hydraulic flatbeds and rapid battery-boost trucks are stationed across Hyderabad&apos;s key IT corridors, Outer Ring Road (ORR) junctions, and expressways for 12–20 minute arrival.
          </p>
        </div>

        {/* Search & Zone Filter Bar */}
        <div className="max-w-4xl mx-auto mb-8 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your Hyderabad locality or pincode (e.g. Gachibowli, ORR, Madhapur, Kondapur, 500032)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pl-11 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-600 shadow-sm"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Zone Filter Chips */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 pt-1">
            {zones.map(z => (
              <button
                key={z}
                onClick={() => setActiveZoneFilter(z)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  activeZoneFilter === z
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {z === 'all' ? 'All Corridors' : z}
              </button>
            ))}
          </div>
        </div>

        {/* Coverage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-10">
          {filtered.map(loc => (
            <div
              key={loc.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                    {loc.zone}
                  </span>
                  {loc.priorityHub && (
                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Express
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-600 transition">
                  {loc.name}
                </h3>

                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  <strong className="text-slate-700">Hub:</strong> {loc.hubLandmark}
                </p>

                <div className="flex flex-wrap gap-1 my-3">
                  {loc.pincodes.map((pin, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                    >
                      PIN: {pin}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>~{loc.avgResponseMins} mins response</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    24/7 Available
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleBookInArea(loc)}
                  className="w-full bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Zap className="w-3.5 h-3.5 text-sky-600 group-hover:text-white" />
                  <span>Request Tow in this Area</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Out of area banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Stranded outside standard Hyderabad zones or on Telangana State Highways?
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Our long-distance EV carriers service Vijayawada Highway (NH65), Bengaluru Highway (NH44), and Warangal Highway.
              </p>
            </div>
          </div>

          <a
            href={`tel:${BASE_GARAGE.phone}`}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shrink-0 shadow-sm transition"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 24/7 Dispatch Hotline</span>
          </a>
        </div>

      </div>
    </section>
  );
};
