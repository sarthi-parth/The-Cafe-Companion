import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';
import { ConnectionRequest, CurrentUserProfile, Patron, SeatReservation } from '../../types/cafe';

interface CommunityScreenProps {
  presenceVisible: boolean;
  onTogglePresence: () => void;
  patrons: Patron[];
  incomingRequests: ConnectionRequest[];
  userProfile: CurrentUserProfile;
  activeReservation?: SeatReservation | null;
  onOpenPatronProfile: (patron: Patron) => void;
  onOpenIncomingRequest: (request: ConnectionRequest) => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onSimulateIncomingRequest: () => void;
  onOpenSeatReservation: () => void;
  onOpenEditProfile: () => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  presenceVisible,
  onTogglePresence,
  patrons,
  incomingRequests,
  userProfile,
  activeReservation,
  onOpenPatronProfile,
  onOpenIncomingRequest,
  onAcceptRequest,
  onRejectRequest,
  onSimulateIncomingRequest,
  onOpenSeatReservation,
  onOpenEditProfile,
}) => {
  const [subView, setSubView] = useState<'patron' | 'staff'>('patron');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [waveTargetName, setWaveTargetName] = useState<string | null>(null);

  const pendingRequests = incomingRequests.filter((r) => r.status === 'pending');

  const availableTags = ['all', '#SciFi', '#Design', '#SpecialtyCoffee', '#Literature', '#FilmPhotography'];

  const filteredPatrons = patrons.filter((patron) => {
    if (filterTag === 'all') return true;
    return patron.tags.some((t) => t.toLowerCase().includes(filterTag.replace('#', '').toLowerCase()));
  });

  const handleQuickWave = (e: React.MouseEvent, targetName: string) => {
    e.stopPropagation();
    setWaveTargetName(targetName);
    setTimeout(() => {
      setWaveTargetName(null);
    }, 2800);
  };

  return (
    <div className="flex flex-col w-full px-4 space-y-4 pb-12 max-w-md mx-auto animate-fadeIn">
      {/* Hub Header / Quick Mode Switcher Segment */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] uppercase tracking-wider font-bold">
              Social Co-Presence & Real-Time Ops
            </p>
            <h1 className="font-['Syne',sans-serif] text-[28px] leading-[34px] font-extrabold text-[#e6e1df]">
              The Hearth
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2b2a28]/80 backdrop-blur-md border border-white/5">
            <span className="w-2 h-2 rounded-full bg-[#75daa8] animate-pulse" />
            <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-medium">
              {patrons.length + 12} Here Now
            </span>
          </div>
        </div>

        {/* Segmented Tab Toggle */}
        <div className="p-1 rounded-full bg-[#0f0e0d]/90 backdrop-blur-xl flex relative border border-white/5">
          <button
            onClick={() => setSubView('patron')}
            className={`flex-1 py-2 rounded-full font-['Space_Grotesk',sans-serif] text-xs transition-all duration-300 flex items-center justify-center gap-1.5 ${
              subView === 'patron'
                ? 'text-[#003823] bg-[#75daa8] font-bold shadow-sm'
                : 'text-[#bdcac0] hover:text-[#e6e1df]'
            }`}
          >
            <span className="material-symbols-outlined text-base">forum</span>
            <span>Third Place Mode</span>
            {pendingRequests.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#ffb780] animate-ping" />
            )}
          </button>
          <button
            onClick={() => setSubView('staff')}
            className={`flex-1 py-2 rounded-full font-['Space_Grotesk',sans-serif] text-xs transition-all duration-300 flex items-center justify-center gap-1.5 ${
              subView === 'staff'
                ? 'text-[#003823] bg-[#75daa8] font-bold shadow-sm'
                : 'text-[#bdcac0] hover:text-[#e6e1df]'
            }`}
          >
            <span className="material-symbols-outlined text-base">sensors</span>
            <span>Live Bar Radar</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CUSTOMER THIRD PLACE MODE */}
      {subView === 'patron' && (
        <div className="flex flex-col space-y-3.5 animate-fadeIn" id="view-patron">
          {/* User's Opt-In Lounge & Seat Status Card */}
          <div className="p-4 rounded-2xl bg-[#211f1e]/85 backdrop-blur-xl shadow-md flex items-center justify-between gap-3 border border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <div
                onClick={onOpenEditProfile}
                className="relative w-12 h-12 rounded-full bg-[#363433] shrink-0 overflow-hidden ring-1 ring-[#75daa8]/50 cursor-pointer group"
                title="Click to edit your bio & profile"
              >
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  alt={userProfile.name}
                  src={userProfile.avatar}
                />
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0f0e0d] ${
                    presenceVisible ? 'bg-[#75daa8]' : 'bg-[#88948b]'
                  }`}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#e6e1df] font-bold truncate">
                    {userProfile.name}
                  </p>
                  <button
                    onClick={onOpenEditProfile}
                    className="text-[10px] text-[#75daa8] font-['Space_Grotesk',sans-serif] hover:underline flex items-center gap-0.5"
                    title="Edit your bio and profile"
                  >
                    <span>Edit Bio</span>
                    <span className="material-symbols-outlined text-[11px]">edit</span>
                  </button>
                </div>
                <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] truncate">
                  {activeReservation
                    ? `${activeReservation.tableName} (${activeReservation.timeSlot})`
                    : userProfile.tableNumber}
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#75daa8] flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${presenceVisible ? 'bg-[#75daa8]' : 'bg-[#88948b]'}`} />
                  <span>{presenceVisible ? 'Social Radar: Visible' : 'Social Radar: Incognito'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 items-end shrink-0">
              <button
                onClick={onTogglePresence}
                className={`px-3 py-1.5 rounded-full font-['Space_Grotesk',sans-serif] text-xs active:scale-95 transition-transform flex items-center gap-1 ${
                  presenceVisible
                    ? 'bg-[#52b788]/20 text-[#75daa8] border border-[#75daa8]/30 font-semibold'
                    : 'bg-[#363433] text-[#bdcac0]'
                }`}
                title={presenceVisible ? 'Visible to others in cafe' : 'Hidden from radar'}
              >
                <span className="material-symbols-outlined text-sm">
                  {presenceVisible ? 'wifi_tethering' : 'visibility_off'}
                </span>
                <span>{presenceVisible ? 'Visible' : 'Hidden'}</span>
              </button>

              <button
                onClick={onOpenSeatReservation}
                className="text-[10px] text-[#75daa8] hover:underline flex items-center gap-0.5 font-['Space_Grotesk',sans-serif]"
              >
                <span className="material-symbols-outlined text-xs">chair</span>
                <span>{activeReservation ? 'Manage Seat' : 'Reserve Seat'}</span>
              </button>
            </div>
          </div>

          {/* Radar Status Helper Banner if in Stealth Mode */}
          {!presenceVisible && (
            <div className="p-3 rounded-xl bg-[#2b2520] border border-[#ffb780]/30 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#d1c4b9]">
                <span className="material-symbols-outlined text-[#ffb780] text-base">info</span>
                <span>Social Radar is paused. Make yourself visible to send or receive connection requests.</span>
              </div>
              <button
                onClick={onTogglePresence}
                className="px-2.5 py-1 rounded-full bg-[#75daa8] text-[#003823] font-['Space_Grotesk',sans-serif] text-[10px] font-bold shrink-0"
              >
                Turn On
              </button>
            </div>
          )}

          {/* INCOMING CONNECTION REQUESTS TRAY (If any pending requests) */}
          {pendingRequests.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#253229] to-[#211f1e] border border-[#75daa8]/40 shadow-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#75daa8]">
                  <span className="material-symbols-outlined text-lg animate-pulse">mark_email_unread</span>
                  <span className="font-['Space_Grotesk',sans-serif] text-xs uppercase tracking-wider font-bold">
                    Incoming Request ({pendingRequests.length})
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#ffb780]/20 text-[#ffb780] font-['Space_Grotesk',sans-serif] text-[10px] font-bold">
                  Review & Respond
                </span>
              </div>

              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-[#0f0e0d]/90 border border-white/5 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-[#2b2a28] ring-1 ring-[#75daa8]/50 shrink-0">
                        <img
                          src={req.fromPatron.avatar}
                          alt={req.fromPatron.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-['Syne',sans-serif] text-sm font-bold text-[#e6e1df]">
                            {req.fromPatron.name}
                          </h4>
                          <span className="text-[10px] text-[#75daa8] font-['Space_Grotesk',sans-serif]">
                            {req.fromPatron.table}
                          </span>
                        </div>
                        <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                          {req.intent}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#bdcac0] font-['Space_Grotesk',sans-serif] shrink-0">
                      {req.timestamp}
                    </span>
                  </div>

                  {req.message && (
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#d1c4b9] italic bg-[#211f1e] p-2.5 rounded-lg border border-white/5">
                      "{req.message}"
                    </p>
                  )}

                  {/* Actions: View Profile, Accept, Reject */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onOpenIncomingRequest(req)}
                      className="px-3 py-1.5 rounded-full bg-[#363433] hover:bg-[#3b3937] text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="See full patron profile"
                    >
                      <span className="material-symbols-outlined text-sm">badge</span>
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => onAcceptRequest(req.id)}
                      className="flex-1 py-1.5 rounded-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Space_Grotesk',sans-serif] text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => onRejectRequest(req.id)}
                      className="px-3 py-1.5 rounded-full bg-transparent hover:bg-white/5 text-[#bdcac0] hover:text-[#ff8080] font-['Space_Grotesk',sans-serif] text-xs font-semibold transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Simulation Button for Testing */}
          <div className="flex items-center justify-between px-1">
            <span className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#bdcac0]">
              Social Radar Simulator
            </span>
            <button
              onClick={onSimulateIncomingRequest}
              className="text-[11px] text-[#75daa8] hover:underline flex items-center gap-1 font-['Space_Grotesk',sans-serif] font-medium"
            >
              <span className="material-symbols-outlined text-xs">add_alert</span>
              <span>Simulate Incoming Request</span>
            </button>
          </div>

          {/* Lounge Affinity Suggestion Banner (Maya S.) */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-[#2b2a28]/90 backdrop-blur-xl shadow-lg space-y-3 border border-white/5">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#75daa8]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#75daa8]">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] uppercase tracking-wider font-bold">
                  Patron Vibe Sync
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#363433] text-[#bdcac0] font-['Space_Grotesk',sans-serif] text-[10px]">
                96% Affinity Match
              </span>
            </div>

            <div className="space-y-0.5">
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-base text-[#e6e1df] font-semibold">
                Shared Interest with Maya S.
              </p>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0]">
                You both dwell in <span className="text-[#ffb780]">#SciFi</span> &{' '}
                <span className="text-[#75daa8]">#GenerativeDesign</span>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0f0e0d]/70 backdrop-blur-sm border border-white/5">
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#d1c4b9] italic">
                “Have you tried pairing the Gesha pour-over with chapter 4 of Dune Messiah yet? It sets the pace perfectly.”
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#bdcac0]">
                Seated at Table 04 (Window Bench)
              </span>
              <button
                onClick={() => {
                  const maya = patrons.find((p) => p.name.includes('Maya')) || patrons[0];
                  onOpenPatronProfile(maya);
                }}
                className="px-4 py-2 rounded-full font-['Space_Grotesk',sans-serif] text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5 bg-[#75daa8] text-[#003823] hover:bg-[#92f7c3]"
              >
                <span className="material-symbols-outlined text-base">badge</span>
                <span>View Profile & Connect</span>
              </button>
            </div>
          </div>

          {/* Section Title & Filter Chips */}
          <div className="space-y-2 pt-1 px-1">
            <div className="flex items-center justify-between">
              <h2 className="font-['Syne',sans-serif] text-lg text-[#e6e1df] font-bold">
                Patrons In The Room ({filteredPatrons.length})
              </h2>
              <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                Tap card to view profile
              </span>
            </div>

            {/* Filter Tags */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-['Space_Grotesk',sans-serif] shrink-0 transition-all ${
                    filterTag === tag
                      ? 'bg-[#75daa8] text-[#003823] font-bold shadow-sm'
                      : 'bg-[#2b2a28] text-[#bdcac0] hover:text-[#e6e1df]'
                  }`}
                >
                  {tag === 'all' ? 'All Patrons' : tag}
                </button>
              ))}
            </div>
          </div>

          {/* Patron Cards Stream */}
          <div className="space-y-2.5">
            {filteredPatrons.map((patron) => {
              const isTargetVisible = patron.isRadarVisible;
              const canConnect = presenceVisible && isTargetVisible;
              const isConnected = patron.connectionStatus === 'connected';
              const isPending = patron.connectionStatus === 'pending';

              return (
                <div
                  key={patron.id}
                  onClick={() => onOpenPatronProfile(patron)}
                  className="p-4 rounded-2xl bg-[#211f1e]/85 backdrop-blur-md shadow-sm space-y-2.5 transition-all hover:bg-[#252322] border border-white/5 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full bg-[#363433] overflow-hidden shrink-0 ring-1 ring-white/10">
                        <img
                          className="w-full h-full object-cover"
                          alt={patron.name}
                          src={patron.avatar}
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a1918] ${
                            isTargetVisible ? 'bg-[#75daa8]' : 'bg-[#88948b]'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#e6e1df] group-hover:text-[#75daa8] transition-colors">
                            {patron.name}
                          </p>
                          {patron.tableNumber && (
                            <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                              • {patron.tableNumber.split('•')[0]}
                            </span>
                          )}
                        </div>
                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0] line-clamp-1">
                          {patron.activity}
                        </p>
                      </div>
                    </div>

                    {/* Mode / Radar Status Badge */}
                    {isConnected ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#75daa8]/20 text-[#75daa8] font-['Space_Grotesk',sans-serif] text-[10px] font-bold">
                        Connected 🤝
                      </span>
                    ) : isPending ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#ffb780]/20 text-[#ffb780] font-['Space_Grotesk',sans-serif] text-[10px] font-bold">
                        Pending ⏳
                      </span>
                    ) : !isTargetVisible ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#363433] text-[#bdcac0] font-['Space_Grotesk',sans-serif] text-[10px]">
                        Stealth Mode
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#75daa8]/15 text-[#75daa8] font-['Space_Grotesk',sans-serif] text-[10px] font-medium">
                        {patron.modeLabel || 'Open to Connect'}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {patron.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-0.5 rounded-full font-['Space_Grotesk',sans-serif] text-[10px] ${
                          tag.includes('Matcha')
                            ? 'bg-[#75daa8]/15 text-[#75daa8]'
                            : tag.includes('SciFi')
                            ? 'bg-[#ffb780]/15 text-[#ffb780]'
                            : 'bg-[#363433]/80 text-[#bdcac0]'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom bar with Drink & Connect Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                    <span className="truncate pr-2">Drinking: {patron.drink}</span>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleQuickWave(e, patron.name)}
                        className="text-[#bdcac0] hover:text-[#75daa8] text-xs p-1"
                        title="Send quick wave"
                      >
                        👋
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPatronProfile(patron);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                          isConnected
                            ? 'bg-[#75daa8]/20 text-[#75daa8]'
                            : canConnect
                            ? 'bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823]'
                            : 'bg-[#363433] text-[#bdcac0]'
                        }`}
                      >
                        <span>{isConnected ? 'Chat' : canConnect ? 'Connect' : 'View Profile'}</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: BARISTA STAFF LIVE RADAR */}
      {subView === 'staff' && (
        <div className="flex flex-col space-y-3.5 animate-fadeIn" id="view-staff">
          {/* Top Operations Metrics Hero Card */}
          <div className="p-4 rounded-2xl bg-[#211f1e]/90 backdrop-blur-xl shadow-lg space-y-3.5 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#75daa8] text-xl">speed</span>
                <span className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
                  Bar Telemetry
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#75daa8] text-[#003823] font-['Space_Grotesk',sans-serif] text-xs font-bold tracking-wide uppercase">
                GREEN (Optimal)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-[#0f0e0d]/80 backdrop-blur-sm border border-white/5">
                <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase">
                  In Flight
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-['Syne',sans-serif] text-3xl font-extrabold text-[#e6e1df]">
                    6
                  </span>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0]">
                    orders
                  </span>
                </div>
                <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] mt-1 font-medium">
                  2 on Slayer • 4 Matcha
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0f0e0d]/80 backdrop-blur-sm border border-white/5">
                <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase">
                  Avg Brew Time
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-['Syne',sans-serif] text-3xl font-extrabold text-[#e6e1df]">
                    3.8
                  </span>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0]">
                    mins
                  </span>
                </div>
                <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] mt-1 font-medium">
                  -42s vs peak hour
                </p>
              </div>
            </div>
          </div>

          {/* Live Atmosphere Radar with Circular Visualizer */}
          <div className="p-4 rounded-2xl bg-[#2b2a28]/80 backdrop-blur-xl shadow-md space-y-3 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase">
                  Room Vibe Index
                </p>
                <h2 className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
                  Live Atmosphere Radar
                </h2>
              </div>
              <div className="flex items-center gap-1 text-[#75daa8]">
                <span className="font-['Syne',sans-serif] text-xl font-bold">94%</span>
                <span className="material-symbols-outlined text-lg">trending_up</span>
              </div>
            </div>

            {/* Radar Infographic Visual */}
            <div className="p-3.5 rounded-xl bg-[#0f0e0d]/80 flex items-center justify-between gap-4 border border-white/5">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#363433]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-[#75daa8]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="94, 100"
                    strokeLinecap="round"
                    strokeWidth="3.2"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-[#75daa8] text-xl">favorite</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <div className="flex justify-between font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] mb-1">
                    <span>Acoustics & Decibels</span>
                    <span className="text-[#75daa8] font-bold">58 dB (Calm)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#363433] overflow-hidden">
                    <div className="h-full bg-[#75daa8] rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] mb-1">
                    <span>Seating Comfort</span>
                    <span className="text-[#75daa8] font-bold">82% Available</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#363433] overflow-hidden">
                    <div className="h-full bg-[#75daa8] rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Station Flow & Alerts */}
          <div className="p-4 rounded-2xl bg-[#211f1e]/80 backdrop-blur-md shadow-sm space-y-2.5 border border-white/5">
            <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase tracking-wider font-bold">
              Station Flow & Alerts
            </p>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1d1b1a]">
              <span className="material-symbols-outlined text-[#75daa8] shrink-0 text-xl">
                check_circle
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#e6e1df]">
                  Matcha Whisk Station
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#bdcac0]">
                  Flowing smoothly • Temp controlled at 78°C
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#e29353]/15 border border-[#ffb780]/20">
              <span className="material-symbols-outlined text-[#ffb780] shrink-0 text-xl">
                warning
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#ffb780]">
                  Pastry Warmer Stock Low
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#bdcac0]">
                  Only 2 Cardamom Buns left • Prep bake rack 3
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Wave Notification Toast */}
      {waveTargetName && (
        <div className="fixed bottom-24 left-4 right-4 z-50 p-4 rounded-2xl bg-[#363433]/95 backdrop-blur-2xl shadow-2xl flex items-center justify-between border border-[#75daa8]/30 max-w-md mx-auto animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">👋</span>
            <div>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#e6e1df]">
                Wave Sent to {waveTargetName}!
              </p>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#75daa8]">
                Friendly co-presence signal delivered via The Hearth
              </p>
            </div>
          </div>
          <button
            onClick={() => setWaveTargetName(null)}
            className="p-1 rounded-full text-[#bdcac0] hover:text-[#e6e1df]"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}
    </div>
  );
};
