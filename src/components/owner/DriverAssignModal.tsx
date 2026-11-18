import React, { useState } from 'react';
import { TowRequest } from '../../types';
import { store } from '../../services/store';
import { User, Phone, X, Check, Trash2 } from 'lucide-react';

interface DriverAssignModalProps {
  request: TowRequest;
  onClose: () => void;
  onSuccess: () => void;
}

export const DriverAssignModal: React.FC<DriverAssignModalProps> = ({
  request,
  onClose,
  onSuccess,
}) => {
  const [driverName, setDriverName] = useState(request.assignedDriverName || '');
  const [driverPhone, setDriverPhone] = useState(request.assignedDriverPhone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    store.updateDriverInfo(request.id, {
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
    });
    setIsSubmitting(false);
    onSuccess();
    onClose();
  };

  const handleClearDriver = () => {
    setIsSubmitting(true);
    store.updateDriverInfo(request.id, {
      driverName: '',
      driverPhone: '',
    });
    setIsSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-md w-full shadow-xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <User className="w-5 h-5 text-sky-600" />
            <h3>{request.assignedDriverName ? 'Update Driver Details' : 'Assign Driver'}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Request Summary */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1 text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Ticket ID:</span>
            <span className="text-sky-800 font-mono font-bold">{request.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Customer:</span>
            <span className="text-slate-900 font-semibold">{request.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Vehicle:</span>
            <span className="text-slate-800">{request.vehicle.makeModel}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Driver Name
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Ramesh"
                className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg pl-8 pr-2.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Driver Mobile Phone
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="e.g. 9912124247"
                className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg pl-8 pr-2.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {request.assignedDriverName || request.assignedDriverPhone ? (
              <button
                type="button"
                onClick={handleClearDriver}
                disabled={isSubmitting}
                className="text-red-600 hover:text-red-700 text-xs flex items-center gap-1 font-medium transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Driver</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
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
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Driver</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
