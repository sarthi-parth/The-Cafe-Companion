import React, { useState } from 'react';
import { CartItem, StoreLocation } from '../../types/cafe';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentStore: StoreLocation;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: (items: CartItem[], notes: string) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentStore,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.priceNumber * item.quantity,
    0
  );
  const tax = subtotal * 0.08875;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onCheckout(cartItems, specialNotes);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#1d1b1a] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#211f1e]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#75daa8] text-2xl">
              shopping_bag
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
                  Your Order Selection
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#75daa8]/15 text-[#75daa8] font-['Space_Grotesk',sans-serif] text-[10px] font-bold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
                </span>
              </div>
              <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                {currentStore.name} • Pickup in {currentStore.prepTime}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#bdcac0] hover:text-[#e6e1df]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <span className="material-symbols-outlined text-5xl text-[#88948b]">
                remove_shopping_cart
              </span>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#bdcac0]">
                Your selection is currently empty
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-[#75daa8] text-[#003823] font-['Space_Grotesk',sans-serif] text-xs font-bold"
              >
                Browse Menu to Add Items
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2.5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#211f1e] border border-white/5 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0f0e0d] shrink-0 border border-white/10">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#e6e1df] truncate">
                          {item.name}
                        </h4>
                        <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#75daa8] font-bold">
                          {item.price}
                        </span>
                        {item.customization && (
                          <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] truncate">
                            {item.customization}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Remove */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-[#0f0e0d] rounded-full border border-white/10 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-[#bdcac0] text-sm active:scale-90"
                        >
                          -
                        </button>
                        <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold px-2 text-[#e6e1df]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-[#75daa8] text-sm active:scale-90"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="w-7 h-7 rounded-full hover:bg-white/5 flex items-center justify-center text-[#88948b] hover:text-[#ffb4ab]"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Notes for Barista */}
              <div className="space-y-1.5">
                <label className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#bdcac0] block">
                  Barista Crafting Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Light ice, extra hot, oat milk on side..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0f0e0d] border border-white/10 text-xs text-[#e6e1df] placeholder:text-[#88948b] focus:outline-none focus:border-[#75daa8]"
                />
              </div>

              {/* Cost Summary Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-white/5 space-y-1.5 font-['Space_Grotesk',sans-serif] text-xs">
                <div className="flex justify-between text-[#bdcac0]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#bdcac0]">
                  <span>Estimated NY Sales Tax (8.875%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#e6e1df] pt-1.5 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="text-[#75daa8] font-extrabold text-base">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-[#211f1e] border-t border-white/5 flex items-center gap-3">
            <button
              onClick={onClearCart}
              className="px-3 py-3 rounded-full hover:bg-white/5 text-[#bdcac0] font-['Space_Grotesk',sans-serif] text-xs hover:text-[#ffb4ab] transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 rounded-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Syne',sans-serif] text-sm font-bold flex items-center justify-between shadow-xl shadow-[#75daa8]/20 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>{isSubmitting ? 'Dispatching Ticket...' : 'Confirm & Place Order'}</span>
              </div>
              <span className="font-extrabold text-base">${total.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
