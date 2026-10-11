import React, { useState } from 'react';
import { MenuItem, CartItem } from '../../types/cafe';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  cartItems: CartItem[];
  onSelectReviewItem: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateCartQuantity: (itemId: string, delta: number) => void;
  onOpenCart: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  cartItems,
  onSelectReviewItem,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Items', icon: 'grid_view' },
    { id: 'coffee', label: 'Espresso & Drip', icon: 'local_cafe' },
    { id: 'matcha', label: 'Matcha & Tea', icon: 'spa' },
    { id: 'cold-brew', label: 'Cold Brews & Tonics', icon: 'ac_unit' },
    { id: 'pastry', label: 'Bakery & Pastry', icon: 'bakery_dining' },
    { id: 'food', label: 'Food Items', icon: 'restaurant' },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.priceNumber * item.quantity,
    0
  );

  const getItemQuantity = (itemId: string) => {
    const found = cartItems.find((i) => i.menuItemId === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#1d1b1a] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#211f1e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#75daa8]/15 flex items-center justify-center text-[#75daa8]">
              <span className="material-symbols-outlined text-xl">restaurant_menu</span>
            </div>
            <div>
              <h2 className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
                Craft & Bloom Artisan Menu
              </h2>
              <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                82 Mercer St • Extracted & Prepared to Order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#bdcac0] hover:text-[#e6e1df] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Search Bar & Category Navigation */}
        <div className="p-3 bg-[#1d1b1a] border-b border-white/5 space-y-2.5">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-base text-[#88948b]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matcha, espresso, brioche, cold brew..."
              className="w-full pl-9 pr-8 py-2 rounded-full bg-[#0f0e0d] border border-white/10 text-xs text-[#e6e1df] placeholder:text-[#88948b] focus:outline-none focus:border-[#75daa8]/60 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-[#bdcac0] hover:text-[#e6e1df]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills with icons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full font-['Space_Grotesk',sans-serif] text-xs transition-all flex items-center gap-1.5 active:scale-95 ${
                    active
                      ? 'bg-[#75daa8] text-[#003823] font-bold shadow-sm'
                      : 'bg-[#2b2a28] text-[#bdcac0] hover:text-[#e6e1df] border border-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Catalog */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1 pb-24">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-[#bdcac0] space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#88948b]">search_off</span>
              <p className="text-xs">No items found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const qtyInCart = getItemQuantity(item.id);
              const photoReviewsCount = item.reviews.filter((r) => r.userImage).length;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#211f1e] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-2.5 shadow-sm"
                >
                  {/* Top: Image + Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#0f0e0d] shrink-0 border border-white/10 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-['Syne',sans-serif] text-sm font-bold text-[#e6e1df] leading-snug">
                          {item.name}
                        </h4>
                        <span className="font-['Space_Grotesk',sans-serif] text-sm font-bold text-[#75daa8] shrink-0">
                          {item.price}
                        </span>
                      </div>

                      <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] mt-0.5 truncate">
                        {item.origin || item.prepTime}
                      </p>

                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0] line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Flavor Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-[#141312] text-[#bdcac0] font-['Space_Grotesk',sans-serif] text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Action Bar: See Reviews + Multi-Item Add/Stepper */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    {/* "SEE REVIEWS" BUTTON */}
                    <button
                      onClick={() => onSelectReviewItem(item)}
                      className="px-3 py-1.5 rounded-full bg-[#2b2a28] hover:bg-[#363433] text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-xs transition-all flex items-center gap-1.5 border border-white/10 active:scale-95 group"
                      title="View user reviews and customer photos"
                    >
                      <span
                        className="material-symbols-outlined text-sm text-[#ffb780]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-bold text-[#ffb780]">{item.rating}</span>
                      <span className="text-[#bdcac0]">({item.reviews.length})</span>
                      {photoReviewsCount > 0 && (
                        <span className="flex items-center gap-0.5 text-[#75daa8] pl-1 font-semibold border-l border-white/10">
                          <span className="material-symbols-outlined text-xs">photo_camera</span>
                          <span>{photoReviewsCount}</span>
                        </span>
                      )}
                      <span className="material-symbols-outlined text-xs text-[#bdcac0] group-hover:translate-x-0.5 transition-transform">
                        arrow_forward
                      </span>
                    </button>

                    {/* MULTI-ITEM ADD / STEPPER CONTROLS */}
                    {qtyInCart > 0 ? (
                      <div className="flex items-center bg-[#0f0e0d] rounded-full border border-[#75daa8]/40 p-0.5 shadow-sm">
                        <button
                          onClick={() => onUpdateCartQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-full bg-[#211f1e] hover:bg-white/10 flex items-center justify-center text-[#bdcac0] text-sm active:scale-90 font-bold"
                          title="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold px-2.5 text-[#75daa8]">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => onUpdateCartQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] flex items-center justify-center text-sm active:scale-90 font-bold shadow-sm"
                          title="Add one more"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-3.5 py-1.5 rounded-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm shadow-[#75daa8]/15"
                      >
                        <span className="material-symbols-outlined text-xs font-bold">add</span>
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Floating Cart Checkout Bar at Bottom of Menu */}
        {cartTotalItems > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-[#211f1e]/95 backdrop-blur-2xl border-t border-[#75daa8]/30 shadow-2xl flex items-center justify-between gap-3 animate-fadeIn z-20">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#75daa8] text-[#003823] flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                {cartTotalItems}
              </div>
              <div className="min-w-0">
                <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold text-[#e6e1df] block truncate">
                  {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'} selected
                </span>
                <span className="font-['Syne',sans-serif] text-sm font-extrabold text-[#75daa8]">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenCart}
              className="px-4 py-2.5 rounded-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Syne',sans-serif] text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#75daa8]/25 active:scale-95 transition-all"
            >
              <span>View Cart & Order</span>
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
