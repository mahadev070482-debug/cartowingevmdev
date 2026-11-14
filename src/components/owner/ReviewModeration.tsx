import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Review } from '../../types';
import { Star, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ReviewModeration: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(store.getReviews());

  useEffect(() => {
    const update = () => {
      setReviews([...store.getReviews()]);
    };
    const unsubscribe = store.subscribe(update);
    return () => unsubscribe();
  }, []);

  const handleDelete = (reviewId: string) => {
    if (window.confirm(`[ADMIN CONFIRMATION] Are you sure you want to delete review "${reviewId}"? This will remove it from the public website immediately.`)) {
      store.deleteReview(reviewId, true); // true = isAdmin
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-base">Customer Reviews Moderation (Admin)</h3>
        </div>
        <span className="text-xs text-slate-400">{reviews.length} Total Reviews</span>
      </div>

      <p className="text-xs text-slate-400">
        As the service owner, you have full administrative authority to prune inappropriate, spam, or abusive reviews. Verified customer feedback builds trust with future stranded motorists.
      </p>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{rev.customerName}</span>
                <span className="text-cyan-400 text-xs font-medium">({rev.evModel})</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 italic">&ldquo;{rev.comment}&rdquo;</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span>Ref: {rev.id}</span>
                <span>•</span>
                <span>{rev.date}</span>
                <span>•</span>
                <span>{rev.serviceType}</span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(rev.id)}
              className="bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition self-start sm:self-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete (Admin)</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
