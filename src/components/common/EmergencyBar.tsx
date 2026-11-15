import React from 'react';
import { PhoneCall, MessageSquare, ShieldCheck } from 'lucide-react';
import { BASE_GARAGE } from '../../data/seedData';

export const EmergencyBar: React.FC = () => {
  return (
    <aside aria-label="Emergency Dispatch Bar" className="bg-slate-900 text-white border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
        
        {/* Left Badge: 24/7 Dispatch Live */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>24/7 Dispatch Live</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>25+ Years Experience • Madhapur HQ, Hyderabad • Zero-Drag Flatbed Assistance</span>
          </div>
        </div>

        {/* Right Actions: Click-to-Call & WhatsApp */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Quick Call */}
          <a
            href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3 py-1 rounded-md text-xs transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call: {BASE_GARAGE.phone}</span>
          </a>

          {/* WhatsApp Live Chat */}
          <a
            href={`https://wa.me/${BASE_GARAGE.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20need%20EV%20roadside%20towing%20assistance`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1 rounded-md text-xs transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>

      </div>
    </aside>
  );
};
