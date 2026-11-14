import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Review } from '../../types';
import { EV_MODELS } from '../../data/seedData';
import { Star, Trash2, CheckCircle2, MessageSquarePlus, ShieldCheck, User } from 'lucide-react';

interface ReviewsSectionProps {
  isOwnerMode?: boolean;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ isOwnerMode = false }) => {
  const [reviews, setReviews] = useState<Review[]>(store.getReviews());
  const [showAddModal, setShowAddModal] = useState(false);

  // New review form fields
  const [customerName, setCustomerName] = useState('');
  const [evModel, setEvModel] = useState(EV_MODELS[0]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const update = () => {
      setReviews([...store.getReviews()]);
    };
    const unsubscribe = store.subscribe(update);
    return () => unsubscribe();
  }, []);

  // Compute stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setSubmitting(true);
    store.addReview({
      customerName: customerName.trim(),
      evModel,
      rating,
      comment: comment.trim(),
    });

    setCustomerName('');
    setComment('');
    setRating(5);
    setSubmitting(false);
    setShowAddModal(false);
  };

  const handleDelete = (reviewId: string) => {
    const isOwner = isOwnerMode;
    const isMine = store.isReviewAuthor(reviewId);

    if (!isOwner && !isMine) {
      alert('You can only delete your own submitted reviews.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this review?')) {
      store.deleteReview(reviewId, isOwner);
    }
  };

  return (
    <section id="reviews-section" className="py-16 lg:py-24 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Real EV Driver Experiences</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Verified EV Towing Reviews
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Real testimonials from stranded electric vehicle drivers rescued across expressways, parking structures, and suburban highways.
            </p>
          </div>

          {/* Rating Summary + Write Review CTA */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-800">
              <div className="text-3xl font-black text-white font-mono">{averageRating}</div>
              <div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-400">{totalReviews} verified rescues</span>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-glow-sm transition"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => {
            const isMine = store.isReviewAuthor(rev.id);
            const canDelete = isOwnerMode || isMine;

            return (
              <div
                key={rev.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition relative group"
              >
                <div>
                  {/* Top: Stars & Delete Button */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">{rev.date}</span>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition"
                          title={isOwnerMode ? "Delete as Owner/Admin" : "Delete your review"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-white text-xs">{rev.customerName}</h4>
                      {isMine && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-400/30">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-cyan-400 font-medium">{rev.evModel}</p>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Review Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">Write a Customer Review</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Nair"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Electric Vehicle Model
                  </label>
                  <select
                    value={evModel}
                    onChange={(e) => setEvModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {EV_MODELS.map((model, idx) => (
                      <option key={idx} value={model} className="bg-slate-900 text-white">
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (hoverRating || rating) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 ml-2 font-mono">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Experience & Feedback <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how quickly the truck arrived, vehicle handling, and the driver's service..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-glow-sm transition"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
