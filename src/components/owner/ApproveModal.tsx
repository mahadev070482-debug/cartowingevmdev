import React, { useState } from 'react';
import { TowRequest, TowTruck } from '../../types';
import { store } from '../../services/store';
import { CheckCircle2, X } from 'lucide-react';

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
    `Spoke with customer on call. Safe location. Flatbed dispatch requested.`
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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3>Approve Request & Dispatch Truck</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Quick Summary */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1 text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Customer:</span>
            <span className="text-slate-900 font-semibold">{request.customerName} ({request.customerPhone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">EV Model:</span>
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
          
          {/* Agreed Price Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Agreed Quote (₹ INR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-slate-500 font-bold">₹</span>
              <input
                type="number"
                required
                min={500}
                max={50000}
                step={100}
                value={agreedPrice}
                onChange={(e) => setAgreedPrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg pl-8 pr-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Confirmed verbally with the driver on call.
            </p>
          </div>

          {/* Select Tow Truck */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Tow Truck <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {trucks.map((truck) => (
                <label
                  key={truck.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    selectedTruckId === truck.id
                      ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="truckAssignment"
                      value={truck.id}
                      checked={selectedTruckId === truck.id}
                      onChange={() => setSelectedTruckId(truck.id)}
                      className="text-sky-600 focus:ring-sky-500 border-slate-300"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">{truck.callSign}: {truck.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">
                          {truck.plateNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Driver: {truck.driverName} ({truck.driverPhone})</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      truck.status === 'idle'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {truck.status === 'idle' ? 'Ready' : 'On Job'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Dispatcher Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Driver Instructions / Call Notes
            </label>
            <textarea
              rows={2}
              value={dispatchNotes}
              onChange={(e) => setDispatchNotes(e.target.value)}
              placeholder="e.g. Bring Go-Jack wheel skates. Customer's battery is at 0% and gear is locked."
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
              <span>Confirm & Push to Driver Screen</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
