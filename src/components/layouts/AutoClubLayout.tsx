import React, { useState } from 'react';
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
  Crown, 
  Award, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  Gauge, 
  ShieldAlert, 
  Zap,
  Sparkles,
  ChevronRight,
  Star
} from 'lucide-react';

interface AutoClubLayoutProps {
  onBookingSuccess: (newRequest: TowRequest) => void;
  onTrackSearch: (query: string) => void;
  onScrollToBooking: () => void;
}

export const AutoClubLayout: React.FC<AutoClubLayoutProps> = ({
  onBookingSuccess,
  onTrackSearch,
  onScrollToBooking
}) => {
  const stats = store.getStats();
  const cleanPhone = BASE_GARAGE.phone.replace(/[^0-9]/g, '');

  const [selectedServiceTab, setSelectedServiceTab] = useState<number>(0);

  const clubServices = [
    {
      title: "0° Hydraulic Flatbed Transport",
      tagline: "True Ground-Level Slide Bed for Zero-Degree Loading",
      desc: "Engineered specifically for electric and automatic transmission vehicles. The flatbed tilts to true zero degrees, completely eliminating friction against the asphalt, preventing inverter burnout and safeguarding your manufacturer warranty.",
      points: [
        "100% zero wheel contact with pavement during haul",
        "Hydraulic ground-level slide bed for safe loading",
        "Multi-point soft synthetic chassis tie-down webbing"
      ],
      icon: Truck
    },
    {
      title: "Luxury & Exotic Vehicle Zero-Scrape Protocol",
      tagline: "Dedicated Recovery for High-End Sedans & Performance Sports Cars",
      desc: "Custom low-angle approach ramps ensure zero front bumper, carbon fiber splitter, or underbody battery enclosure scraping. Soft synthetic wheel basket nets secure exclusively via tire tread, leaving alloy rims 100% untouched.",
      points: [
        "Ultra-low approach angle for slammed or lowered suspensions",
        "Rim-safe tire-only basket harnesses",
        "Zero underbody or bumper contact guaranteed"
      ],
      icon: Gauge
    },
    {
      title: "Accident & Total Loss Extraction",
      tagline: "Heavy-Duty Recovery for Structural Damage & Locked Wheels",
      desc: "Equipped with heavy hydraulic winches, 4-point low-clearance dollies, and synthetic snatch blocks to safely extract collision-impacted or total damage vehicles from expressways and highway medians without chassis twisting.",
      points: [
        "Rapid highway & expressway retrieval across ORR and Hyderabad",
        "Dollies and wheel skates roll immobilized vehicles effortlessly",
        "Direct insured transport to service facilities and authorized body shops"
      ],
      icon: ShieldAlert
    },
    {
      title: "24/7 Rapid Jump Start Service",
      tagline: "Instant Commercial Booster for Dead 12V Auxiliary Systems",
      desc: "When the 12V auxiliary battery dies and vehicle electronics, power steering, and park brake lock up, our jump start units arrive with commercial booster power to boot up the system safely without voltage spikes.",
      points: [
        "High-amperage spike-protected commercial booster packs",
        "Restores power to shift locked transmissions and release park brakes",
        "Available around the clock across all Hyderabad corridors"
      ],
      icon: Zap
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      
      {/* 1. Heritage Top Seal Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-amber-500/30 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-full bg-amber-500/20 text-amber-400">
              <Crown className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold tracking-wide text-amber-300 uppercase text-[11px]">
              Premier Automobile Club • 25+ Years of Heritage
            </span>
            <span className="hidden md:inline text-slate-400">• Certified Zero-Degree Recovery Charter</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-xs">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Gachibowli HQ, Hyderabad</span>
            </div>
            <a
              href={`tel:${cleanPhone}`}
              className="text-amber-400 hover:text-amber-300 font-bold underline decoration-amber-400/50"
            >
              VIP Desk: {BASE_GARAGE.phone}
            </a>
          </div>

        </div>
      </div>

      {/* 2. Executive Hero Banner */}
      <section className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white py-14 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        
        {/* Subtle royal pattern backdrop */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Quarter-Century of Excellence (1999 – 2026)</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Hyderabad&apos;s Most Trusted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
                  Luxury &amp; Flatbed Recovery Service
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Operating with certified hydraulic zero-degree flatbeds and precision wheel skates. Headquartered at <strong className="text-white">Ground Floor, Sevanti Nivas, TNGOs Colony Phase 2, Gachibowli</strong>, we provide zero-scrape transport for luxury vehicles and rapid expressway recovery.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onScrollToBooking}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>Book Certified Flatbed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${cleanPhone}`}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Call: {BASE_GARAGE.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${BASE_GARAGE.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20need%20executive%20flatbed%20towing%20assistance%20in%20Hyderabad`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-center max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-amber-400">25+</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Years Service</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">100+</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Rescues Done</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-sky-400">100%</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Zero-Degree Bed</div>
                </div>
              </div>

            </div>

            {/* Right Card: Executive Charter & Location Spotlight (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md">
                
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Certified Damage-Free Charter</h3>
                    <p className="text-xs text-amber-300">AAA &amp; Automobile Club Grade Safety</p>
                  </div>
                </div>

                <ul className="space-y-3 py-5 border-b border-slate-800 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>100% Zero-Degree Flatbeds:</strong> Drive wheels never roll on the highway asphalt, protecting electric drive units and automatic transmissions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Alloy Rim Protection:</strong> Non-abrasive synthetic tire harness secures tires only, never touching custom alloy wheels.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>2-Minute Verification Call:</strong> Senior dispatcher calls immediately upon ticket submission.</span>
                  </li>
                </ul>

                {/* Address Box */}
                <div className="pt-4 flex items-start gap-3 text-xs text-slate-400">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200 block">Registered Headquarters:</span>
                    <span>{BASE_GARAGE.address}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Tabbed Executive Services Explorer */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Executive Recovery Portfolio
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Automobile Club Certified Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Select a specialized recovery division to view engineering specifications.
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {clubServices.map((srv, idx) => {
              const Icon = srv.icon;
              const isSelected = selectedServiceTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedServiceTab(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    isSelected
                      ? 'bg-blue-950 text-amber-300 shadow-md ring-2 ring-amber-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{srv.title.split(' ')[0]} {srv.title.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-950 text-amber-400 shrink-0">
                {React.createElement(clubServices[selectedServiceTab].icon, { className: "w-7 h-7" })}
              </div>
              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                  {clubServices[selectedServiceTab].tagline}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {clubServices[selectedServiceTab].title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {clubServices[selectedServiceTab].desc}
                </p>

                <div className="space-y-2 pt-2">
                  {clubServices[selectedServiceTab].points.map((pt, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={onScrollToBooking}
                    className="bg-blue-950 hover:bg-slate-900 text-amber-300 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow"
                  >
                    <span>Request This Towing Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Booking Section */}
      <section className="py-16 bg-slate-100 border-b border-slate-200" id="booking-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Immediate Dispatch
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Executive Tow Request Form
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Select your vehicle category and drop your pickup GPS pin.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
            <BookingForm onBookingSuccess={onBookingSuccess} />
          </div>
        </div>
      </section>

      {/* 5. Tracking Ticket Lookup */}
      <div className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <TrackingTicketLookup onTrackSearch={onTrackSearch} />
        </div>
      </div>

      {/* 6. Fleet Gallery */}
      <div className="py-12 bg-slate-50 border-b border-slate-200">
        <FleetGallery />
      </div>

      {/* 7. Reviews Section */}
      <div className="py-12 bg-white">
        <ReviewsSection isOwnerMode={false} />
      </div>

    </div>
  );
};
