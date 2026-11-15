import React, { useState } from 'react';
import { BASE_GARAGE } from '../../data/seedData';
import { Phone, Mail, MapPin, Zap, CheckCircle2, Send, Clock, ShieldAlert, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (callbackName && callbackPhone) {
      setSubmitted(true);
      setTimeout(() => {
        setCallbackName('');
        setCallbackPhone('');
        setSubmitted(false);
      }, 5000);
    }
  };

  const coverageAreas = [
    "Hitec City & Madhapur (Cyber Towers, Mindspace)",
    "Gachibowli & Financial District (Wipro Circle, WaveRock)",
    "Outer Ring Road (ORR) Expressways (Exit 1 to Exit 19)",
    "Kondapur, KPHB & Miyapur NH65 Corridor",
    "Shamshabad RGIA Airport & PVNR Elevated Expressway",
    "Jubilee Hills, Banjara Hills & Panjagutta",
    "Secunderabad, Begumpet & Paradise Circle",
    "Kompally, Suchitra & Medchal Highway NH44"
  ];

  return (
    <footer id="contact-section" className="bg-slate-900 border-t border-slate-800 text-slate-300 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">2-Minute Verification</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dispatcher calls right away to confirm exact location & quote.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Zero-Drag Flatbed</h4>
              <p className="text-xs text-slate-400 mt-0.5">Wheels never roll on pavement. Prevents motor & inverter burnout.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Wheel Skates & Dollies</h4>
              <p className="text-xs text-slate-400 mt-0.5">Special skates roll vehicles with frozen parking brakes or 0% SOC.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">High-Voltage Certified</h4>
              <p className="text-xs text-slate-400 mt-0.5">Trained recovery specialists equipped with 1000V rated gear.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-b border-slate-800">
          
          {/* Brand & Garage Headquarters (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Volt<span className="text-sky-400">Rescue</span>
                </span>
                <span className="block text-[11px] text-slate-400">24/7 Flatbed & Luxury Towing</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              With <strong>25+ years of vehicle recovery experience</strong> across Hyderabad, we provide engineering-grade zero-drag EV flatbed roadside assistance. Equipped with hydraulic tilt beds and wheel skates to safeguard lithium-ion battery packs and delicate drive motors.
            </p>

            <div className="space-y-2.5 pt-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block font-medium">Base Garage & Depot:</strong>
                  {BASE_GARAGE.name}, {BASE_GARAGE.address}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white font-medium">Helpline (24/7): </strong>
                  <a href={`tel:${BASE_GARAGE.phone}`} className="text-cyan-400 hover:underline">{BASE_GARAGE.phone}</a>
                  {' '}|{' '}
                  <a href="tel:0000000000" className="text-cyan-400 hover:underline">1800-000-0000</a>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong className="text-white font-medium">Support: </strong>
                  <a href={`mailto:${BASE_GARAGE.email}`} className="text-slate-300 hover:underline">{BASE_GARAGE.email}</a>
                </span>
              </div>
            </div>
          </div>

          {/* Service Coverage Areas (4 Cols) */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              24/7 Service Coverage Areas
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Average dispatch arrival within 25–35 minutes across the following key corridors:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 text-xs text-slate-300">
              {coverageAreas.map((area, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Callback Inquiry Form (3 Cols) */}
          <div className="lg:col-span-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-white font-bold text-sm mb-1">Request a Fast Callback</h3>
            <p className="text-xs text-slate-400 mb-3">
              Have non-emergency EV transport questions or need a scheduled transfer?
            </p>

            {submitted ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl text-emerald-300 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                <p className="font-bold">Callback Scheduled!</p>
                <p className="text-[11px] text-slate-300">Our dispatch team will call you within 5 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-2.5">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Driver XXXXXX"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">10-Digit Mobile (+91)</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="0000000000"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Call Me Back</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* SEO Keywords Section (From Official Dispatch Guidelines) */}
        <div className="py-8 border-b border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Popular Search Queries & Emergency Towing Services in Hyderabad (SEO)
            </h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              "Car Towing Service Hyderabad",
              "Tow Truck Near Me",
              "24/7 Towing Service",
              "24/7 Flatbed Towing Service Near Me",
              "Flat Bed 0 Degree Towing",
              "Emergency Towing Service",
              "Emergency Car Breakdown Service",
              "Car Breakdown Service",
              "Accident Car Towing",
              "Accident Car Recovery Service",
              "Total Damage Car Towing",
              "Total Damage Car Towing Service",
              "Total Loss Car Towing",
              "Luxury Car Towing",
              "SUV Towing",
              "Roadside Assistance Hyderabad"
            ].map((kw, i) => (
              <span
                key={i}
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-[11px] font-medium px-3 py-1 rounded-full border border-slate-700/80 transition"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 VoltRescue™ Hyderabad. 25+ Years Recovery Heritage. 24/7 Flatbed & Luxury Vehicle Towing.</p>
          <div className="flex items-center gap-3">
            <a href="/?view=owner" className="hover:text-slate-300 underline transition">
              Owner / Dispatcher Portal
            </a>
            <span>•</span>
            <a href="/?view=driver" className="hover:text-slate-300 underline transition">
              Driver Portal
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
