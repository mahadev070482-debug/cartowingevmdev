import React from 'react';
import { TowTruck } from '../../types';
import { Truck, Activity, Phone } from 'lucide-react';

interface FleetMonitorProps {
  trucks: TowTruck[];
}

export const FleetMonitor: React.FC<FleetMonitorProps> = ({ trucks }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-600" />
          <h3 className="font-bold text-slate-900 text-base">Fleet Live Status</h3>
        </div>
        <span className="text-xs text-slate-500">2 Trucks in Active Fleet</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trucks.map((truck) => {
          const isIdle = truck.status === 'idle';

          return (
            <div
              key={truck.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{truck.callSign}: {truck.name}</h4>
                    <span className="text-xs font-mono text-slate-600">{truck.plateNumber}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isIdle
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {isIdle ? 'Ready / Idle' : `Active (${truck.activeJobId || 'Job'})`}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-700 py-2 border-y border-slate-200/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver:</span>
                  <span className="font-semibold text-slate-900">{truck.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <a href={`tel:${truck.driverPhone}`} className="text-sky-700 font-mono hover:underline">
                    {truck.driverPhone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Live GPS:</span>
                  <span className="text-slate-600 font-mono text-[11px]">
                    {truck.currentLocation.lat.toFixed(4)}°N, {truck.currentLocation.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>

              {/* Specs & Quick Action */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-1 flex-wrap">
                  {truck.features.slice(0, 2).map((feat, i) => (
                    <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                      {feat}
                    </span>
                  ))}
                </div>

                <a
                  href={`tel:${truck.driverPhone}`}
                  className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-800 font-medium px-2.5 py-1 rounded transition border border-sky-200 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Driver</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
