import React from 'react';
import { TowTruck } from '../../types';
import { Truck, CheckCircle2, Navigation, Phone, ShieldCheck, Activity } from 'lucide-react';

interface FleetMonitorProps {
  trucks: TowTruck[];
  onOpenDriverPortal?: (truckId: string) => void;
}

export const FleetMonitor: React.FC<FleetMonitorProps> = ({ trucks, onOpenDriverPortal }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-base">EV Flatbed Fleet Telemetry</h3>
        </div>
        <span className="text-xs text-slate-400">2 Trucks in Fleet (Active GPS)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trucks.map((truck) => {
          const isIdle = truck.status === 'idle';

          return (
            <div
              key={truck.id}
              className={`p-4 rounded-2xl border transition-all ${
                isIdle
                  ? 'bg-slate-950/60 border-slate-800'
                  : 'bg-gradient-to-br from-cyan-950/30 via-slate-950 to-slate-900 border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{truck.callSign}: {truck.name}</h4>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">{truck.plateNumber}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isIdle
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30 animate-pulse'
                  }`}
                >
                  {isIdle ? 'IDLE / READY' : `ON JOB (${truck.activeJobId || 'Active'})`}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 py-2 border-y border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Driver:</span>
                  <span className="font-bold text-white">{truck.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver Phone:</span>
                  <a href={`tel:${truck.driverPhone}`} className="text-cyan-400 font-mono hover:underline">
                    {truck.driverPhone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Live GPS Coordinates:</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {truck.currentLocation.lat.toFixed(4)}°N, {truck.currentLocation.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>

              {/* Specs & Driver Console shortcut */}
              <div className="pt-3 flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {truck.features.slice(0, 2).map((feat, i) => (
                    <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {feat}
                    </span>
                  ))}
                </div>

                {onOpenDriverPortal && (
                  <button
                    onClick={() => onOpenDriverPortal(truck.id)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold px-2.5 py-1 rounded-lg transition"
                  >
                    Open Console
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
