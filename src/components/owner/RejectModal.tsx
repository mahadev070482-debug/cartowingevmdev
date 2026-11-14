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

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    store.rejectRequest(request.id, {
      reason: selectedReason,
      notes: notes.trim() || undefined
    });

    setIsSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400">
            <XCircle className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">
              Reject / Cancel Tow Request
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Rejecting will mark request <strong className="text-white font-mono">{request.id}</strong> as <strong className="text-rose-400">Declined</strong>. The customer's tracking screen will reflect this status and no tow truck will be dispatched.
        </p>

        <form onSubmit={handleReject} className="space-y-4">
          
          {/* Reason Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Rejection Reason <span className="text-rose-400">*</span>
            </label>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs transition ${
                    selectedReason === reason
                      ? 'bg-rose-500/10 border-rose-500 text-white font-medium'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="text-rose-500 focus:ring-rose-400 bg-slate-900 border-slate-700"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Optional Explanation for Customer / Records
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Phone rang unanswered 3 times, or customer arranged private jumpstart."
              className="w-full bg-slate-950 border border-slate-700 focus:border-rose-400 rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm Rejection</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
