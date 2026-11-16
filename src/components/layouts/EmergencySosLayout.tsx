import React from 'react';
import { TowRequest } from '../../types';
import { BASE_GARAGE } from '../../data/seedData';
import { store } from '../../services/store';
import { BookingForm } from '../customer/BookingForm';
import { TrackingTicketLookup } from '../customer/TrackingTicketLookup';
import { FleetGallery } from '../customer/FleetGallery';
import { ReviewsSection } from '../customer/ReviewsSection';
import { 
  PhoneCall, 
  MessageSquare, 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  Gauge, 
  Zap, 
  Radio,
  Flame,
  LifeBuoy
} from 'lucide-react';

interface EmergencySosLayoutProps {
  onBookingSuccess: (newRequest: TowRequest) => void;
  onTrackSearch: (query: string) => void;
  onScrollToBooking: () => void;
}

export const EmergencySosLayout: React.FC<EmergencySosLayoutProps> = ({
  onBookingSuccess,
  onTrackSearch,
  onScrollToBooking
}) => {
  const stats = store.getStats();
  const cleanPhone = BASE_GARAGE.phone.replace(/[^0-9]/g, '');

  const emergencyProtocols = [
    {
      title: "1. Turn on Hazard Flashers",
      desc: "Turn on your vehicle hazards immediately and place a warning triangle 50 meters behind if on a highway or ORR expressway."
    },
    {
      title: "2. Move Behind Safety Barrier",
      desc: "If broken down on the Outer Ring Road (ORR) or expressway, never sit inside the vehicle. Step safely onto the shoulder or behind guard rails."
    },
    {
      title: "3. 2-Minute Verification Call",
      desc: "Once you submit your ticket or call, our central dispatcher calls you back within 2 minutes with exact truck ETA and driver number."
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* 1. Flashing Emergency Command Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white font-black py-2.5 px-4 text-xs tracking-wider uppercase text-center shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>24/7 HIGHWAY EMERGENCY &amp; BREAKDOWN COMMAND</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>GACHIBOWLI HQ (TNGOS COLONY) • RAPID RESPONSE UNITS STANDBY</span>
        </div>
      </div>

      {/* 2. Rapid Response Hero: High-Visibility SOS Center */}
      <section className="py-12 sm:py-16 bg-slate-900 border-b-2 border-orange-500/40 relative overflow-hidden">
        
        {/* Amber hazard styling lines */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pulsing SOS Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span>Emergency First Responder • 25+ Years Experience</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Rapid Highway &amp; City Flatbed <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                Accident &amp; Breakdown Rescue
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Zero-drag hydraulic flatbeds and 4-point wheel skates stationed across Gachibowli, ORR Expressways, and Hitec City. 100% safe transport for electric cars, luxury sedans, and total collision vehicles.
            </p>

            {/* GIANT PULSING 1-TOUCH EMERGENCY SOS BUTTON */}
            <div className="pt-2 pb-2">
              <a
                href={`tel:${cleanPhone}`}
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-lg sm:text-xl py-5 px-8 sm:px-12 rounded-3xl shadow-2xl shadow-orange-600/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] border-2 border-orange-400/50"
              >
                <span className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-600 to-red-600 opacity-30 group-hover:opacity-60 blur-md transition duration-500"></span>
                <PhoneCall className="w-7 h-7 animate-bounce text-yellow-300 relative z-10 shrink-0" />
                <div className="text-left relative z-10">
                  <span className="block text-[11px] uppercase tracking-widest text-orange-200 font-bold">1-Touch Emergency Hotline</span>
                  <span className="text-white tracking-wide">CALL NOW: {BASE_GARAGE.phone}</span>
                </div>
              </a>
            </div>

            {/* Secondary WhatsApp & Booking Trigger */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/${BASE_GARAGE.whatsapp.replace(/[^0-9]/g, '')}?text=SOS!%20I%20have%20an%20emergency%20breakdown%20in%20Hyderabad`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow transition flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp SOS Beacon</span>
              </a>

              <button
                onClick={onScrollToBooking}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow transition flex items-center gap-2"
              >
                <span>Drop GPS Pin on Map</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>

            {/* Base Garage Address Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-950/80 border border-slate-800 text-xs text-slate-300 px-4 py-2.5 rounded-2xl mt-4">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-left">
                <strong className="text-white">Command Depot:</strong> {BASE_GARAGE.address}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. High-Visibility Emergency Priority Cards */}
      <section className="py-12 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2.5 text-orange-400">
                <Clock className="w-5 h-5 shrink-0" />
                <span className="font-black text-sm uppercase">11-Min Avg. Arrival</span>
              </div>
              <p className="text-xs text-slate-400">
                Standby flatbeds stationed at Gachibowli, ORR exit tolls, and Financial District corridor.
              </p>
            </div>

            <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2.5 text-amber-400">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span className="font-black text-sm uppercase">Accident &amp; Total Loss</span>
              </div>
              <p className="text-xs text-slate-400">
                Heavy winches, snatch blocks, and wheel dollies extract severe collision vehicles safely.
              </p>
            </div>

            <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2.5 text-yellow-400">
                <Zap className="w-5 h-5 shrink-0" />
                <span className="font-black text-sm uppercase">24/7 Jump Start</span>
              </div>
              <p className="text-xs text-slate-400">
                High-amperage spike-protected boosters awaken locked 12V computers and electronic parking brakes.
              </p>
            </div>

            <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <Truck className="w-5 h-5 shrink-0" />
                <span className="font-black text-sm uppercase">Zero Drive Drag</span>
              </div>
              <p className="text-xs text-slate-400">
                Hydraulic ground-level tilt beds ensure 100% zero wheel contact with asphalt during transit.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Emergency Incident Intake (Booking Form) */}
      <section className="py-16 bg-slate-900 border-b border-slate-800" id="booking-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-orange-400">
              Immediate Intake
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Submit Incident &amp; Vehicle Details
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Drop your exact pin or enter your landmark. Dispatcher calls in 2 minutes.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-2xl">
            <BookingForm onBookingSuccess={onBookingSuccess} />
          </div>

        </div>
      </section>

      {/* 5. Emergency Incident Safety Protocols */}
      <section className="py-14 bg-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-slate-900 border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <LifeBuoy className="w-6 h-6 text-orange-400 shrink-0" />
              <div>
                <h3 className="font-black text-base text-white uppercase">While Waiting for Your Flatbed</h3>
                <p className="text-xs text-slate-400">Critical highway safety steps for driver and passenger protection.</p>
              </div>
            </div>

            <div className="space-y-4">
              {emergencyProtocols.map((proto, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{proto.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{proto.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6. Live Request Tracker */}
      <div className="py-10 bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <TrackingTicketLookup onTrackSearch={onTrackSearch} />
        </div>
      </div>

      {/* 7. Fleet Gallery */}
      <div className="py-12 bg-slate-950 border-b border-slate-800">
        <FleetGallery />
      </div>

      {/* 8. Customer Reviews */}
      <div className="py-12 bg-slate-900">
        <ReviewsSection isOwnerMode={false} />
      </div>

    </div>
  );
};
