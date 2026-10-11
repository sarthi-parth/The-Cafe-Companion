import React, { useState } from 'react';
import { MenuItem, MenuItemReview } from '../../types/cafe';
import { ASSETS } from '../../data/mockData';

interface ItemReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onAddReview: (itemId: string, newReview: MenuItemReview) => void;
}

export const ItemReviewsModal: React.FC<ItemReviewsModalProps> = ({
  isOpen,
  onClose,
  item,
  onAddReview,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);

  // New review form states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState('Sarthi P.');

  if (!isOpen || !item) return null;

  const samplePhotoOptions = [
    { label: 'Matcha Foam', url: ASSETS.ceremonialMatchaCup },
    { label: 'Iced Glass', url: ASSETS.matchaGlass },
    { label: 'Tulip Latte Art', url: ASSETS.flatWhiteCup },
    { label: 'Golden Pastry', url: ASSETS.pistachioCroissant },
    { label: 'Cold Brew Layer', url: ASSETS.honeyLavenderColdBrew },
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const review: MenuItemReview = {
      id: `rev-${Date.now()}`,
      userName: authorName.trim() || 'Guest Patron',
      userAvatar: ASSETS.profile,
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      userImage: newPhotoUrl || undefined,
      verifiedPurchase: true,
      tag: 'Verified Patron',
      likes: 1,
    };

    onAddReview(item.id, review);
    setNewComment('');
    setNewPhotoUrl(null);
    setShowAddReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#1d1b1a] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#211f1e]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#0f0e0d] border border-white/10">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df] truncate">
                {item.name}
              </h3>
              <div className="flex items-center gap-2 font-['Space_Grotesk',sans-serif] text-xs">
                <span className="text-[#75daa8] font-bold">{item.price}</span>
                <span>•</span>
                <div className="flex items-center gap-1 text-[#ffb780]">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold">{item.rating}</span>
                  <span className="text-[#bdcac0]">({item.reviews.length} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#bdcac0] hover:text-[#e6e1df] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Rating Summary Card */}
          <div className="p-4 rounded-2xl bg-[#211f1e] border border-white/5 flex items-center justify-between gap-4">
            <div className="text-center shrink-0">
              <span className="font-['Syne',sans-serif] text-3xl font-extrabold text-[#e6e1df] block">
                {item.rating}
              </span>
              <div className="flex items-center justify-center gap-0.5 text-[#ffb780] my-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                {item.reviews.length} verified ratings
              </span>
            </div>

            <div className="flex-1 space-y-1 text-[11px] font-['Space_Grotesk',sans-serif] text-[#bdcac0]">
              <div className="flex items-center gap-2">
                <span>5★</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#363433] overflow-hidden">
                  <div className="h-full bg-[#75daa8] rounded-full" style={{ width: '88%' }} />
                </div>
                <span className="w-6 text-right">88%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>4★</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#363433] overflow-hidden">
                  <div className="h-full bg-[#75daa8]/70 rounded-full" style={{ width: '12%' }} />
                </div>
                <span className="w-6 text-right">12%</span>
              </div>
              <div className="flex items-center gap-2 text-[#88948b]">
                <span>3★</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#363433]" />
                <span className="w-6 text-right">0%</span>
              </div>
            </div>
          </div>

          {/* Action Bar: Write Review Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold text-[#e6e1df]">
                Patron Reviews & Photos
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#75daa8]/15 text-[#75daa8] font-['Space_Grotesk',sans-serif] text-[10px] font-bold">
                {item.reviews.filter((r) => r.userImage).length} with photos
              </span>
            </div>

            <button
              onClick={() => setShowAddReviewForm(!showAddReviewForm)}
              className="px-3 py-1.5 rounded-full bg-[#2b2a28] hover:bg-[#363433] text-[#75daa8] font-['Space_Grotesk',sans-serif] text-xs font-semibold flex items-center gap-1 transition-all border border-[#75daa8]/30 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">
                {showAddReviewForm ? 'close' : 'rate_review'}
              </span>
              <span>{showAddReviewForm ? 'Cancel' : 'Write Review'}</span>
            </button>
          </div>

          {/* Write Review Form Drawer */}
          {showAddReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="p-4 rounded-2xl bg-[#211f1e] border border-[#75daa8]/40 space-y-3 animate-fadeIn"
            >
              <div className="flex items-center justify-between">
                <span className="font-['Syne',sans-serif] text-xs font-bold text-[#e6e1df]">
                  Share Your Tasting Experience
                </span>
                {/* Star rating selector */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`text-lg transition-transform active:scale-125 ${
                        star <= newRating ? 'text-[#ffb780]' : 'text-[#363433]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your Name (e.g. Sarthi P.)"
                  className="w-full px-3 py-2 rounded-xl bg-[#0f0e0d] border border-white/10 text-xs text-[#e6e1df] placeholder:text-[#88948b] focus:outline-none focus:border-[#75daa8]"
                />
              </div>

              <div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="How was the flavor balance, texture, microfoam, or pairing?"
                  rows={2}
                  className="w-full p-3 rounded-xl bg-[#0f0e0d] border border-white/10 text-xs text-[#e6e1df] placeholder:text-[#88948b] focus:outline-none focus:border-[#75daa8]"
                />
              </div>

              {/* Attach a Photo Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-[#75daa8]">add_a_photo</span>
                    <span>Attach Photo to Review (Optional)</span>
                  </span>
                  {newPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setNewPhotoUrl(null)}
                      className="text-[#ffb4ab] hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {samplePhotoOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewPhotoUrl(opt.url)}
                      className={`shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 relative transition-all ${
                        newPhotoUrl === opt.url
                          ? 'border-[#75daa8] scale-105 ring-2 ring-[#75daa8]/40'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
                      {newPhotoUrl === opt.url && (
                        <div className="absolute inset-0 bg-[#75daa8]/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-[#003823] font-bold">
                            check
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#75daa8] text-[#003823] font-['Syne',sans-serif] text-xs font-bold hover:bg-[#92f7c3] active:scale-95 transition-all shadow-md shadow-[#75daa8]/20"
              >
                Post Review with Photo
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            {item.reviews.map((rev) => (
              <article
                key={rev.id}
                className="p-4 rounded-2xl bg-[#211f1e] border border-white/5 space-y-2.5 transition-colors hover:border-white/10"
              >
                {/* Reviewer Header: Who gave the review */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold text-[#e6e1df]">
                          {rev.userName}
                        </span>
                        {rev.verifiedPurchase && (
                          <span
                            className="material-symbols-outlined text-xs text-[#75daa8]"
                            title="Verified Order"
                          >
                            verified
                          </span>
                        )}
                      </div>
                      <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-[#ffb780]">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <span
                        key={idx}
                        className="material-symbols-outlined text-xs"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#e6e1df] leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* REVIEW IMAGE: Visible if user provided an image! */}
                {rev.userImage && (
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center gap-1 text-[10px] font-['Space_Grotesk',sans-serif] text-[#75daa8]">
                      <span className="material-symbols-outlined text-xs">photo_camera</span>
                      <span>Photo by {rev.userName}</span>
                    </div>
                    <div
                      onClick={() => setSelectedPhoto(rev.userImage || null)}
                      className="relative rounded-xl overflow-hidden h-40 w-full bg-[#0f0e0d] cursor-pointer group border border-white/10 hover:border-[#75daa8]/40 transition-all shadow-md"
                    >
                      <img
                        src={rev.userImage}
                        alt={`Review photo by ${rev.userName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                        <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-white flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">fullscreen</span>
                          Tap to expand photo
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Tag & Helpful Badge */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5 font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                  {rev.tag ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#2b2a28] text-[#ede0d4]">
                      {rev.tag}
                    </span>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-1 text-[#88948b]">
                    <span className="material-symbols-outlined text-xs text-[#75daa8]">thumb_up</span>
                    <span>{rev.likes || 1} found helpful</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Full Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <img
            src={selectedPhoto}
            alt="Customer review photo preview"
            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
          />
          <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] mt-3">
            Customer photo for {item.name}
          </p>
        </div>
      )}
    </div>
  );
};
