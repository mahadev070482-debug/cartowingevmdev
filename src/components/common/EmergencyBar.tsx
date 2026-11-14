import React from 'react';
import { PhoneCall, MessageSquare, Zap, ShieldCheck } from 'lucide-react';
import { BASE_GARAGE } from '../../data/seedData';

export const EmergencyBar: React.FC = () => {
  return (
    <aside aria-label="Emergency Dispatch Bar" className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/30 text-white shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        
        {/* Left Badge: 24/7 Dispatch Live */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full text-emerald-400 font-semibold tracking-wide text-[11px] sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>24/7 DISPATCH LIVE</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-300 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Certified 100% Zero-Drag Hydraulic Flatbeds for EVs</span>
          </div>
        </div>

        {/* Right Actions: Click-to-Call & WhatsApp */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Quick Call */}
          <a
            href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg shadow-glow-sm transition-all duration-200 transform active:scale-95 text-xs sm:text-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
            <span>Call: {BASE_GARAGE.phone}</span>
          </a>

          {/* WhatsApp Live Chat */}
          <a
            href={`https://wa.me/${BASE_GARAGE.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20VOLTRESCUE,%20I%20need%20emergency%20EV%20towing%20assistance`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg transition-all duration-200 text-xs sm:text-sm shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200" />
            <span className="hidden sm:inline">WhatsApp Chat</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>

      </div>
    </aside>
  );
};
