import React, { useState } from 'react';
import { Search, Compass, PhoneCall, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface TrackingTicketLookupProps {
  onTrackSearch: (query: string) => void;
}

export const TrackingTicketLookup: React.FC<TrackingTicketLookupProps> = ({ onTrackSearch }) => {
  const [trackQuery, setTrackQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      onTrackSearch(trackQuery.trim());
    }
  };

  return (
    <section id="tracking-ticket-section" className="py-10 bg-slate-100/80 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card: Track Active Tow Ticket (Positioned BELOW Request Booking) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Track Your Active Tow Ticket
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Live GPS
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Already submitted a booking? Enter your 6-digit ticket ID (e.g. <strong className="text-slate-700">VT-8492</strong>) or 10-digit mobile number:
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onTrackSearch('VT-3108')}
              className="self-start sm:self-auto bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1.5"
              title="Test with active demo ticket"
            >
              <span>Demo #VT-3108</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="pt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. VT-8492) or Registered Mobile..."
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 transition"
              />
            </div>

            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Track Ticket Status</span>
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Shows live truck location, driver phone, verified quote & estimated time of arrival (ETA).</span>
            </div>
            <span className="text-slate-400">Updates every 5 seconds</span>
          </div>

        </div>

      </div>
    </section>
  );
};
