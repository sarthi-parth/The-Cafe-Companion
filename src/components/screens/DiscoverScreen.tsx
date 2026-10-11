import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';
import { ActiveTicket, StoreLocation } from '../../types/cafe';

interface DiscoverScreenProps {
  currentStore: StoreLocation;
  activeTicket: ActiveTicket;
  onOpenStorePicker: () => void;
  onOpenTracker: () => void;
  onQuickOrder: (itemName: string, price: string) => void;
  onOpenMenu: () => void;
  onOpenReviewsById: (itemId: string) => void;
  onOpenSeatReservation: () => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  currentStore,
  activeTicket,
  onOpenStorePicker,
  onOpenTracker,
  onQuickOrder,
  onOpenMenu,
  onOpenReviewsById,
  onOpenSeatReservation,
}) => {
  const [showStoreTray, setShowStoreTray] = useState(false);
  const [reorderingMatcha, setReorderingMatcha] = useState(false);
  const [reorderingFlatWhite, setReorderingFlatWhite] = useState(false);

  // Mystery roulette states
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [roulettePick, setRoulettePick] = useState({
    name: 'Yuzu Cold Drip Tonic',
    vibe: 'Midday Focus • Crisp Citrus Finish',
    price: '$6.50',
  });

  const [croissantAdded, setCroissantAdded] = useState(false);
  const [coldBrewAdded, setColdBrewAdded] = useState(false);

  const handleSpinRoulette = async () => {
    if (rouletteSpinning) return;
    setRouletteSpinning(true);

    try {
      const res = await fetch('/api/gemini/roulette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setTimeout(() => {
          setRoulettePick(data);
          setRouletteSpinning(false);
        }, 500);
        return;
      }
    } catch {
      // fallback handled below
    }

    const fallbackList = [
      { name: 'Smoked Vanilla Nitro', vibe: 'Afternoon Chill • Creamy Oak Notes', price: '$6.85' },
      { name: 'Cascara Blood Orange Fizz', vibe: 'Sparkling Lift • Low Caffeine & Tangy', price: '$5.95' },
      { name: 'Cortado w/ Hazelnut Cloud', vibe: 'Quick Espresso Kick • Nutty Velvet', price: '$5.45' },
      { name: 'Cardamom Shakerato', vibe: 'Botanical Crisp • Double Shot Chilled', price: '$6.25' },
      { name: 'Yuzu Cold Drip Tonic', vibe: 'Midday Focus • Crisp Citrus Finish', price: '$6.50' },
    ];
    setTimeout(() => {
      const random = fallbackList[Math.floor(Math.random() * fallbackList.length)];
      setRoulettePick(random);
      setRouletteSpinning(false);
    }, 500);
  };

  const handleReorder = (item: 'matcha' | 'flatwhite') => {
    if (item === 'matcha') {
      setReorderingMatcha(true);
      onQuickOrder('Ceremonial Matcha', '$6.75');
      setTimeout(() => setReorderingMatcha(false), 2200);
    } else {
      setReorderingFlatWhite(true);
      onQuickOrder('Flat White', '$5.25');
      setTimeout(() => setReorderingFlatWhite(false), 2200);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 space-y-3 pb-8 max-w-md mx-auto animate-fadeIn">
      {/* 1. Smart Proximity Guardrails Banner */}
      <section
        className="w-full bg-[#2b2a28]/90 backdrop-blur-xl p-4 rounded-2xl shadow-lg flex flex-col gap-1 relative overflow-hidden border border-white/5"
        id="proximity-banner"
      >
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#75daa8]/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            <span
              className="material-symbols-outlined text-[#75daa8] text-xl shrink-0 mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              near_me
            </span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] uppercase tracking-wider font-bold">
                  Proximity Guard Active
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#75daa8] animate-pulse" />
              </div>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-[#e6e1df] font-medium leading-snug mt-0.5">
                You're at <span className="font-bold text-[#92f7c3]">{currentStore.name}</span>.
                Pickup in {currentStore.prepTime}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowStoreTray(!showStoreTray)}
            className="shrink-0 bg-[#363433] hover:bg-[#3b3937] text-[#e6e1df] px-3 py-1 rounded-full font-['Space_Grotesk',sans-serif] text-xs transition-all active:scale-95 flex items-center gap-1 shadow-sm"
          >
            <span>Switch</span>
            <span className="material-symbols-outlined text-sm text-[#bdcac0]">swap_horiz</span>
          </button>
        </div>

        {/* Quick Location Picker Tray */}
        {showStoreTray && (
          <div className="pt-2 mt-2 border-t border-white/5 flex flex-col gap-1.5 animate-fadeIn">
            <div className="text-[#bdcac0] font-['Space_Grotesk',sans-serif] text-[10px]">
              Select Nearby Counter:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  setShowStoreTray(false);
                }}
                className="bg-[#52b788] text-[#00442c] font-['Space_Grotesk',sans-serif] text-xs py-1.5 px-2.5 rounded-xl text-left flex items-center justify-between font-semibold"
              >
                <span className="truncate">{currentStore.name} (Current)</span>
                <span className="material-symbols-outlined text-xs">check</span>
              </button>
              <button
                onClick={onOpenStorePicker}
                className="bg-[#363433] text-[#bdcac0] hover:text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-xs py-1.5 px-2.5 rounded-xl text-left truncate"
              >
                Browse All Counters...
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Bento Grid Primary Modules */}
      <div className="grid grid-cols-1 gap-3">
        {/* 4. Live Queue Health & Wait Time Bento Card */}
        <section className="bg-[#211f1e]/90 backdrop-blur-md p-4 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden border border-white/5">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#52b788]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-[#bdcac0] font-['Space_Grotesk',sans-serif] text-xs">
              <span className="material-symbols-outlined text-base text-[#75daa8]">speed</span>
              <span>Bar Counter Cadence</span>
            </div>
            <div className="flex items-center gap-1 bg-[#2b2a28]/80 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#75daa8] animate-ping" />
              <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] font-semibold">
                Live Telemetry
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 my-1">
            <span className="font-['Syne',sans-serif] text-[40px] leading-[44px] font-extrabold text-[#e6e1df] tracking-tight">
              5 MIN
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] text-[#75daa8] font-bold">
              WAIT
            </span>
          </div>

          {/* Live metrics spark bar */}
          <div className="w-full bg-[#0f0e0d] h-2 rounded-full overflow-hidden my-1.5 flex">
            <div
              className="bg-[#75daa8] h-full rounded-full transition-all duration-700"
              style={{ width: '28%' }}
            />
            <div
              className="bg-[#e29353]/40 h-full rounded-full ml-1"
              style={{ width: '15%' }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[#bdcac0] font-['Plus_Jakarta_Sans',sans-serif] text-xs">
            <span className="flex items-center gap-1 text-[#e6e1df] font-medium">
              <span className="material-symbols-outlined text-xs text-[#75daa8]">groups</span> 4 baristas active
            </span>
            <span>•</span>
            <span className="text-[#e6e1df]">3 cups ahead</span>
            <span>•</span>
            <span className="text-[#75daa8] font-semibold">Best time: Now</span>
          </div>
        </section>

        {/* 2. One-Tap Favorites Bento Card (Morning Fuel) */}
        <section className="bg-[#211f1e]/90 backdrop-blur-md p-4 rounded-2xl shadow-md flex flex-col gap-2.5 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[#75daa8] text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <h2 className="font-['Syne',sans-serif] text-[20px] leading-[26px] text-[#e6e1df] font-bold">
                Morning Fuel
              </h2>
            </div>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase tracking-wider">
              Fast-Pass Reorder
            </span>
          </div>

          {/* Quick Reorder Item 1: Iced Ceremonial Oat Matcha */}
          <div className="bg-[#2b2a28]/70 hover:bg-[#2b2a28] p-2.5 rounded-xl flex items-center justify-between gap-2 transition-colors shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#0f0e0d] relative">
                <img
                  className="w-full h-full object-cover"
                  alt="Ceremonial Matcha"
                  src={ASSETS.ceremonialMatchaCup}
                />
                <div className="absolute inset-0 bg-[#75daa8]/10" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] text-[#e6e1df] font-semibold truncate">
                  Ceremonial Matcha
                </span>
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0] truncate">
                  Iced • Light Ice • Minor Figures Oat
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#75daa8] font-bold">
                    $6.75
                  </span>
                  <button
                    onClick={() => onOpenReviewsById('menu-matcha')}
                    className="text-[10px] font-['Space_Grotesk',sans-serif] text-[#ffb780] hover:underline flex items-center gap-0.5"
                    title="See user reviews and photos"
                  >
                    <span>★ 4.9 (142)</span>
                    <span className="material-symbols-outlined text-[11px] text-[#75daa8]">photo_camera</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleReorder('matcha')}
              className={`shrink-0 font-['Space_Grotesk',sans-serif] text-xs px-3.5 py-2 rounded-full transition-all active:scale-90 flex items-center gap-1 shadow-md ${
                reorderingMatcha
                  ? 'bg-[#52b788] text-[#00442c]'
                  : 'bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] shadow-[#75daa8]/20'
              }`}
            >
              <span className={`material-symbols-outlined text-sm font-bold ${reorderingMatcha ? 'animate-spin' : ''}`}>
                {reorderingMatcha ? 'refresh' : 'bolt'}
              </span>
              <span>{reorderingMatcha ? 'Sent!' : 'Reorder'}</span>
            </button>
          </div>

          {/* Quick Reorder Item 2: Flat White */}
          <div className="bg-[#2b2a28]/70 hover:bg-[#2b2a28] p-2.5 rounded-xl flex items-center justify-between gap-2 transition-colors shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#0f0e0d] relative">
                <img
                  className="w-full h-full object-cover"
                  alt="Flat White"
                  src={ASSETS.flatWhiteCup}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] text-[#e6e1df] font-semibold truncate">
                  Flat White
                </span>
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0] truncate">
                  Double Ristretto • Whole Milk • 6oz
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#75daa8] font-bold">
                    $5.25
                  </span>
                  <button
                    onClick={() => onOpenReviewsById('menu-flat-white')}
                    className="text-[10px] font-['Space_Grotesk',sans-serif] text-[#ffb780] hover:underline flex items-center gap-0.5"
                    title="See user reviews and photos"
                  >
                    <span>★ 4.9 (98)</span>
                    <span className="material-symbols-outlined text-[11px] text-[#75daa8]">photo_camera</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleReorder('flatwhite')}
              className={`shrink-0 font-['Space_Grotesk',sans-serif] text-xs px-3.5 py-2 rounded-full transition-all active:scale-90 flex items-center gap-1 shadow-sm ${
                reorderingFlatWhite
                  ? 'bg-[#52b788] text-[#00442c]'
                  : 'bg-[#50483f] hover:bg-[#3b3937] text-[#e6e1df]'
              }`}
            >
              <span className={`material-symbols-outlined text-sm text-[#75daa8] ${reorderingFlatWhite ? 'animate-spin' : ''}`}>
                {reorderingFlatWhite ? 'refresh' : 'bolt'}
              </span>
              <span>{reorderingFlatWhite ? 'Sent!' : 'Reorder'}</span>
            </button>
          </div>
        </section>

        {/* 2.5. 'Reserve a Seat & Table' Bento Card */}
        <section className="bg-[#211f1e]/90 backdrop-blur-xl p-4 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-white/5 space-y-3">
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-[#75daa8]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#75daa8]/20 text-[#75daa8] font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-wider">
                  Live Seating
                </span>
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                  Window Stools • Quiet Booths • Patio
                </span>
              </div>
              <h2 className="font-['Syne',sans-serif] text-[22px] leading-[28px] text-[#e6e1df] font-bold mt-1">
                Reserve Café Seat
              </h2>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0] mt-0.5">
                Guaranteed workspace & meeting spots with power outlets and fiber Wi-Fi.
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#75daa8]/15 border border-[#75daa8]/30 flex items-center justify-center shrink-0 text-[#75daa8]">
              <span className="material-symbols-outlined text-2xl">chair</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-['Space_Grotesk',sans-serif]">
            <div className="p-2 rounded-xl bg-[#0f0e0d]/80 border border-white/5">
              <span className="text-[10px] text-[#bdcac0] block">Window Counter</span>
              <span className="text-[#75daa8] font-bold">2 Open</span>
            </div>
            <div className="p-2 rounded-xl bg-[#0f0e0d]/80 border border-white/5">
              <span className="text-[10px] text-[#bdcac0] block">Velvet Booths</span>
              <span className="text-[#75daa8] font-bold">Available</span>
            </div>
            <div className="p-2 rounded-xl bg-[#0f0e0d]/80 border border-white/5">
              <span className="text-[10px] text-[#bdcac0] block">Heated Patio</span>
              <span className="text-[#ffb780] font-bold">3 Left</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSeatReservation}
            className="w-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Syne',sans-serif] text-sm py-2.5 px-4 rounded-full shadow-md shadow-[#75daa8]/20 flex items-center justify-center gap-1.5 transition-transform active:scale-95 font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">event_seat</span>
            <span>Reserve Table or Stool Now</span>
          </button>
        </section>

        {/* 3. 'Mystery Order Roulette' Bento Card */}
        <section className="bg-[#2b2a28]/80 backdrop-blur-xl p-4 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-white/5">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#75daa8]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#75daa8] text-[#003823] font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-wider">
                  Barista Curated
                </span>
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] font-semibold">
                  Sensory Radar 2.0
                </span>
              </div>
              <h2 className="font-['Syne',sans-serif] text-[24px] leading-[30px] text-[#e6e1df] font-bold mt-1">
                Mystery Roulette
              </h2>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#bdcac0] mt-0.5">
                Can't decide? Let our craft sensory bar sync with your day's vibe.
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full bg-[#75daa8]/20 flex items-center justify-center shrink-0 transition-transform duration-500 ${
                rouletteSpinning ? 'rotate-[360deg] scale-110' : ''
              }`}
            >
              <span className="material-symbols-outlined text-2xl text-[#75daa8]">casino</span>
            </div>
          </div>

          {/* Result Container (Dynamic Vibe Output) */}
          <div className="my-2 p-3 rounded-xl bg-[#0f0e0d]/80 flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[#75daa8] text-xl">auto_awesome</span>
              <div className="flex flex-col min-w-0">
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] text-[#e6e1df] font-bold truncate">
                  {roulettePick.name}
                </span>
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#75daa8] truncate">
                  {roulettePick.vibe}
                </span>
              </div>
            </div>
            <span className="font-['Space_Grotesk',sans-serif] text-sm text-[#e6e1df] font-bold shrink-0 ml-2">
              {roulettePick.price}
            </span>
          </div>

          <button
            onClick={handleSpinRoulette}
            disabled={rouletteSpinning}
            className="w-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Syne',sans-serif] text-[16px] py-3 px-4 rounded-full shadow-lg shadow-[#75daa8]/25 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-75 font-bold"
          >
            <span className={`material-symbols-outlined text-xl ${rouletteSpinning ? 'animate-spin' : ''}`}>
              restart_alt
            </span>
            <span>{rouletteSpinning ? 'Consulting Sensory Bar...' : 'Spin Mystery Order 🎲'}</span>
          </button>
        </section>

        {/* 5. Personalized Discovery Bento Cards */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[#ffb780] text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <h2 className="font-['Syne',sans-serif] text-[20px] text-[#e6e1df] font-bold">
                Discovery & Pairings
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenMenu}
              className="px-3 py-1.5 rounded-full bg-[#75daa8]/15 hover:bg-[#75daa8]/25 text-[#75daa8] font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#75daa8]/30 active:scale-95 cursor-pointer shadow-sm"
              title="Browse entire food, coffee, and matcha menu"
            >
              <span className="material-symbols-outlined text-sm">restaurant_menu</span>
              <span>Explore Menu</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>

          {/* Discovery 1: Chef's Pairing (Cardamom Pistachio Croissant) */}
          <div className="bg-[#211f1e]/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-md flex flex-col border border-white/5">
            <div className="relative w-full h-44 bg-[#0f0e0d]">
              <img
                className="w-full h-full object-cover"
                alt="Cardamom Pistachio Croissant"
                src={ASSETS.pistachioCroissant}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211f1e] via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-[#2b2a28]/90 backdrop-blur-md text-[#e6e1df] px-2.5 py-1 rounded-full font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-xs text-[#ffb780]">restaurant_menu</span>
                <span>Chef's Pairing</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-[#0f0e0d]/80 backdrop-blur-md px-2.5 py-1 rounded-full font-['Space_Grotesk',sans-serif] text-xs text-[#75daa8] font-bold">
                $5.50
              </div>
            </div>

            <div className="p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] text-[#e6e1df] font-bold">
                  Cardamom Pistachio Croissant
                </h3>
                <button
                  onClick={() => onOpenReviewsById('menu-croissant')}
                  className="flex items-center gap-1 text-[#ffb780] font-['Space_Grotesk',sans-serif] text-xs font-semibold hover:underline cursor-pointer"
                  title="See reviews with customer photos"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span>4.9</span>
                  <span className="text-[#bdcac0] font-normal">(128)</span>
                  <span className="material-symbols-outlined text-xs text-[#75daa8] ml-0.5">photo_camera</span>
                </button>
              </div>

              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#bdcac0] line-clamp-2">
                Twice-baked laminated pastry infused with wild green cardamom sugar and velvety Sicilian pistachio frangipane.
              </p>

              <div className="flex items-center justify-between pt-1 mt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-[#363433] text-[#bdcac0] text-[10px] font-['Space_Grotesk',sans-serif] px-2 py-0.5 rounded-full">
                    Flaky & Buttery
                  </span>
                  <span className="bg-[#363433] text-[#bdcac0] text-[10px] font-['Space_Grotesk',sans-serif] px-2 py-0.5 rounded-full">
                    Baked Hourly
                  </span>
                </div>
                <button
                  onClick={() => {
                    setCroissantAdded(!croissantAdded);
                    onQuickOrder('Cardamom Pistachio Croissant', '$5.50');
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-['Space_Grotesk',sans-serif] text-xs flex items-center gap-1 transition-all active:scale-95 shadow-sm ${
                    croissantAdded
                      ? 'bg-[#75daa8] text-[#003823] font-bold'
                      : 'bg-[#363433] hover:bg-[#75daa8] hover:text-[#003823] text-[#e6e1df]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {croissantAdded ? 'done' : 'add'}
                  </span>
                  <span>{croissantAdded ? 'Added' : 'Add'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Discovery 2: Trending Now (Honey Lavender Cold Brew) */}
          <div className="bg-[#211f1e]/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-md flex flex-col border border-white/5">
            <div className="relative w-full h-44 bg-[#0f0e0d]">
              <img
                className="w-full h-full object-cover"
                alt="Honey Lavender Cold Brew"
                src={ASSETS.honeyLavenderColdBrew}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211f1e] via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-[#2b2a28]/90 backdrop-blur-md text-[#e6e1df] px-2.5 py-1 rounded-full font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-xs text-[#75daa8]">trending_up</span>
                <span>Trending Now</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-[#0f0e0d]/80 backdrop-blur-md px-2.5 py-1 rounded-full font-['Space_Grotesk',sans-serif] text-xs text-[#75daa8] font-bold">
                $6.25
              </div>
            </div>

            <div className="p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] text-[#e6e1df] font-bold">
                  Honey Lavender Cold Brew
                </h3>
                <button
                  onClick={() => onOpenReviewsById('menu-cold-brew')}
                  className="flex items-center gap-1 text-[#ffb780] font-['Space_Grotesk',sans-serif] text-xs font-semibold hover:underline cursor-pointer"
                  title="See reviews with customer photos"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span>4.8</span>
                  <span className="text-[#bdcac0] font-normal">(94)</span>
                  <span className="material-symbols-outlined text-xs text-[#75daa8] ml-0.5">photo_camera</span>
                </button>
              </div>

              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#bdcac0] line-clamp-2">
                18-hour single-origin Ethiopian cold extraction sweetened with raw wildflower honey and topped with floral cold foam.
              </p>

              <div className="flex items-center justify-between pt-1 mt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-[#363433] text-[#75daa8] text-[10px] font-['Space_Grotesk',sans-serif] px-2 py-0.5 rounded-full font-medium">
                    #SuperSmooth
                  </span>
                  <span className="bg-[#363433] text-[#bdcac0] text-[10px] font-['Space_Grotesk',sans-serif] px-2 py-0.5 rounded-full">
                    #NotTooSweet
                  </span>
                </div>
                <button
                  onClick={() => {
                    setColdBrewAdded(!coldBrewAdded);
                    onQuickOrder('Honey Lavender Cold Brew', '$6.25');
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-['Space_Grotesk',sans-serif] text-xs flex items-center gap-1 transition-all active:scale-95 shadow-sm ${
                    coldBrewAdded
                      ? 'bg-[#75daa8] text-[#003823] font-bold'
                      : 'bg-[#363433] hover:bg-[#75daa8] hover:text-[#003823] text-[#e6e1df]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {coldBrewAdded ? 'done' : 'add'}
                  </span>
                  <span>{coldBrewAdded ? 'Added' : 'Add'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Real-time Pickup Status Card */}
        <div
          onClick={onOpenTracker}
          className="bg-[#2b2a28]/90 backdrop-blur-xl p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 mb-2 border border-white/5 cursor-pointer hover:border-[#75daa8]/30 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#75daa8]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#75daa8] text-xl animate-pulse">
                local_cafe
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#e6e1df] font-semibold truncate">
                  Active Ticket #{activeTicket.ticketNumber}
                </span>
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] font-bold">
                  • Step {activeTicket.step} of {activeTicket.totalSteps}
                </span>
              </div>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0] truncate">
                {activeTicket.statusDescription}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-lg text-[#75daa8] font-bold">
              {activeTicket.estimatedWait}
            </span>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
              Ready pickup
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
