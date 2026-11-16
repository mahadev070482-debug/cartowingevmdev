import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { CompanyStats } from '../../types';
import { 
  Truck, 
  Disc, 
  BatteryCharging, 
  Zap, 
  ShieldAlert, 
  Gauge, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { BASE_GARAGE } from '../../data/seedData';

interface ServicesSectionProps {
  onScrollToBooking: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onScrollToBooking }) => {
  const [stats, setStats] = useState<CompanyStats>(store.getStats());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setStats(store.getStats());
    });
    return () => unsubscribe();
  }, []);

  const services = [
    {
      id: "srv-1",
      title: "Flat Bed 0 Degree Towing & 24/7 Car Towing",
      subtitle: "Zero-Drag Hydraulic Slide Bed Near Me",
      icon: Truck,
      badge: "Flat Bed 0 Degree",
      description: "Our certified flatbed tilts to true zero degrees at ground level. Eliminates drive wheel friction, preserves warranty, and prevents inverter or motor generator burnout across all car brands.",
      highlights: ["No wheel contact with asphalt", "100% zero-drag hydraulic ramp", "Full chassis nylon security webbing"]
    },
    {
      id: "srv-2",
      title: "Luxury Car Towing (Zero-Scrape)",
      subtitle: "Ultra-Low Ground Clearance & Premium Protection",
      icon: Gauge,
      badge: "Luxury Car Towing",
      description: "Specialized ultra-low ground clearance recovery for premium sedans and performance sports cars. Soft synthetic wheel basket straps ensure your alloy rims and low front splitters remain flawless.",
      highlights: ["Ultra-low angle ground transition", "Alloy rim safe tire-only webbing", "Zero bumper or underbody scrape"]
    },
    {
      id: "srv-3",
      title: "Accident Car Towing & Total Damage Recovery",
      subtitle: "Severe Collision, Structural Impact & Total Loss",
      icon: ShieldAlert,
      badge: "Accident & Total Damage",
      description: "Fast recovery for accident-impacted, immobilized, or total damage vehicles. Equipped with heavy-duty hydraulic winches, synthetic snatch blocks, and 4-point dollies to extract total loss vehicles safely without chassis twisting.",
      highlights: ["Expressway & highway collision retrieval", "Safe recovery of total loss & wheel-locked vehicles", "Direct transport to insurance yards & body shops"]
    },
    {
      id: "srv-4",
      title: "Emergency Car Breakdown Service",
      subtitle: "Dead Battery, Mechanical & Motor Lock",
      icon: BatteryCharging,
      badge: "Emergency Breakdown",
      description: "Instant response for dead battery (0% SOC), 12V system failures, and sudden mechanical breakdown. Mobile recharge boost and hydraulic skates deployed on-site within 15–20 minutes.",
      highlights: ["15-minute average response time", "Mobile emergency battery boost", "Go-Jack skates for locked parking brakes"]
    },
    {
      id: "srv-5",
      title: "SUV Towing & AWD Zero-Drag Transport",
      subtitle: "Nexon, Creta, XUV700, Fortuner, Ioniq 5, ZS EV",
      icon: Disc,
      badge: "SUV & AWD Towing",
      description: "Heavy SUVs and All-Wheel Drive (AWD) vehicles require full deck isolation. We lift both front and rear axles onto our reinforced platform to prevent differential and gearbox overheating.",
      highlights: ["Dual-motor AWD safe transport", "Reinforced high-payload deck", "Basement & parking garage extraction"]
    },
    {
      id: "srv-6",
      title: "24/7 Emergency Jump Start Service",
      subtitle: "Dead 12V Battery, Luxury Cars & EV Boost",
      icon: Zap,
      badge: "Jump Start Service",
      description: "Car battery dead at home, office basement, or highway? Our rapid recovery units carry high-amperage, voltage-protected commercial booster packs to safely jump start your car without blowing sensitive computer ECUs or hybrid modules.",
      highlights: ["Safe for luxury cars & delicate computer electronics", "High-amperage commercial jump pack", "On-site arrival within 15–20 minutes"]
    }
  ];

  return (
    <section id="services-section" className="py-16 sm:py-20 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 Flatbed Towing Service Near Me • Hyderabad</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Engineering-Grade EV Recovery Services
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Standard towing causes catastrophic motor generator burnout on electric cars. We operate dedicated hydraulic tilt flatbeds, wheel skates, and mobile EV boost systems engineered specifically for electric drivetrains.
          </p>
        </div>

        {/* 🌟 LARGE RECOGNIZABLE STATS BANNER: 25+ YEARS & 100+ RESCUES (LARGE & STOCK FORMAT) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-16 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            
            {/* Stat 1: 25+ YEARS SERVICE EXPERIENCE IN LARGE RECOGNISABLE FORMAT */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left pt-6 md:pt-0 md:px-4 first:pt-0 first:px-0">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">Heritage & Trust</span>
              <div className="text-7xl sm:text-8xl lg:text-9xl font-black text-sky-500 tracking-tighter leading-none select-none">
                {stats.yearsExperience}<span className="text-sky-300">+</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight mt-3">
                Years Experience
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Trusted vehicle recovery across Hyderabad and Telangana since 2001.
              </p>
            </div>

            {/* Stat 2: 100+ RESCUES (TEXT ONLY, EDITABLE FROM OWNER SIDE) */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left pt-6 md:pt-0 md:px-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Verified Track Record</span>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-emerald-400 tracking-tight leading-none">
                {stats.rescuesCountText}
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight mt-3">
                EV Rescues Completed
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                100% zero-damage recoveries across Hitec City, Gachibowli, ORR & Madhapur.
              </p>
            </div>

            {/* Stat 3: 15 MIN AVERAGE DISPATCH */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left pt-6 md:pt-0 md:px-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Emergency Speed</span>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-amber-400 tracking-tight leading-none flex items-baseline gap-1">
                <span>{stats.responseMinutes}</span>
                <span className="text-2xl sm:text-3xl font-bold text-amber-200">MIN</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight mt-3">
                Average Arrival
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Standby flatbeds positioned at Cyber Towers, Wipro Circle & ORR exits.
              </p>
            </div>

            {/* Stat 4: 100% ZERO-DRAG FLATBED GUARANTEE */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left pt-6 md:pt-0 md:px-6">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">Safety Standard</span>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
                100<span className="text-sky-400">%</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight mt-3">
                Zero-Drag Guarantee
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Hydraulic deck full tilt • Wheels never touch road • Inverter protected.
              </p>
            </div>

          </div>
        </div>

        {/* 6 Core Services Cards (Large & Stock Format) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14">
          {services.map((srv) => {
            const IconComp = srv.icon;
            return (
              <div
                key={srv.id}
                className="bg-slate-950/70 border border-slate-800 hover:border-sky-500/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors duration-300">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-sky-300 px-2.5 py-1 rounded-md border border-slate-700">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs font-medium text-sky-400/90 mb-3">
                    {srv.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {srv.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Bar under Services */}
        <div className="bg-gradient-to-r from-sky-900/60 via-slate-900 to-slate-950 border border-sky-800/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-white">Need an EV Flatbed Tow Truck Right Now?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant 2-minute verification call • Zero-drag flatbed dispatch across Hyderabad.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onScrollToBooking}
              className="flex-1 sm:flex-none bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Book Flatbed Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
              className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 border border-slate-700"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Call Dispatch</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
