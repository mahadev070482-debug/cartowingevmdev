import React, { useState } from 'react';
import { RESCUE_GALLERY, RescueGalleryItem } from '../../data/galleryData';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  X,
  Wrench,
  Car,
  Layers,
  ChevronRight,
  Zap
} from 'lucide-react';

interface RescueGalleryProps {
  onSelectBookNow?: () => void;
}

export const RescueGallery: React.FC<RescueGalleryProps> = ({ onSelectBookNow }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<RescueGalleryItem | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Rescues', count: RESCUE_GALLERY.length },
    { id: 'highway', label: 'Luxury & SUVs', count: RESCUE_GALLERY.filter(i => i.category === 'highway').length },
    { id: 'accident', label: 'Accident & Total Loss', count: RESCUE_GALLERY.filter(i => i.category === 'accident').length },
    { id: 'battery', label: 'EV & Battery Safe', count: RESCUE_GALLERY.filter(i => i.category === 'battery').length },
    { id: 'tire', label: 'Breakdown & Roadside', count: RESCUE_GALLERY.filter(i => i.category === 'tire').length },
  ];

  const filteredItems = activeFilter === 'all'
    ? RESCUE_GALLERY
    : RESCUE_GALLERY.filter(item => item.category === activeFilter);

  const handleBookNowClick = () => {
    setSelectedCase(null);
    if (onSelectBookNow) {
      onSelectBookNow();
    } else {
      const el = document.getElementById('booking-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="gallery-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            Verified Case Studies
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Recent Successful EV Recoveries
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            See how our hydraulic flatbeds and EV-certified technicians rescue stranded electric vehicles with zero-degree ground tilt, zero wheel-arch damage, and complete high-voltage battery protection.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                activeFilter === tab.id ? 'bg-slate-700 text-sky-300' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Image & Quick Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Duration Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-slate-200">
                  <Clock className="w-3 h-3 text-sky-600" />
                  <span>{item.duration}</span>
                </div>

                {/* Vehicle Pill */}
                <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur text-sky-300 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Car className="w-3 h-3 text-sky-400" />
                  <span>{item.vehicle}</span>
                </div>

                {/* Bottom title overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-black/40 backdrop-blur px-2 py-0.5 rounded mb-1">
                    {item.categoryLabel}
                  </span>
                  <p className="text-sm font-semibold line-clamp-1 drop-shadow-sm">
                    {item.id} &bull; {item.title}
                  </p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Locations */}
                  <div className="space-y-1.5 text-xs text-slate-500 mb-3.5 pb-3.5 border-b border-slate-100">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium line-clamp-1">{item.location}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 line-clamp-1">To: {item.destination}</span>
                    </div>
                  </div>

                  {/* Incident Summary */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      <strong className="text-slate-800">Issue:</strong> {item.issue}
                    </p>
                  </div>

                  {/* Equipment Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.equipmentUsed.map((eq, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md"
                      >
                        <Wrench className="w-2.5 h-2.5 text-slate-400" />
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Zero-Degree Verified</span>
                  </div>

                  <button
                    onClick={() => setSelectedCase(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 group-hover:translate-x-0.5 transition"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal / Case Study Lightbox */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image Header */}
              <div className="relative aspect-[16/9] bg-slate-100">
                <img
                  src={selectedCase.imageUrl}
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedCase(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {selectedCase.vehicle}
                  </span>
                  <span className="bg-black/60 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedCase.duration}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                    Case Study #{selectedCase.id} &bull; {selectedCase.categoryLabel}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {selectedCase.title}
                  </h3>
                </div>

                {/* Location Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500">Breakdown Location:</span>
                      <p className="font-semibold text-slate-800">{selectedCase.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500">Destination:</span>
                      <p className="font-semibold text-slate-800">{selectedCase.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Incident Specifics */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      The Challenge / Problem
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-amber-50/70 border border-amber-200 rounded-lg p-3">
                      {selectedCase.issue}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Our Flatbed Solution & Recovery Method
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {selectedCase.story}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Specialized Equipment Deployed
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.equipmentUsed.map((eq, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-lg"
                        >
                          <Wrench className="w-3.5 h-3.5 text-sky-600" />
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          Verified Outcome
                        </span>
                        <p className="text-sm text-emerald-900 font-medium mt-0.5">
                          {selectedCase.verifiedOutcome}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 gap-3">
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition"
                  >
                    Close
                  </button>

                  <button
                    onClick={handleBookNowClick}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Request Similar Flatbed Rescue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
