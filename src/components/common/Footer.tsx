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
    "Outer Ring Road (Silk Board to Hebbal)",
    "Whitefield & ITPL Tech Corridor",
    "Electronic City & Hosur Highway",
    "Indiranagar & MG Road Central",
    "Koramangala & HSR Layout",
    "Kempegowda Airport Expressway",
    "NICE Ring Road & Peripheral Expressway",
    "Sarjapur & Bellandur Lake Zone",
    "Yeshwanthpur & Tumkur Road"
  ];

  return (
    <footer id="contact-section" className="bg-slate-950 border-t border-slate-800 text-slate-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">2-Minute Verification</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dispatcher calls right away to confirm exact location & quote.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Zero-Drag Flatbed</h4>
              <p className="text-xs text-slate-400 mt-0.5">Wheels never roll on pavement. Prevents permanent EV motor burnout.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Wheel Skates & Dollies</h4>
              <p className="text-xs text-slate-400 mt-0.5">Special skates roll vehicles with frozen parking brakes or 0% SOC.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">High-Voltage Certified</h4>
              <p className="text-xs text-slate-400 mt-0.5">Trained recovery specialists equipped with 1000V rated gear.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 border-b border-slate-800/80">
          
          {/* Brand & Garage Headquarters (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-slate-950 fill-cyan-200" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                VOLT<span className="text-cyan-400">RESCUE</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              India&apos;s dedicated Electric Vehicle roadside assistance and specialized flatbed recovery service. 
              Engineering-grade equipment designed to safeguard low-slung lithium-ion battery packs and delicate dual-motor gearboxes.
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
                  <a href="tel:180038737283" className="text-cyan-400 hover:underline">1800-EV-RESCUE</a>
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
                    placeholder="e.g. Arun Kumar"
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
                    placeholder="9876543210"
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

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 VOLTRESCUE™ Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Zero-Drag EV Towing Specialist</span>
            <span>•</span>
            <span className="text-slate-400">Owner Helpline: +91 98765 43210</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
