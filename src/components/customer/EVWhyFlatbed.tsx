import React from 'react';
import { AlertTriangle, ShieldCheck, Zap, XCircle, CheckCircle2, Cpu } from 'lucide-react';

export const EVWhyFlatbed: React.FC = () => {
  return (
    <section id="why-flatbed" className="py-16 lg:py-24 bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>EV Engineering & Battery Protection</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Why Standard Tow Trucks Will Void Your EV Warranty
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Electric vehicles have permanent-magnet electric motors permanently geared to the drive wheels without a true mechanical neutral clutch.
          </p>
        </div>

        {/* Comparison: Standard Tow vs VoltRescue Zero-Drag Flatbed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Wrong Way: Standard Wheel-Lift / Dragging */}
          <div className="bg-rose-950/20 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-rose-900/40">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>Ordinary Tow Truck (DANGEROUS)</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full">
                DO NOT USE
              </span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-black mt-0.5">✕</span>
                <span>
                  <strong className="text-white block font-semibold">Inverter & Motor Burnout:</strong>
                  Spinning the wheels forces the permanent magnet rotor to act as a 400V–800V generator. Without active battery cooling, the inverter semiconductor switches overheat and melt.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-black mt-0.5">✕</span>
                <span>
                  <strong className="text-white block font-semibold">Tire Scraping & Differential Destruction:</strong>
                  On AWD or dual-motor EVs (e.g. Ioniq 5 AWD, BYD Seal), lifting two wheels still leaves the other axle dragging on the asphalt.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-black mt-0.5">✕</span>
                <span>
                  <strong className="text-white block font-semibold">Underbody Battery Puncture:</strong>
                  Ordinary hook chains and winch cables can catch the exposed underside lithium battery casing, causing thermal runaway hazards.
                </span>
              </li>
            </ul>
          </div>

          {/* Right Way: VOLTRESCUE Certified Flatbed */}
          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border-2 border-cyan-400/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-glow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-900/40">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-cyan-400" />
                <span>VOLTRESCUE 100% Flatbed (APPROVED)</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
                OEM CERTIFIED
              </span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-black mt-0.5">✓</span>
                <span>
                  <strong className="text-white block font-semibold">100% Zero-Drag Flatbed:</strong>
                  The entire vehicle rests securely on the hydraulic deck with zero ground contact. All 4 wheels remain stationary throughout transport.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-black mt-0.5">✓</span>
                <span>
                  <strong className="text-white block font-semibold">Go-Jack Wheel Skates for Locked Wheels:</strong>
                  If your EV is at 0% battery or stuck in &apos;Park&apos;, our hydraulic dollies lift all 4 tires off the ground so the car rolls smoothly onto the bed without transmission resistance.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-black mt-0.5">✓</span>
                <span>
                  <strong className="text-white block font-semibold">Synthetic Rim-Only Straps:</strong>
                  We never hook suspension arms or battery trays. Specially engineered wheel basket netting locks directly around the tire rubber.
                </span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
