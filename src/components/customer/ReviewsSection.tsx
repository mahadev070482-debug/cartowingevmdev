import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Review } from '../../types';
import { Star, Trash2, CheckCircle2, MessageSquarePlus, ShieldCheck } from 'lucide-react';

interface ReviewsSectionProps {
  isOwnerMode?: boolean;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ isOwnerMode = false }) => {
  const [reviews, setReviews] = useState<Review[]>(store.getReviews());
  const [showAddModal, setShowAddModal] = useState(false);

  // New review form fields
  const [customerName, setCustomerName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
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
      evModel: vehicleModel.trim() || 'Customer Vehicle',
      rating,
      comment: comment.trim(),
    });

    setCustomerName('');
    setVehicleModel('');
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
    <section id="reviews-section" className="py-12 lg:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 px-3 py-0.5 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Customer Reviews & Experiences
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Real reviews from electric vehicle drivers assisted by our flatbed recovery team.
            </p>
          </div>

          {/* Rating Summary + Write Review CTA */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              <div className="text-2xl font-bold text-slate-900 font-mono">{averageRating}</div>
              <div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-500">{totalReviews} verified tows</span>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((rev) => {
            const isMine = store.isReviewAuthor(rev.id);
            const canDelete = isOwnerMode || isMine;

            return (
              <div
                key={rev.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  {/* Top: Stars & Delete Button */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                          title={isOwnerMode ? "Delete as Owner/Admin" : "Delete your review"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-slate-900 text-xs">{rev.customerName}</h4>
                      {isMine && (
                        <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded border border-sky-200">
                          You
                        </span>
                      )}
                    </div>
                    {rev.evModel && (
                      <p className="text-[11px] text-slate-500">{rev.evModel}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-emerald-700 text-[11px]">
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
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Write a Customer Review</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Driver XXXXXX"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Vehicle Model
                    </label>
                    <span className="text-[11px] text-slate-400 font-normal">Optional</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Tata Nexon EV, Creta, BMW, Fortuner, Swift..."
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Optionally describe the car or vehicle that was towed.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-1.5">
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
                          className={`w-5 h-5 ${
                            (hoverRating || rating) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-500 ml-2">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe how quickly the truck arrived and how your EV was handled..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-sm transition"
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
