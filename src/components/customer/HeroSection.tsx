import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle2, AlertTriangle, PhoneCall, MessageSquare, Award, MapPin } from 'lucide-react';
import { BASE_GARAGE } from '../../data/seedData';

interface HeroSectionProps {
  onScrollToBooking: () => void;
  onTrackSearch: (query: string) => void;
  onOpenWhyFlatbed: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToBooking,
  onTrackSearch,
  onOpenWhyFlatbed,
}) => {
  const [trackQuery, setTrackQuery] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      onTrackSearch(trackQuery.trim());
    }
  };

  return (
    <section className="bg-slate-50 border-b border-slate-200 pt-8 pb-14 lg:pt-12 lg:pb-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Pill Tag with 25+ Yrs & Madhapur */}
            <div className="inline-flex flex-wrap items-center gap-2 bg-sky-100 text-sky-800 border border-sky-200 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>25+ Years Experience</span>
              <span className="text-sky-400">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-600" />
                <span>Madhapur HQ, Hyderabad</span>
              </span>
              <span className="text-sky-400">•</span>
              <span className="text-slate-600 font-mono">evvehiclwtowing.com</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Hyderabad&apos;s #1 EV Flatbed Towing <br className="hidden sm:inline" />
              <span className="text-sky-600">Zero-Drag Roadside Assistance.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Standard towing burns out electric vehicle motors and inverters. With <strong className="text-slate-800">25+ years of trusted vehicle recovery experience</strong> and headquarters in <strong className="text-slate-800">Madhapur</strong>, our certified fleet operates hydraulic tilt flatbeds and wheel skates for 100% zero-drag transport across Hitec City, Gachibowli, Outer Ring Road (ORR), and Shamshabad Airport.
            </p>

            {/* Quick Action Buttons: Book, Call, WhatsApp */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={onScrollToBooking}
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-5 py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>Request EV Flatbed</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-sm px-4 py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                title="Direct Emergency Dial"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Call: {BASE_GARAGE.phone}</span>
              </a>

              <a
                href={`https://wa.me/${BASE_GARAGE.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Dispatch%2C%20I%20need%20emergency%20EV%20flatbed%20towing%20assistance%20in%20Hyderabad`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                title="WhatsApp Redirection"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Trust Highlights Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>25+ Years Towing Heritage</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Motor Drag Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2-Min Verification Call</span>
              </div>
            </div>

          </div>

          {/* Right Hero Card: Quick Track & EV Safety Callout (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Track Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-slate-900 text-base">Track Active Tow Request</h2>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Already submitted a request? Check live truck status and location by Tracking ID (e.g. <strong className="text-slate-800">VT-8492</strong>) or phone:
              </p>

              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter VT-XXXX or Mobile (0000000000)"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-sky-500 focus:bg-white rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Track Status</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTrackSearch('VT-3108')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium px-3 py-2.5 rounded-lg border border-slate-200 transition"
                    title="Load Active Demo Request"
                  >
                    Demo #VT-3108
                  </button>
                </div>
              </form>
            </div>

            {/* EV Safety Callout Box */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Important note for electric vehicle owners:</p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Never tow an EV with wheels rolling on the pavement. We load your entire vehicle onto our hydraulic deck so the motors remain stationary.
                </p>
                <button
                  onClick={onOpenWhyFlatbed}
                  className="mt-1.5 text-sky-700 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Learn how flatbed towing protects your warranty</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
