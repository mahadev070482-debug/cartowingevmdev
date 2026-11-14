import React, { useState, useEffect } from 'react';
import { TowRequest, TowTruck } from '../../types';
import { store } from '../../services/store';
import { ActiveJobCard } from './ActiveJobCard';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Radio, 
  Phone, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

interface DriverPortalProps {
  selectedTruckId: string;
  onSelectTruckId: (truckId: string) => void;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({
  selectedTruckId,
  onSelectTruckId,
}) => {
  const [trucks, setTrucks] = useState<TowTruck[]>(store.getTrucks());
  const [requests, setRequests] = useState<TowRequest[]>(store.getRequests());

  const handleRefresh = () => {
    setTrucks([...store.getTrucks()]);
    setRequests([...store.getRequests()]);
  };

  useEffect(() => {
    const update = () => {
      setTrucks([...store.getTrucks()]);
      setRequests([...store.getRequests()]);
    };
    const unsubscribe = store.subscribe(update);
    return () => unsubscribe();
  }, []);

  const currentTruck = trucks.find((t) => t.id === selectedTruckId) || trucks[0];

  // Feed: ONLY owner-approved and assigned jobs to this truck
  // Drivers NEVER see unverified requests!
  const myAssignedRequests = requests.filter(
    (r) => r.assignedTruckId === currentTruck.id && r.status !== 'declined'
  );

  const activeJob = myAssignedRequests.find(
    (r) => ['verified_approved', 'driver_accepted', 'en_route', 'arrived_pickup', 'in_transit'].includes(r.status)
  );

  const completedJobs = myAssignedRequests.filter((r) => r.status === 'completed');

  return (
    <div className="py-6 sm:py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Driver Console Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white">{currentTruck.callSign}: {currentTruck.driverName}</h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {currentTruck.plateNumber} • {currentTruck.name}
              </p>
            </div>
          </div>

          {/* Truck Switcher Dropdown / Buttons */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-center">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Switch Cabin:</span>
            {trucks.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTruckId(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedTruckId === t.id
                    ? 'bg-cyan-500 text-slate-950 shadow-glow-sm'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {t.callSign} ({t.driverName.split(' ')[0]})
              </button>
            ))}
          </div>

        </div>

        {/* Safety & Equipment Checklist */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Spam Protection Active: Feed receives ONLY Owner Call-Verified Jobs</span>
          </div>

          <div className="flex gap-2">
            {currentTruck.features.slice(0, 2).map((feat, i) => (
              <span key={i} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                ✓ {feat}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      {activeJob ? (
        <ActiveJobCard
          request={activeJob}
          truck={currentTruck}
          onRefresh={handleRefresh}
        />
      ) : (
        /* Standby / Idle State */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
            <Radio className="w-10 h-10 animate-pulse text-emerald-400" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="text-xl font-black text-white">
              Ready for Next Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              No active job currently assigned to <strong className="text-cyan-300">{currentTruck.callSign}</strong>. As soon as the owner verifies a customer by phone and clicks &ldquo;Approve & Assign&rdquo;, it will pop up right here with audio and navigation coordinates.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              GPS Telemetry Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              1000V Safety Rating
            </span>
          </div>

          {/* Completed Jobs Today */}
          {completedJobs.length > 0 && (
            <div className="pt-8 border-t border-slate-800/80 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Completed Rescues by {currentTruck.callSign} ({completedJobs.length})
              </h3>
              <div className="space-y-2">
                {completedJobs.map((cj) => (
                  <div
                    key={cj.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{cj.customerName}</span>
                      <span className="text-slate-400 ml-2">({cj.vehicle.makeModel})</span>
                      <p className="text-[11px] text-slate-500">{cj.pickupLocation.address} → {cj.dropoffLocation.name}</p>
                    </div>
                    {cj.agreedPrice && (
                      <span className="text-emerald-400 font-bold font-mono">
                        ₹ {cj.agreedPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
