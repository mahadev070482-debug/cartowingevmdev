import React, { useState } from 'react';
import { TowRequest, TowTruck } from '../../types';
import { store } from '../../services/store';
import { CheckCircle2, Truck, DollarSign, FileText, X, AlertCircle } from 'lucide-react';

interface ApproveModalProps {
  request: TowRequest;
  trucks: TowTruck[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({
  request,
  trucks,
  onClose,
  onSuccess,
}) => {
  const [agreedPrice, setAgreedPrice] = useState<number>(2500);
  const [selectedTruckId, setSelectedTruckId] = useState<string>(trucks[0]?.id || 'TRUCK-01');
  const [dispatchNotes, setDispatchNotes] = useState<string>(
    `Spoke with ${request.customerName}. Vehicle is safely parked. Requires flatbed with soft rim straps.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    store.approveAndAssign(request.id, {
      agreedPrice,
      truckId: selectedTruckId,
      notes: dispatchNotes
    });

    setIsSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">
              Approve Request & Dispatch Truck
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Quick Summary */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Customer:</span>
            <span className="text-white font-bold">{request.customerName} ({request.customerPhone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">EV Model:</span>
            <span className="text-cyan-400 font-semibold">{request.vehicle.makeModel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Issue:</span>
            <span className="text-amber-400 font-semibold">{request.issueType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Pickup:</span>
            <span className="text-slate-300 truncate max-w-[240px]">{request.pickupLocation.address}</span>
          </div>
        </div>

        <form onSubmit={handleApprove} className="space-y-4">
          
          {/* Agreed Price Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Agreed Verbal Quote (₹ INR) <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-sm text-slate-400 font-bold">₹</span>
              <input
                type="number"
                required
                min={500}
                max={50000}
                step={100}
                value={agreedPrice}
                onChange={(e) => setAgreedPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono font-bold text-emerald-300 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Confirmed with customer on call. Shows directly on customer tracking & driver console.
            </p>
          </div>

          {/* Select Tow Truck */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Assign Tow Truck & Driver <span className="text-emerald-400">*</span>
            </label>
            <div className="space-y-2">
              {trucks.map((truck) => (
                <label
                  key={truck.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    selectedTruckId === truck.id
                      ? 'bg-emerald-500/10 border-emerald-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="truckAssignment"
                      value={truck.id}
                      checked={selectedTruckId === truck.id}
                      onChange={() => setSelectedTruckId(truck.id)}
                      className="text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{truck.callSign}: {truck.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 rounded text-cyan-300">
                          {truck.plateNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Driver: {truck.driverName} ({truck.driverPhone})</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      truck.status === 'idle'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {truck.status === 'idle' ? 'Available' : 'Active on Job'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Dispatcher Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Call Notes / Driver Instructions
            </label>
            <textarea
              rows={2}
              value={dispatchNotes}
              onChange={(e) => setDispatchNotes(e.target.value)}
              placeholder="e.g. Bring Go-Jack wheel skates. Customer's battery is at 0% and gear is locked."
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Push to Driver Screen</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
