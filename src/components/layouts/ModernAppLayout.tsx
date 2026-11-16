import React, { useState } from 'react';
import { TowRequest } from '../../types';
import { BASE_GARAGE } from '../../data/seedData';
import { store } from '../../services/store';
import { LeafletMap } from '../common/LeafletMap';
import { BookingForm } from '../customer/BookingForm';
import { TrackingTicketLookup } from '../customer/TrackingTicketLookup';
import { FleetGallery } from '../customer/FleetGallery';
import { ReviewsSection } from '../customer/ReviewsSection';
import { 
  PhoneCall, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  Gauge, 
  ShieldAlert, 
  BatteryCharging,
  Radio,
  Sparkles
} from 'lucide-react';

interface ModernAppLayoutProps {
  onBookingSuccess: (newRequest: TowRequest) => void;
  onTrackSearch: (query: string) => void;
  onScrollToBooking: () => void;
}

export const ModernAppLayout: React.FC<ModernAppLayoutProps> = ({
  onBookingSuccess,
  onTrackSearch,
  onScrollToBooking
}) => {
  const stats = store.getStats();
  const [activeTab, setActiveTab] = useState<'request' | 'track' | 'services'>('request');

  const cleanPhone = BASE_GARAGE.phone.replace(/[^0-9]/g, '');

  const quickServices = [
    {
      title: "0° Ground-Level Flatbed",
      badge: "Zero-Degree Tilt",
      desc: "Hydraulic slide bed tilts flat to the asphalt. Safe for all EVs, automatic transmissions & inverters.",
      icon: Truck,
      color: "border-sky-500 bg-sky-50 text-sky-950"
    },
    {
      title: "Luxury & Low Clearance",
      badge: "Zero Scrape",
      desc: "Specialized tire-basket harness for sports cars and luxury sedans. Alloy rims and splitters protected.",
      icon: Gauge,
      color: "border-purple-500 bg-purple-50 text-purple-950"
    },
    {
      title: "Accident & Total Loss Extraction",
      badge: "Heavy Winch & Dollies",
      desc: "Rapid extraction for collision impacts, seized steering, or locked wheels. Safe highway retrieval.",
      icon: ShieldAlert,
      color: "border-red-500 bg-red-50 text-red-950"
    },
    {
      title: "24/7 Rapid Jump Start",
      badge: "12V & Booster Pack",
      desc: "Commercial high-amperage jumper pack restores dead computers and 12V auxiliary systems on the spot.",
      icon: BatteryCharging,
      color: "border-emerald-500 bg-emerald-50 text-emerald-950"
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* 1. App-Style Live Status Strip */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">Live Dispatch Radar:</span>
            <span className="text-slate-300">8 Flatbed Trucks Active in Gachibowli, ORR &amp; Financial District</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Avg. Arrival: <strong className="text-white">{stats.responseMinutes} Mins</strong></span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>HQ: Gachibowli, Hyd</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section: App-Style Instant Emergency Bar */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">
        
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Instant Dispatch Headline & 1-Tap Emergency CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>Modern Rapid Dispatch • 25+ Years Experience</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Tap Once. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">
                  Flatbed Dispatched.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Stranded on Outer Ring Road, Gachibowli, or Hitec City? Get hydraulic zero-degree flatbed assistance in 15 minutes. No motor friction, no inverter burnout.
              </p>

              {/* Big 1-Tap Emergency Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-sky-500/25 transition transform active:scale-95"
                >
                  <PhoneCall className="w-5 h-5 animate-bounce" />
                  <div className="text-left">
                    <span className="block text-xs uppercase tracking-wider text-sky-100 font-semibold">Direct Dispatch Call</span>
                    <span className="text-sm font-black">{BASE_GARAGE.phone}</span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${BASE_GARAGE.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20need%20emergency%20flatbed%20towing%20assistance%20in%20Hyderabad`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/25 transition transform active:scale-95"
                >
                  <MessageSquare className="w-5 h-5" />
                  <div className="text-left">
                    <span className="block text-xs uppercase tracking-wider text-emerald-100 font-semibold">WhatsApp Beacon</span>
                    <span className="text-sm font-black">Share Location</span>
                  </div>
                </a>
              </div>

              {/* Verified Office Address Chip */}
              <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">
                  <strong className="text-slate-200">Central Base:</strong> {BASE_GARAGE.address}
                </span>
              </div>

            </div>

            {/* Right Column: Live App Status Card & Quick Stats */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Rapid Tow Ticket</h3>
                      <p className="text-[11px] text-slate-400">Zero-Degree Guaranteed</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    Instant Call
                  </span>
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2.5 py-5 border-b border-slate-800 text-center">
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    <div className="text-2xl font-black text-sky-400">25+</div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">Years Exp</div>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    <div className="text-2xl font-black text-emerald-400">100+</div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">EV Rescues</div>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    <div className="text-2xl font-black text-amber-400">{stats.responseMinutes}m</div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">Avg Arrival</div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={onScrollToBooking}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl text-sm transition shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Proceed to GPS Pickup Pin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-slate-400 text-center">
                    Dispatcher verifies your vehicle make &amp; breakdown type immediately.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Live Active Radar Map Showcase */}
      <section className="py-12 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Radio className="w-4 h-4 animate-spin" />
                Live Standby Units Across Hyderabad
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Real-Time Fleet Radar
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Standby flatbed trucks stationed at Gachibowli HQ, ORR Expressway Tolls, and Hitec City junctions.
            </p>
          </div>

          <div className="h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <LeafletMap
              markers={[
                {
                  lat: 17.4334,
                  lng: 78.3475,
                  title: 'VoltRescue HQ (Gachibowli)',
                  subtitle: 'Ground floor, Sevanti Nivas, TNGOs colony phase 2',
                  type: 'base'
                },
                {
                  lat: 17.4483,
                  lng: 78.3915,
                  title: 'Standby Truck #01 (Tilt Bed)',
                  subtitle: 'Madhapur / Mindspace Hub',
                  type: 'truck'
                },
                {
                  lat: 17.4239,
                  lng: 78.3370,
                  title: 'Standby Truck #02 (Rapid Flatbed)',
                  subtitle: 'Financial District & ORR Exit 19',
                  type: 'truck'
                }
              ]}
              center={[17.4334, 78.3475]}
              zoom={13}
              className="h-full w-full"
            />
          </div>

        </div>
      </section>

      {/* 4. Quick Services Visual Grid */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Zero-Degree Engineering
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Select Your Towing Service
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every recovery is handled by trained specialists with 25+ years experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-sky-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-2xl bg-slate-800 text-sky-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                        {srv.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-white mb-2">{srv.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{srv.desc}</p>
                  </div>

                  <button
                    onClick={onScrollToBooking}
                    className="mt-5 w-full py-2 bg-slate-800 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <span>Request This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Embedded Customer Booking Form */}
      <section className="py-16 bg-slate-900 border-b border-slate-800" id="booking-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Immediate Assistance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Confirm Pickup Pin &amp; Vehicle
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your ticket is generated instantly and prioritized for dispatch.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-2xl">
            <BookingForm onBookingSuccess={onBookingSuccess} />
          </div>
        </div>
      </section>

      {/* 6. Live Ticket Lookup */}
      <div className="bg-slate-950 py-10 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <TrackingTicketLookup onTrackSearch={onTrackSearch} />
        </div>
      </div>

      {/* 7. Fleet Gallery */}
      <div className="bg-slate-900 py-12 border-b border-slate-800">
        <FleetGallery />
      </div>

      {/* 8. Customer Reviews */}
      <div className="bg-slate-950 py-12">
        <ReviewsSection isOwnerMode={false} />
      </div>

    </div>
  );
};
