import React, { useState } from 'react';
import { TowRequest } from '../../types';
import { store } from '../../services/store';
import { XCircle, X } from 'lucide-react';

interface RejectModalProps {
  request: TowRequest;
  onClose: () => void;
  onSuccess: () => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  request,
  onClose,
  onSuccess,
}) => {
  const reasons: TowRequest['rejectionReason'][] = [
    'Fake / Unreachable Number',
    'Out of Service Area',
    'Customer Cancelled on Call',
    'Duplicate Request',
    'Other'
  ];

  const [selectedReason, setSelectedReason] = useState<TowRequest['rejectionReason']>('Customer Cancelled on Call');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await store.rejectRequest(request.id, {
        reason: selectedReason,
        notes: notes.trim() || undefined
      });
    } finally {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3>Decline / Cancel Tow Request</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Declining request <strong className="text-slate-900 font-mono">{request.id}</strong> will update the customer's tracking screen to <strong className="text-red-700">Declined</strong>.
        </p>

        <form onSubmit={handleReject} className="space-y-4">
          
          {/* Reason Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Reason <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer text-xs transition ${
                    selectedReason === reason
                      ? 'bg-red-50 border-red-300 text-red-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Note / Customer Explanation
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Number unreachable or customer managed to drive to charger."
              className="w-full bg-white border border-slate-300 focus:border-red-500 rounded-lg p-2 text-xs text-slate-900 focus:outline-none resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm Decline</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
