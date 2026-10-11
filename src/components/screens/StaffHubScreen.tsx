import React, { useState, useEffect } from 'react';
import { ASSETS, REVIEWS } from '../../data/mockData';

export const StaffHubScreen: React.FC = () => {
  const [rerouteApplied, setRerouteApplied] = useState(false);
  const [surgeModeActive, setSurgeModeActive] = useState(false);
  const [playlistIdx, setPlaylistIdx] = useState(0);
  const [show86Modal, setShow86Modal] = useState(false);
  const [activeTicketsCount, setActiveTicketsCount] = useState(14);
  const [latency, setLatency] = useState(120);

  const playlists = ['Lo-fi Mornings', 'Tokyo Ambient Jazz', 'Coffeehouse Vinyl Beats'];

  // Inventory items for 86ing
  const [inventoryItems, setInventoryItems] = useState([
    { name: 'Cardamom Buns', count: '2 remaining', soldOut: false, critical: true },
    { name: 'Califia Extra Creamy Oat', count: '1 case left', soldOut: false, critical: true },
    { name: 'Single-Origin Uji Matcha', count: '12 tins', soldOut: false, critical: false },
    { name: 'Ethiopian Guji Natural', count: '8 bags', soldOut: false, critical: false },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(110 + Math.floor(Math.random() * 25));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleCyclePlaylist = () => {
    setPlaylistIdx((prev) => (prev + 1) % playlists.length);
  };

  const toggleSoldOut = (index: number) => {
    setInventoryItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, soldOut: !item.soldOut } : item
      )
    );
  };

  const toggleSurge = () => {
    setSurgeModeActive((prev) => !prev);
    setActiveTicketsCount((prev) => (surgeModeActive ? prev - 2 : prev + 2));
  };

  return (
    <div className="flex flex-col w-full px-4 py-2 space-y-3.5 pb-12 max-w-md mx-auto animate-fadeIn">
      {/* Top Operational Shift Banner */}
      <section className="flex flex-col gap-1.5 bg-[#1d1b1a] rounded-2xl p-4 shadow-md relative overflow-hidden border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex w-2.5 h-2.5 rounded-full bg-[#75daa8] animate-pulse" />
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] uppercase tracking-wider font-bold">
              Live Floor Ops
            </span>
          </div>
          <span className="font-['Space_Grotesk',sans-serif] text-[10px] bg-[#2b2a28] text-[#ede0d4] px-2.5 py-1 rounded-full font-medium">
            Shift: Morning Rush (07:30 – 12:00)
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <h2 className="font-['Syne',sans-serif] text-lg font-bold text-[#e6e1df]">
              Mercer St Flagship
            </h2>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0] flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-sm text-[#d1c4b9]">group</span>
              <span>
                4 on floor: <strong className="text-[#e6e1df] font-semibold">Sam (Lead), Elena, Kai, Maya</strong>
              </span>
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#211f1e] px-2.5 py-1 rounded-full shadow-sm border border-white/5">
            <span
              className="material-symbols-outlined text-sm text-[#75daa8]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              speed
            </span>
            <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#e6e1df] font-bold">
              Rush Pace
            </span>
          </div>
        </div>
      </section>

      {/* Queue Health Sentinel (Bento Card) */}
      <section className="flex flex-col bg-[#211f1e] rounded-2xl p-4 shadow-md gap-3 relative overflow-hidden border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ffb780]/20 flex items-center justify-center text-[#ffb780]">
              <span className="material-symbols-outlined text-lg">hourglass_top</span>
            </div>
            <div>
              <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] block leading-none">
                Queue Sentinel
              </span>
              <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#ffb780] font-bold">
                Moderate Velocity
              </span>
            </div>
          </div>
          <span className="font-['Space_Grotesk',sans-serif] text-xs px-2.5 py-1 rounded-full bg-[#2b2a28] text-[#e6e1df] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb780]" />
            8m Cadence
          </span>
        </div>

        {/* Telemetry Display */}
        <div className="grid grid-cols-2 gap-2.5 items-center">
          <div className="bg-[#1d1b1a] rounded-xl p-3 flex flex-col border border-white/5">
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
              Active Tickets
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-['Syne',sans-serif] text-[28px] font-extrabold text-[#e6e1df]">
                {activeTicketsCount}
              </span>
              <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#ffb780] font-bold">
                +3 vs 10m ago
              </span>
            </div>
            <div className="w-full bg-[#363433] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#ffb780] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(activeTicketsCount * 5, 95)}%` }}
              />
            </div>
          </div>

          <div className="bg-[#1d1b1a] rounded-xl p-3 flex flex-col border border-white/5">
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
              Bar Cadence
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-['Syne',sans-serif] text-[28px] font-extrabold text-[#e6e1df]">
                {surgeModeActive ? '10.2' : '8.2'}
              </span>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0]">
                min
              </span>
            </div>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#ffb780] mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">tune</span> Target: 6.0m
            </span>
          </div>
        </div>

        {/* Bottleneck Alert Banner */}
        <div className="bg-[#e29353]/15 rounded-xl p-3 flex items-start gap-3 shadow-sm border border-[#ffb780]/20">
          <div className="w-7 h-7 rounded-full bg-[#e29353] text-[#5e2e00] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-base">warning</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#ffb780] font-bold uppercase tracking-wider">
              Espresso Bar Alert
            </span>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#e6e1df] mt-0.5 leading-snug">
              Oat milk steaming wand backup (+3m delay). Recommend re-routing cold & iced brews to Bar 2.
            </p>
            <button
              onClick={() => setRerouteApplied(!rerouteApplied)}
              className={`mt-2.5 self-start font-['Space_Grotesk',sans-serif] text-xs px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm ${
                rerouteApplied
                  ? 'bg-[#75daa8] text-[#003823] font-bold'
                  : 'bg-[#2b2a28] hover:bg-[#363433] text-[#ffdcc4]'
              }`}
            >
              <span className="material-symbols-outlined text-xs">
                {rerouteApplied ? 'check_circle' : 'alt_route'}
              </span>
              <span>{rerouteApplied ? 'Bar 2 Reroute Active' : 'Apply Iced Reroute'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Room Sentiment Radar (Acoustic Lounge Telemetry) */}
      <section className="flex flex-col bg-[#211f1e] rounded-2xl p-4 shadow-md gap-3 relative overflow-hidden border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#75daa8]/20 flex items-center justify-center text-[#75daa8]">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                psychology
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
                  Sentiment Radar
                </span>
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] px-1.5 py-0.5 rounded-full bg-[#75daa8]/10 font-bold">
                  Acoustic Live
                </span>
              </div>
              <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                Acoustic & Visual Lounge Telemetry
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-['Syne',sans-serif] text-lg font-bold text-[#75daa8]">94%</span>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8]">
              Positive Vibe
            </span>
          </div>
        </div>

        {/* Barometer Breakdown */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#1d1b1a] p-2.5 rounded-xl flex flex-col items-center text-center border border-white/5">
            <span className="material-symbols-outlined text-lg text-[#75daa8] mb-0.5">spa</span>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
              Atmosphere
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#e6e1df] font-bold mt-0.5">
              Serene
            </span>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] mt-1 font-medium">
              82% Chill
            </span>
          </div>

          <div className="bg-[#1d1b1a] p-2.5 rounded-xl flex flex-col items-center text-center border border-white/5">
            <span className="material-symbols-outlined text-lg text-[#d1c4b9] mb-0.5">headphones</span>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
              Acoustics
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#e6e1df] font-bold mt-0.5">
              Lo-fi Beats
            </span>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#ede0d4] mt-1 font-medium">
              Optimal dB
            </span>
          </div>

          <div className="bg-[#1d1b1a] p-2.5 rounded-xl flex flex-col items-center text-center border border-white/5">
            <span className="material-symbols-outlined text-lg text-[#ffb780] mb-0.5">thermostat</span>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
              Ambient Air
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#e6e1df] font-bold mt-0.5">
              69°F
            </span>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#ffdcc4] mt-1 font-medium">
              Comfort High
            </span>
          </div>
        </div>

        {/* Sensory Visual Spark */}
        <div className="bg-[#1d1b1a] rounded-xl p-2.5 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#75daa8] animate-spin" style={{ animationDuration: '4s' }}>
              motion_sensor_active
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0]">
              Patron Footprint: High focus, 18 laptop stations active
            </span>
          </div>
          <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] px-2 py-0.5 bg-[#75daa8]/10 rounded-full font-bold">
            Smooth
          </span>
        </div>
      </section>

      {/* Live Feedback Stream & Item Review Ticker */}
      <section className="flex flex-col bg-[#211f1e] rounded-2xl p-4 shadow-md gap-2.5 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#75daa8] text-xl">reviews</span>
            <h3 className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
              Live Feedback Stream
            </h3>
          </div>
          <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#75daa8] animate-ping" />
            Streaming
          </span>
        </div>

        {REVIEWS.map((review) => (
          <article
            key={review.id}
            className="bg-[#1d1b1a] rounded-xl p-3 flex flex-col gap-1.5 transition-all border border-white/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  alt={review.author}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10"
                  src={review.avatar}
                />
                <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#e6e1df] font-semibold">
                  {review.author}
                </span>
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                  • {review.timeAgo}
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-[#75daa8]">
                {[...Array(review.rating)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-xs"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>

            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#e6e1df] italic leading-snug">
              {review.text}
            </p>

            <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5">
              <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#ede0d4] bg-[#2b2a28] px-2 py-0.5 rounded-full font-medium">
                {review.drinkTag}
              </span>
              <span
                className={`font-['Space_Grotesk',sans-serif] text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  review.badgeType === 'primary'
                    ? 'text-[#75daa8] bg-[#75daa8]/10'
                    : 'text-[#ffb780] bg-[#ffb780]/10'
                }`}
              >
                {review.badgeTag}
              </span>
            </div>
          </article>
        ))}
      </section>

      {/* Instant Barista Quick-Actions */}
      <section className="flex flex-col bg-[#211f1e] rounded-2xl p-4 shadow-md gap-2.5 border border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
            Floor Interventions
          </h3>
          <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#d1c4b9]">
            Instant Trigger
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* 86 Item Trigger */}
          <button
            onClick={() => setShow86Modal(true)}
            className="w-full h-12 bg-[#2b2a28] hover:bg-[#363433] rounded-full px-4 flex items-center justify-between text-[#e6e1df] transition-all active:scale-[0.98] border border-white/5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ffb4ab]">remove_shopping_cart</span>
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-semibold">
                86 Item / Mark Sold Out
              </span>
            </div>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#ffb4ab] bg-[#93000a]/20 px-2.5 py-0.5 rounded-full font-bold border border-[#ffb4ab]/30">
              2 Low Stock
            </span>
          </button>

          {/* Music Vibe Trigger */}
          <button
            onClick={handleCyclePlaylist}
            className="w-full h-12 bg-[#2b2a28] hover:bg-[#363433] rounded-full px-4 flex items-center justify-between text-[#e6e1df] transition-all active:scale-[0.98] border border-white/5 shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="material-symbols-outlined text-[#75daa8]">equalizer</span>
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-semibold truncate">
                Shift Playlist: {playlists[playlistIdx]}
              </span>
            </div>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] bg-[#75daa8]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold shrink-0">
              <span className="material-symbols-outlined text-xs">skip_next</span> Shift
            </span>
          </button>

          {/* Surge Mode Action */}
          <button
            onClick={toggleSurge}
            className={`w-full h-12 rounded-full px-4 flex items-center justify-between transition-all active:scale-[0.98] shadow-md ${
              surgeModeActive
                ? 'bg-[#52b788] text-[#00442c]'
                : 'bg-[#e29353] text-[#5e2e00] hover:opacity-95'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">bolt</span>
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold">
                Surge Mode (+2m Padding)
              </span>
            </div>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] bg-black/20 px-3 py-1 rounded-full font-extrabold uppercase tracking-wide">
              {surgeModeActive ? 'ACTIVE +2m' : 'Standby'}
            </span>
          </button>
        </div>
      </section>

      {/* Live SSE Telemetry Footer Bar */}
      <footer className="flex items-center justify-between px-3.5 py-2.5 bg-[#0f0e0d] rounded-full shadow-inner border border-white/5 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#75daa8] animate-ping" />
          <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] font-bold">
            SSE WebSocket Connected
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#bdcac0] font-['Space_Grotesk',sans-serif] text-[10px]">
          <span className="material-symbols-outlined text-xs text-[#75daa8]">sync_alt</span>
          <span>{latency}ms latency</span>
          <span>•</span>
          <span>Node 04</span>
        </div>
      </footer>

      {/* 86 Sold Out Items Quick Modal */}
      {show86Modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-sm bg-[#1d1b1a] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h4 className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
                Floor Inventory / 86 Control
              </h4>
              <button
                onClick={() => setShow86Modal(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#bdcac0]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-2">
              {inventoryItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#211f1e] border border-white/5"
                >
                  <div>
                    <p className={`text-xs font-semibold ${item.soldOut ? 'line-through text-[#88948b]' : 'text-[#e6e1df]'}`}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[#bdcac0]">{item.count}</p>
                  </div>
                  <button
                    onClick={() => toggleSoldOut(idx)}
                    className={`px-3 py-1 rounded-full text-[10px] font-['Space_Grotesk',sans-serif] font-bold transition-all ${
                      item.soldOut
                        ? 'bg-[#93000a] text-[#ffdad6]'
                        : 'bg-[#363433] hover:bg-[#ffb4ab] hover:text-[#690005] text-[#bdcac0]'
                    }`}
                  >
                    {item.soldOut ? 'SOLD OUT (86)' : 'In Stock'}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShow86Modal(false)}
              className="w-full py-2.5 rounded-full bg-[#75daa8] text-[#003823] font-['Syne',sans-serif] text-xs font-bold"
            >
              Sync to POS & Digital Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
