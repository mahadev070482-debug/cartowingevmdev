import React from 'react';
import { PhoneCall, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';
import { BASE_GARAGE } from '../../data/seedData';

export const FloatingContactBar: React.FC = () => {
  const cleanPhone = BASE_GARAGE.phone.replace(/\s+/g, '');
  const cleanWhatsapp = BASE_GARAGE.whatsapp.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWhatsapp}?text=Hi%20Dispatch%20Team%2C%20I%20need%20emergency%20flatbed%20towing%20assistance%20in%20Hyderabad.`;

  return (
    <aside aria-label="Quick Emergency Contact Dock" className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 z-40 max-w-sm sm:max-w-md w-auto">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col gap-2 ring-1 ring-white/10">
        
        {/* Top Mini-Ticker with 25+ Yrs & Madhapur HQ */}
        <div className="flex items-center justify-between text-[11px] px-1 text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>25+ Yrs Exp • 24/7 Live</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span>HQ: Gachibowli, Hyd</span>
          </div>
        </div>

        {/* Action Buttons: 1-Tap Dial & 1-Tap WhatsApp */}
        <div className="grid grid-cols-2 gap-2">
          {/* Quick Dial */}
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-md transition"
            title="Direct Phone Call to 24/7 Tow Dispatcher"
          >
            <PhoneCall className="w-4 h-4 shrink-0 text-white animate-bounce" />
            <span className="truncate">Call Now</span>
          </a>

          {/* Quick WhatsApp Redirection */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-md transition"
            title="Chat directly on WhatsApp for Live Dispatch & Assistance"
          >
            <MessageSquare className="w-4 h-4 shrink-0 text-white" />
            <span className="truncate">WhatsApp</span>
          </a>
        </div>

      </div>
    </aside>
  );
};
