import React, { useState, useEffect } from 'react';
import { TowRequest, TowTruck } from '../../types';
import { store } from '../../services/store';
import { ActiveJobCard } from './ActiveJobCard';
import { 
  Truck, 
  CheckCircle2, 
  Radio, 
  ShieldCheck, 
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

  const myAssignedRequests = requests.filter(
    (r) => r.assignedTruckId === currentTruck.id && r.status !== 'declined'
  );

  const activeJob = myAssignedRequests.find(
    (r) => ['verified_approved', 'driver_accepted', 'en_route', 'arrived_pickup', 'in_transit'].includes(r.status)
  );

  const completedJobs = myAssignedRequests.filter((r) => r.status === 'completed');

  return (
    <div className="py-6 sm:py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
      
      {/* Top Driver Console Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">{currentTruck.callSign}: {currentTruck.driverName}</h1>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {currentTruck.plateNumber} • {currentTruck.name}
              </p>
            </div>
          </div>

          {/* Truck Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-center">
            <span className="text-[11px] text-slate-500 px-1.5 font-medium">Cabin:</span>
            {trucks.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTruckId(t.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  selectedTruckId === t.id
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.callSign}
              </button>
            ))}
          </div>

        </div>

        {/* Safety & Equipment Checklist */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Spam Filter: Receives only Owner-Approved Jobs</span>
          </div>

          <div className="flex gap-1.5">
            {currentTruck.features.slice(0, 2).map((feat, i) => (
              <span key={i} className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-600">
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
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <Radio className="w-8 h-8 animate-pulse text-emerald-600" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="text-lg font-bold text-slate-900">
              Ready for Next Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              No active job currently assigned to <strong className="text-slate-800">{currentTruck.callSign}</strong>. When dispatch approves a request, it will appear here instantly.
            </p>
          </div>

          <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              GPS Standby
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <Award className="w-3.5 h-3.5 text-sky-600" />
              1000V Certified
            </span>
          </div>

          {/* Completed Jobs Today */}
          {completedJobs.length > 0 && (
            <div className="pt-6 border-t border-slate-100 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Completed Rescues by {currentTruck.callSign} ({completedJobs.length})
              </h3>
              <div className="space-y-2">
                {completedJobs.map((cj) => (
                  <div
                    key={cj.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{cj.customerName}</span>
                      <span className="text-slate-500 ml-2">({cj.vehicle.makeModel})</span>
                      <p className="text-[11px] text-slate-400">{cj.pickupLocation.address} → {cj.dropoffLocation.name}</p>
                    </div>
                    {cj.agreedPrice && (
                      <span className="text-emerald-700 font-bold font-mono">
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
