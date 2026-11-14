import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Review } from '../../types';
import { Star, Trash2, ShieldAlert } from 'lucide-react';

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
      store.deleteReview(reviewId, true);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-slate-900 text-base">Customer Reviews Moderation</h3>
        </div>
        <span className="text-xs text-slate-500">{reviews.length} Total Reviews</span>
      </div>

      <p className="text-xs text-slate-500">
        As the service owner, you have full administrative rights to prune inappropriate reviews or feedback.
      </p>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{rev.customerName}</span>
                <span className="text-slate-600 font-medium">({rev.evModel})</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-slate-700 italic">&ldquo;{rev.comment}&rdquo;</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Ref: {rev.id}</span>
                <span>•</span>
                <span>{rev.date}</span>
                <span>•</span>
                <span>{rev.serviceType}</span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(rev.id)}
              className="bg-white hover:bg-red-50 text-red-700 border border-slate-200 hover:border-red-300 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition self-start sm:self-center shadow-sm"
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
