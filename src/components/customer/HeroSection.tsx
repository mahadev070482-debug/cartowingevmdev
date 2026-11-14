import React, { useState } from 'react';
import { Zap, ShieldCheck, Clock, MapPin, Search, ArrowRight, CheckCircle2, AlertTriangle, PhoneCall } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-cyan-500/15 border border-cyan-400/30 px-3.5 py-1.5 rounded-full text-cyan-300 text-xs sm:text-sm font-semibold shadow-glow-sm">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
              <span>Specialized EV & Hybrid Flatbed Roadside Assistance</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Stranded in an EV? <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                Zero-Drag Flatbed Towing
              </span> <br />
              In Under 25 Minutes.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Standard tow trucks can ruin your EV’s motor and void your battery warranty. 
              We use <strong className="text-cyan-300">100% full-hydraulic flatbeds and wheel skates</strong> to protect your high-voltage drive unit.
            </p>

            {/* Fast Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onScrollToBooking}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-base px-8 py-4 rounded-xl shadow-glow-blue transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Request EV Tow Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-bold text-base px-6 py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5 text-emerald-400" />
                <span>Call Owner Directly</span>
              </a>
            </div>

            {/* Trust Highlights Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No Drag / No Gearbox Burn</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2-Min Call Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live GPS Map Tracking</span>
              </div>
            </div>

          </div>

          {/* Right Hero Card: Quick Track & EV Safety Callout (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Track My Tow Card */}
            <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full pointer-events-none" />

              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Search className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Track Existing Tow Request</h3>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Already booked with us? Enter your Tracking ID (e.g. <span className="text-cyan-400 font-mono">VT-8492</span>) or 10-digit mobile number for real-time truck location:
              </p>

              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter VT-XXXX or Mobile (+91)"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition shadow-glow-sm flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Track Status & Map</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTrackSearch('VT-3108')}
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs px-3 py-3 rounded-xl border border-slate-700 transition"
                    title="Load Active Demo Request"
                  >
                    Demo #VT-3108
                  </button>
                </div>
              </form>
            </div>

            {/* EV Safety Callout Box */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-300">
                  CRITICAL: Never tow an EV with wheels on the ground!
                </p>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Permanent magnet motors spin inside when wheels rotate, creating back-EMF voltage that can ignite the battery pack or burn the inverter.
                </p>
                <button
                  onClick={onOpenWhyFlatbed}
                  className="mt-2 text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1"
                >
                  <span>Learn how our zero-drag flatbed prevents this</span>
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
