import React from 'react';
import { ASSETS } from '../data/mockData';
import { StoreLocation } from '../types/cafe';

interface HeaderProps {
  currentStore: StoreLocation;
  cartCount: number;
  incomingRequestsCount?: number;
  onOpenStorePicker: () => void;
  onOpenProfile: () => void;
  onOpenTracker: () => void;
  onOpenMenu: () => void;
  onOpenCart: () => void;
  onOpenSeatReservation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStore,
  cartCount,
  incomingRequestsCount = 0,
  onOpenStorePicker,
  onOpenProfile,
  onOpenTracker,
  onOpenMenu,
  onOpenCart,
  onOpenSeatReservation,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#0f0e0d]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-white/5">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-md mx-auto">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <img
            alt="The Café Companion Logo"
            className="h-8 w-auto object-contain shrink-0 cursor-pointer"
            src={ASSETS.logo}
            onClick={onOpenStorePicker}
          />
          <button
            onClick={onOpenStorePicker}
            className="flex flex-col min-w-0 text-left group transition-opacity"
            aria-label="Select Store Location"
          >
            <div className="flex items-center gap-1 text-[#e6e1df] font-['Syne',sans-serif] text-[18px] leading-tight font-semibold truncate group-hover:text-[#75daa8] transition-colors">
              <span className="truncate">Craft & Bloom</span>
              <span className="material-symbols-outlined text-base text-[#75daa8] shrink-0">
                expand_more
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#bdcac0] font-['Space_Grotesk',sans-serif] text-[10px] font-semibold truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#75daa8] animate-pulse shrink-0"></span>
              <span className="truncate">
                {currentStore.distance} away • {currentStore.status}
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenSeatReservation && (
            <button
              onClick={onOpenSeatReservation}
              aria-label="Reserve Seat"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-[#75daa8]/15 text-[#e6e1df] hover:text-[#75daa8] font-['Space_Grotesk',sans-serif] text-xs font-semibold border border-white/10 hover:border-[#75daa8]/40 transition-all active:scale-95"
              title="Reserve Table or Seat"
            >
              <span className="material-symbols-outlined text-base text-[#75daa8]">chair</span>
              <span className="hidden sm:inline">Seats</span>
            </button>
          )}

          <button
            onClick={onOpenMenu}
            aria-label="View Menu"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-[#75daa8]/15 text-[#e6e1df] hover:text-[#75daa8] font-['Space_Grotesk',sans-serif] text-xs font-semibold border border-white/10 hover:border-[#75daa8]/40 transition-all active:scale-95"
            title="Browse Menu & Reviews"
          >
            <span className="material-symbols-outlined text-base text-[#75daa8]">restaurant_menu</span>
            <span>Menu</span>
          </button>

          {cartCount > 0 && (
            <button
              onClick={onOpenCart}
              aria-label="View Cart"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#75daa8] text-[#003823] font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all active:scale-95 shadow-md shadow-[#75daa8]/20 animate-fadeIn"
              title="View Cart & Checkout"
            >
              <span className="material-symbols-outlined text-base font-bold">shopping_bag</span>
              <span>{cartCount}</span>
            </button>
          )}

          <button
            onClick={onOpenTracker}
            aria-label="Active Orders"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#bdcac0] hover:text-[#75daa8] hover:bg-white/5 transition-colors relative"
            title="Active Order Tracker"
          >
            <span className="material-symbols-outlined text-xl">local_cafe</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#75daa8] animate-ping" />
          </button>

          <button
            onClick={onOpenProfile}
            className="w-11 h-11 p-0.5 rounded-full flex items-center justify-center bg-[#2b2a28]/60 backdrop-blur-md ring-1 ring-white/10 hover:ring-[#75daa8]/50 transition-all active:scale-95"
            aria-label="User Profile"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              src={ASSETS.profile}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
