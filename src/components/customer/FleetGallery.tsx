import React, { useState } from 'react';
import { FLEET_EQUIPMENT_IMAGES, FleetEquipmentImage } from '../../data/seedData';
import {
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';

export const createStockDummySvg = (item: FleetEquipmentImage) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none">
    <rect width="800" height="600" fill="#0f172a"/>
    <defs>
      <linearGradient id="grad-${item.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284c7" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95"/>
      </linearGradient>
      <pattern id="grid-${item.id}" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="1" stroke-opacity="0.35"/>
      </pattern>
    </defs>
    <rect width="800" height="600" fill="url(#grad-${item.id})"/>
    <rect width="800" height="600" fill="url(#grid-${item.id})"/>
    
    <rect x="24" y="24" width="752" height="552" rx="16" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 8" stroke-opacity="0.4"/>
    
    <!-- Top badge: TEMP IMAGE LOGO -->
    <rect x="250" y="44" width="300" height="36" rx="18" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="400" y="67" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="#38bdf8" text-anchor="middle" letter-spacing="2">⚡ TEMP IMAGE LOGO • STOCK ASSET</text>
    
    <!-- Central Icon/Logo Emblem -->
    <circle cx="400" cy="230" r="74" fill="#1e293b" stroke="#0ea5e9" stroke-width="3"/>
    <circle cx="400" cy="230" r="62" fill="#0f172a"/>
    <!-- Truck / EV Icon -->
    <path d="M355 242 L355 214 C355 209 359 205 364 205 L412 205 L432 225 L444 225 C448 225 452 229 452 233 L452 252 L355 252 Z" fill="none" stroke="#38bdf8" stroke-width="4.5" stroke-linejoin="round"/>
    <circle cx="375" cy="258" r="11" fill="#0f172a" stroke="#38bdf8" stroke-width="3.5"/>
    <circle cx="428" cy="258" r="11" fill="#0f172a" stroke="#38bdf8" stroke-width="3.5"/>
    <path d="M392 218 L406 218 L401 230 L414 230 L396 248 L400 235 L387 235 Z" fill="#38bdf8"/>

    <!-- Large Unit Code / Tag -->
    <text x="400" y="355" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">${item.id} // ${item.tag.toUpperCase()}</text>
    <text x="400" y="390" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#38bdf8" text-anchor="middle">${item.title}</text>
    <text x="400" y="425" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#94a3b8" text-anchor="middle">${item.specs}</text>
    
    <!-- Bottom Stamp: Official Fleet Asset -->
    <rect x="210" y="488" width="380" height="36" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <text x="400" y="511" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#94a3b8" text-anchor="middle" letter-spacing="1.5">⚡ VOLTRESCUE HYDERABAD • FLEET SPECIFICATION</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const FleetGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Fleet & Equipment' },
    { id: 'flatbeds', label: 'Hydraulic Flatbeds' },
    { id: 'skates', label: 'Wheel Skates & Winches' },
    { id: 'chargers', label: 'Mobile EV Chargers' },
    { id: 'safety', label: 'Safety & Wheel Harness' }
  ];

  const filteredImages = activeCategory === 'all'
    ? FLEET_EQUIPMENT_IMAGES
    : FLEET_EQUIPMENT_IMAGES.filter(img => img.category === activeCategory);

  const handleOpenLightbox = (index: number) => {
    setSelectedImageIdx(index);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx + 1) % filteredImages.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <section id="fleet-gallery" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5 text-sky-600" />
            <span>Our Fleet & Equipment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialized EV Fleet & Rescue Equipment
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            25+ years of recovery experience backed by specialized zero-degree hydraulic flatbeds, soft rim webbing, Go-Jack wheel skates, and on-site EV rescue chargers.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Image Grid (Images-focused Section) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredImages.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(idx)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              {/* Image */}
              <img
                src={createStockDummySvg(item)}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              {/* Tag Badge Top Left */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border border-slate-200">
                {item.tag}
              </div>

              {/* Expand Icon Top Right */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>

              {/* Bottom Image Label */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs sm:text-sm font-bold line-clamp-1 drop-shadow-sm">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                  {item.specs}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Fullscreen Modal */}
        {selectedImageIdx !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImageIdx(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIdx(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition"
              aria-label="Close image viewer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <div
              className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={createStockDummySvg(filteredImages[selectedImageIdx])}
                alt={filteredImages[selectedImageIdx].title}
                className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/10"
              />
              <div className="text-center mt-4 text-white">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 border border-sky-800 px-2.5 py-0.5 rounded-full mb-1">
                  {filteredImages[selectedImageIdx].tag}
                </span>
                <h3 className="text-base sm:text-lg font-bold">
                  {filteredImages[selectedImageIdx].title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl mx-auto">
                  {filteredImages[selectedImageIdx].specs}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Image {selectedImageIdx + 1} of {filteredImages.length}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
