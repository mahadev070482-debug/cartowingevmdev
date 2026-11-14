import React, { useState } from 'react';
import { TowRequest, TowTruck } from '../../types';
import { store, calculateDistanceKm } from '../../services/store';
import { BASE_GARAGE } from '../../data/seedData';
import { ApproveModal } from './ApproveModal';
import { RejectModal } from './RejectModal';
import { 
  PhoneCall, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Car, 
  AlertTriangle, 
  Navigation,
  PhoneForwarded,
  ShieldAlert
} from 'lucide-react';

interface PendingCallQueueProps {
  requests: TowRequest[];
  trucks: TowTruck[];
  onRefresh: () => void;
}

export const PendingCallQueue: React.FC<PendingCallQueueProps> = ({
  requests,
  trucks,
  onRefresh,
}) => {
  const pendingRequests = requests.filter((r) => r.status === 'pending_verification');

  const [activeApproveReq, setActiveApproveReq] = useState<TowRequest | null>(null);
  const [activeRejectReq, setActiveRejectReq] = useState<TowRequest | null>(null);

  const handleToggleCallMade = (reqId: string) => {
    store.toggleCallMade(reqId);
    onRefresh();
  };

  if (pendingRequests.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-white font-bold text-base">All Incoming Requests Verified</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          There are currently no new unverified tow requests in the phone verification queue. Any newly submitted booking will appear here instantly with sound/badge.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <h3 className="font-bold text-white text-base">
            Pending Call Verification Queue ({pendingRequests.length})
          </h3>
        </div>
        <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full font-semibold">
          ⚡ Call within 2 minutes of submission
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingRequests.map((req) => {
          const distFromBase = calculateDistanceKm(
            BASE_GARAGE.lat,
            BASE_GARAGE.lng,
            req.pickupLocation.lat,
            req.pickupLocation.lng
          );

          return (
            <div
              key={req.id}
              className={`bg-slate-900 border-2 rounded-3xl p-5 sm:p-6 transition-all duration-200 shadow-xl ${
                req.callMade
                  ? 'border-cyan-500/40 bg-slate-900/95'
                  : 'border-amber-500/50 bg-slate-900 shadow-amber-500/5'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                
                {/* Customer Identity */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-slate-950 text-base shadow-md shrink-0">
                    <PhoneForwarded className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-black text-white">{req.customerName}</h4>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                        {req.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {req.urgency}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Submitted: {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-semibold">{distFromBase} km from Base Garage</span>
                    </div>
                  </div>
                </div>

                {/* Primary Call Controls: Click-to-Call + "Call Made" Toggle */}
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  {/* One-Tap Click-to-Call button */}
                  <a
                    href={`tel:${req.customerPhone.replace(/\s+/g, '')}`}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                    <span>Call Customer ({req.customerPhone})</span>
                  </a>

                  {/* "Call Made" Toggle Badge */}
                  <button
                    onClick={() => handleToggleCallMade(req.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
                      req.callMade
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                    title="Toggle whether you have dialed and spoken to this driver"
                  >
                    <Check className={`w-3.5 h-3.5 ${req.callMade ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{req.callMade ? 'Call Made: YES' : 'Call Made: NO'}</span>
                  </button>
                </div>

              </div>

              {/* Middle: Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs">
                {/* Vehicle Specs */}
                <div className="space-y-1">
                  <span className="text-slate-500 font-medium block">EV Vehicle:</span>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-cyan-400" />
                    <span>{req.vehicle.makeModel}</span>
                  </div>
                  {req.vehicle.regNumber && (
                    <span className="text-slate-400 font-mono block">{req.vehicle.regNumber}</span>
                  )}
                  {req.vehicle.hasWheelLock && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
                      <ShieldAlert className="w-3 h-3" />
                      Drive Wheels Locked (Needs Wheel Skates)
                    </span>
                  )}
                </div>

                {/* Issue Type */}
                <div className="space-y-1">
                  <span className="text-slate-500 font-medium block">Reported Breakdown:</span>
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{req.issueType}</span>
                  </div>
                  {req.issueDescription && (
                    <p className="text-slate-300 line-clamp-2">{req.issueDescription}</p>
                  )}
                </div>

                {/* Location Points */}
                <div className="space-y-1">
                  <span className="text-slate-500 font-medium block">Locations:</span>
                  <p className="text-slate-300 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>Pickup: {req.pickupLocation.address}</span>
                  </p>
                  <p className="text-slate-400 flex items-start gap-1">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Drop-off: {req.dropoffLocation.name}</span>
                  </p>
                </div>
              </div>

              {/* Bottom: The 2 Core Decision Buttons (Approve & Assign vs Reject) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  {req.callMade ? (
                    <span className="text-cyan-400 font-medium flex items-center gap-1">
                      ✓ Phone call recorded. Proceed to quote approval or cancellation.
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      ⚠️ Recommendation: Dial customer before approving to confirm vehicle state.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {/* Reject / Cancel Request */}
                  <button
                    onClick={() => setActiveRejectReq(req)}
                    className="flex-1 sm:flex-none bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/50 text-rose-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Reject / Cancel Request</span>
                  </button>

                  {/* Approve & Assign Truck */}
                  <button
                    onClick={() => setActiveApproveReq(req)}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Assign Truck</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modals */}
      {activeApproveReq && (
        <ApproveModal
          request={activeApproveReq}
          trucks={trucks}
          onClose={() => setActiveApproveReq(null)}
          onSuccess={onRefresh}
        />
      )}

      {activeRejectReq && (
        <RejectModal
          request={activeRejectReq}
          onClose={() => setActiveRejectReq(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};
