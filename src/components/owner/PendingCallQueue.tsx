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
  MapPin, 
  Car, 
  AlertTriangle, 
  Navigation, 
  ShieldAlert,
  MessageCircle
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
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3 shadow-sm">
        <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-slate-900 font-bold text-base">All Incoming Requests Verified</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          There are currently no pending requests in the call verification queue. Any newly submitted booking will appear here immediately.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <h3 className="font-bold text-slate-900 text-base">
            Pending Phone Verification ({pendingRequests.length})
          </h3>
        </div>
        <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
          Call driver within 2 minutes of booking
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingRequests.map((req) => {
          const lat = req.pickupLocation?.lat ?? BASE_GARAGE.lat;
          const lng = req.pickupLocation?.lng ?? BASE_GARAGE.lng;
          const distFromBase = calculateDistanceKm(
            BASE_GARAGE.lat,
            BASE_GARAGE.lng,
            lat,
            lng
          );

          return (
            <div
              key={req.id}
              className={`bg-white border rounded-xl p-5 sm:p-6 shadow-sm transition ${
                req.callMade
                  ? 'border-sky-300 ring-1 ring-sky-200'
                  : 'border-amber-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                
                {/* Customer Identity */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900">{req.customerName}</h4>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        {req.id}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        {req.urgency}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Submitted: {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="text-slate-700 font-medium">{distFromBase} km from Base Garage</span>
                    </div>
                  </div>
                </div>

                {/* Primary Call Controls: Click-to-Call + WhatsApp + "Call Made" Toggle */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  {/* One-Tap Click-to-Call button */}
                  <a
                    href={`tel:${req.customerPhone.replace(/\s+/g, '')}`}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call ({req.customerPhone})</span>
                  </a>

                  {/* One-Tap WhatsApp */}
                  <a
                    href={`https://wa.me/91${req.customerPhone.replace(/[^0-9]/g, '').slice(-10)}?text=Hello%20${encodeURIComponent(req.customerName)},%20this%20is%20Mahadev%20Car%20Towing%20Services%20regarding%20your%20flatbed%20request%20${req.id}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                    title="Send WhatsApp message"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  {/* "Call Made" Toggle Badge */}
                  <button
                    onClick={() => handleToggleCallMade(req.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                      req.callMade
                        ? 'bg-sky-50 border-sky-300 text-sky-800'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Toggle whether you have dialed and spoken to this driver"
                  >
                    <Check className={`w-3.5 h-3.5 ${req.callMade ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{req.callMade ? 'Call Made: YES' : 'Call Made: NO'}</span>
                  </button>
                </div>

              </div>

              {/* Middle: Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs text-slate-700">
                {/* Vehicle Specs */}
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium block">EV Vehicle:</span>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-sky-600" />
                    <span>{req.vehicle?.makeModel || 'Vehicle Not Specified'}</span>
                  </div>
                  {req.vehicle?.regNumber && (
                    <span className="text-slate-500 font-mono block">{req.vehicle.regNumber}</span>
                  )}
                  {req.vehicle?.hasWheelLock && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                      <ShieldAlert className="w-3 h-3 text-amber-600" />
                      Drive Wheels Locked (Needs Wheel Skates)
                    </span>
                  )}
                </div>

                {/* Issue Type */}
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium block">Reported Breakdown:</span>
                  <div className="font-semibold text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{req.issueType || 'General Towing'}</span>
                  </div>
                  {req.issueDescription && (
                    <p className="text-slate-600 line-clamp-2">{req.issueDescription}</p>
                  )}
                </div>

                {/* Location Points */}
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium block">Locations:</span>
                  <p className="text-slate-800 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>Pickup: {req.pickupLocation?.address || 'Pickup location not specified'}</span>
                  </p>
                  <p className="text-slate-600 flex items-start gap-1">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Drop-off: {req.dropoffLocation?.name || 'Confirmed on call'}</span>
                  </p>
                </div>
              </div>

              {/* Bottom: The 2 Core Decision Buttons (Approve & Assign vs Reject) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  {req.callMade ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      ✓ Call recorded. Ready for approval &amp; truck dispatch.
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center gap-1">
                      Recommendation: Dial customer to confirm vehicle status before dispatching.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {/* Reject / Cancel Request */}
                  <button
                    onClick={() => setActiveRejectReq(req)}
                    className="flex-1 sm:flex-none bg-white hover:bg-red-50 border border-slate-300 text-slate-700 hover:text-red-700 font-medium px-3.5 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Decline / Cancel</span>
                  </button>

                  {/* Accept Request */}
                  <button
                    onClick={() => setActiveApproveReq(req)}
                    className="flex-1 sm:flex-none bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Request</span>
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
