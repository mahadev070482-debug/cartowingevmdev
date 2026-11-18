import React, { useState } from 'react';
import { TowRequest, TowTruck } from '../../types';
import { store } from '../../services/store';
import { CheckCircle2, X, User, Phone, FileText } from 'lucide-react';

interface ApproveModalProps {
  request: TowRequest;
  trucks?: TowTruck[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({
  request,
  onClose,
  onSuccess,
}) => {
  const [driverName, setDriverName] = useState<string>('');
  const [driverPhone, setDriverPhone] = useState<string>('');
  const [dispatchNotes, setDispatchNotes] = useState<string>(
    `Spoke with customer on call. Safe location. Flatbed dispatch confirmed.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    store.approveRequest(request.id, {
      driverName: driverName.trim() || undefined,
      driverPhone: driverPhone.trim() || undefined,
      notes: dispatchNotes
    });

    setIsSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3>Accept &amp; Confirm Tow Request</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Quick Summary */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1 text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Ticket ID:</span>
            <span className="text-sky-800 font-mono font-bold">{request.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Customer:</span>
            <span className="text-slate-900 font-semibold">{request.customerName} ({request.customerPhone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Vehicle Model:</span>
            <span className="text-sky-800 font-medium">{request.vehicle.makeModel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Issue:</span>
            <span className="text-amber-800 font-medium">{request.issueType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Pickup:</span>
            <span className="text-slate-800 truncate max-w-[240px]">{request.pickupLocation.address}</span>
          </div>
        </div>

        <form onSubmit={handleApprove} className="space-y-4">

          {/* Optional Driver Information */}
          <div className="bg-sky-50/60 border border-sky-200/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-sky-600" />
                <span>Driver Details</span>
              </label>
              <span className="text-[10px] text-sky-700 bg-sky-100 font-semibold px-2 py-0.5 rounded-full">
                Optional
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              You can enter driver details now, or accept first and assign a driver later from the active orders table.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Driver Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Ramesh"
                    className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Driver Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="e.g. 9912124247"
                    className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dispatcher Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Instructions / Call Notes (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={dispatchNotes}
              onChange={(e) => setDispatchNotes(e.target.value)}
              placeholder="e.g. Customer is waiting near ORR exit. Car is in neutral."
              className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg p-2 text-xs text-slate-900 focus:outline-none resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{driverName.trim() ? 'Accept & Assign Driver' : 'Accept Request'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
