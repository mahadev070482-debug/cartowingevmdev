import React from 'react';
import { AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export const EVWhyFlatbed: React.FC = () => {
  return (
    <section id="why-flatbed" className="py-12 lg:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>EV Engineering & Safety</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Why EVs Require 100% Flatbed Towing
          </h2>
          <p className="text-sm text-slate-600">
            Electric cars use permanent-magnet synchronous motors without a physical mechanical clutch. Rotating the wheels during a tow causes serious electrical hazards.
          </p>
        </div>

        {/* Comparison: Standard Tow vs VoltRescue Zero-Drag Flatbed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* Wrong Way: Standard Wheel-Lift / Dragging */}
          <div className="bg-red-50/60 border border-red-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-200/80">
              <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                <XCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>Ordinary Wheel-Lift / Dolly Tow (Risk)</span>
              </div>
              <span className="text-[10px] font-semibold bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full border border-red-200">
                Not Recommended
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-red-600 font-bold mt-0.5">✕</span>
                <span>
                  <strong className="text-slate-900 block font-semibold">Inverter & Motor Burnout:</strong>
                  Spinning the wheels forces the motor to act as an unregulated high-voltage generator. Without active cooling, this can destroy delicate power electronics.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-600 font-bold mt-0.5">✕</span>
                <span>
                  <strong className="text-slate-900 block font-semibold">Differential & Gear Damage:</strong>
                  On all-wheel drive or dual-motor EVs, lifting one axle still causes the other drive unit to spin and overheat.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-600 font-bold mt-0.5">✕</span>
                <span>
                  <strong className="text-slate-900 block font-semibold">Battery Tray Puncture Hazards:</strong>
                  Standard tow hooks can snag the low-hanging lithium-ion battery enclosure on road undulations.
                </span>
              </li>
            </ul>
          </div>

          {/* Right Way: VOLTRESCUE Certified Flatbed */}
          <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-sky-200/80">
              <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-600" />
                <span>VoltRescue Dedicated Flatbed (OEM Safe)</span>
              </div>
              <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200">
                Recommended by EV Makers
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-sky-600 font-bold mt-0.5">✓</span>
                <span>
                  <strong className="text-slate-900 block font-semibold">Zero Ground Friction:</strong>
                  Your car rests completely stationary on the truck deck. Wheels never rotate during transit, preserving manufacturer warranties.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-600 font-bold mt-0.5">✓</span>
                <span>
                  <strong className="text-slate-900 block font-semibold">Wheel Skates for Frozen Brakes:</strong>
                  If the battery is at 0% or the electronic parking brake is locked, our hydraulic dollies roll the vehicle safely onto the bed.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-600 font-bold mt-0.5">✓</span>
                <span>
                  <strong className="text-slate-900 block font-semibold">Tire-Only Soft Straps:</strong>
                  We use soft wheel nets that touch only tire rubber — never touching suspension components or the high-voltage pack.
                </span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
