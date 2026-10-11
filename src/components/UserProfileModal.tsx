import React, { useState } from 'react';
import { ConnectionRequest, Patron } from '../types/cafe';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patron: Patron | null;
  incomingRequest?: ConnectionRequest | null;
  isCurrentUserRadarVisible: boolean;
  onSendRequest: (patronId: string, intent: string, message: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onToggleUserRadar: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  patron,
  incomingRequest,
  isCurrentUserRadarVisible,
  onSendRequest,
  onAcceptRequest,
  onRejectRequest,
  onToggleUserRadar,
}) => {
  const [selectedIntent, setSelectedIntent] = useState('Coffee & Casual Chat');
  const [customMessage, setCustomMessage] = useState('');
  const [requestSentLocally, setRequestSentLocally] = useState(false);
  const [activeChatNote, setActiveChatNote] = useState('');
  const [chatNotes, setChatNotes] = useState<string[]>([]);

  if (!isOpen || (!patron && !incomingRequest)) return null;

  // Extract display info
  const name = incomingRequest ? incomingRequest.fromPatron.name : patron?.name || 'Patron';
  const avatar = incomingRequest ? incomingRequest.fromPatron.avatar : patron?.avatar || '';
  const table = incomingRequest
    ? incomingRequest.fromPatron.table
    : patron?.tableNumber || 'In Café Lounge';
  const drink = incomingRequest ? incomingRequest.fromPatron.drink : patron?.drink || 'Specialty Brew';
  const bio = incomingRequest
    ? incomingRequest.fromPatron.bio
    : patron?.bio || 'Café companion member dwelling in specialty coffee craft.';
  const tags = incomingRequest ? incomingRequest.fromPatron.tags : patron?.tags || [];
  const affinity = incomingRequest
    ? incomingRequest.fromPatron.affinityPercent || 94
    : patron?.affinityPercent || 88;
  const activity = incomingRequest
    ? incomingRequest.fromPatron.activity || 'Enjoying morning brew'
    : patron?.activity || 'In the room';

  const isTargetRadarVisible = incomingRequest ? true : Boolean(patron?.isRadarVisible);
  const isConnected = patron?.connectionStatus === 'connected' || incomingRequest?.status === 'accepted';
  const isPending = patron?.connectionStatus === 'pending' || requestSentLocally;

  const intents = [
    { id: 'Coffee & Casual Chat', label: '☕ Coffee & Chat', desc: '10-min casual break' },
    { id: 'Co-work / Discussion', label: '💻 Co-work', desc: 'Share table & bounce ideas' },
    { id: 'Creative / Book Swap', label: '📖 Creative Project', desc: 'Discuss book or design' },
    { id: 'Table Sharing', label: '🤝 Share Open Table', desc: 'Sit together at busy hours' },
  ];

  const handleSend = () => {
    if (!patron) return;
    onSendRequest(patron.id, selectedIntent, customMessage);
    setRequestSentLocally(true);
    setTimeout(() => {
      onClose();
      setRequestSentLocally(false);
    }, 1200);
  };

  const handleSendQuickNote = () => {
    if (!activeChatNote.trim()) return;
    setChatNotes((prev) => [...prev, activeChatNote.trim()]);
    setActiveChatNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#1a1918] border border-white/10 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
      >
        {/* Header Banner */}
        <div className="relative p-5 pb-4 bg-gradient-to-b from-[#252322] to-[#1a1918] border-b border-white/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0f0e0d]/70 text-[#bdcac0] hover:text-[#e6e1df] flex items-center justify-center transition-colors"
            aria-label="Close profile"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>

          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#2b2a28] ring-2 ring-[#75daa8]/40 shrink-0 shadow-lg">
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
              <span
                className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-[#1a1918] ${
                  isTargetRadarVisible ? 'bg-[#75daa8]' : 'bg-[#88948b]'
                }`}
                title={isTargetRadarVisible ? 'Social Radar Active' : 'Incognito'}
              />
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 id="profile-title" className="font-['Syne',sans-serif] text-lg font-bold text-[#e6e1df] truncate">
                  {name}
                </h3>
                {incomingRequest?.fromPatron.loyaltyTier && (
                  <span className="px-2 py-0.5 rounded-full bg-[#ffb780]/20 text-[#ffb780] font-['Space_Grotesk',sans-serif] text-[9px] font-bold">
                    {incomingRequest.fromPatron.loyaltyTier}
                  </span>
                )}
              </div>

              <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#75daa8] flex items-center gap-1 mt-0.5 font-medium">
                <span className="material-symbols-outlined text-xs">location_on</span>
                <span>{table}</span>
              </p>

              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#75daa8]/15 text-[#75daa8] text-[10px] font-['Space_Grotesk',sans-serif] font-bold">
                  {affinity}% Vibe Match
                </span>
                <span className="text-[11px] text-[#bdcac0] font-['Space_Grotesk',sans-serif]">
                  {patron?.timeSeated || 'Present in café'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Current Activity & Drink */}
          <div className="p-3.5 rounded-2xl bg-[#211f1e] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-['Space_Grotesk',sans-serif]">
              <span className="text-[#bdcac0] uppercase text-[10px] tracking-wider">Currently In Café</span>
              <span className="text-[#75daa8] font-bold">Live Status</span>
            </div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#e6e1df] font-semibold">
              {activity}
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-white/5 text-xs text-[#bdcac0]">
              <span className="material-symbols-outlined text-sm text-[#ffb780]">local_cafe</span>
              <span>Drinking: <strong className="text-[#e6e1df]">{drink}</strong></span>
            </div>
          </div>

          {/* Bio & Backstory */}
          <div className="space-y-1.5">
            <h4 className="font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-wider text-[#bdcac0] font-bold">
              About & Interests
            </h4>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#d1c4b9] leading-relaxed">
              {bio}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-[#0f0e0d] text-[10px] text-[#75daa8] font-['Space_Grotesk',sans-serif] border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* SCENARIO 1: INCOMING REQUEST VIEW */}
          {incomingRequest && incomingRequest.status === 'pending' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#253229] to-[#211f1e] border border-[#75daa8]/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-wider text-[#75daa8] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">mark_email_unread</span>
                  <span>Incoming Connection Request</span>
                </span>
                <span className="text-[10px] text-[#bdcac0] font-['Space_Grotesk',sans-serif]">
                  {incomingRequest.timestamp}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0f0e0d]/80 border border-white/5 space-y-1">
                <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#ffb780] font-bold">
                  Intent: {incomingRequest.intent}
                </p>
                {incomingRequest.message && (
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#e6e1df] italic leading-relaxed">
                    "{incomingRequest.message}"
                  </p>
                )}
              </div>

              {/* Action Buttons for Incoming Request */}
              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={() => onAcceptRequest(incomingRequest.id)}
                  className="flex-1 py-2.5 px-3 rounded-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Syne',sans-serif] text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-[#75daa8]/20"
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Accept Request</span>
                </button>
                <button
                  onClick={() => onRejectRequest(incomingRequest.id)}
                  className="py-2.5 px-4 rounded-full bg-[#2b2a28] hover:bg-[#363433] text-[#bdcac0] hover:text-[#ff8080] font-['Space_Grotesk',sans-serif] text-xs font-bold transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 2: ALREADY CONNECTED */}
          {isConnected && (
            <div className="p-4 rounded-2xl bg-[#1e2a22] border border-[#75daa8]/40 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#75daa8]">
                <span className="material-symbols-outlined text-base">handshake</span>
                <span className="font-['Syne',sans-serif] text-xs font-bold uppercase tracking-wider">
                  Connected at {table}
                </span>
              </div>
              <p className="text-xs text-[#d1c4b9]">
                You and {name} are connected in The Hearth! You can say hi or exchange a coffee note.
              </p>

              {chatNotes.length > 0 && (
                <div className="space-y-1.5 p-2 rounded-xl bg-[#0f0e0d]/70 max-h-28 overflow-y-auto">
                  {chatNotes.map((note, i) => (
                    <div key={i} className="text-xs p-1.5 rounded-lg bg-[#253229] text-[#e6e1df]">
                      <span className="text-[10px] text-[#75daa8] block">You sent:</span>
                      {note}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={activeChatNote}
                  onChange={(e) => setActiveChatNote(e.target.value)}
                  placeholder="Send a quick note or wave..."
                  className="flex-1 bg-[#0f0e0d] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e6e1df] focus:outline-none focus:border-[#75daa8]"
                />
                <button
                  onClick={handleSendQuickNote}
                  className="px-3 py-2 rounded-xl bg-[#75daa8] text-[#003823] text-xs font-bold font-['Space_Grotesk',sans-serif] shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 3: SENDING REQUEST - CHECK RADAR VISIBILITY */}
          {!incomingRequest && !isConnected && (
            <div className="space-y-3.5 pt-1">
              {/* Check if User's Radar is Hidden */}
              {!isCurrentUserRadarVisible ? (
                <div className="p-4 rounded-2xl bg-[#2b2520] border border-[#ffb780]/30 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#ffb780]">
                    <span className="material-symbols-outlined text-lg">visibility_off</span>
                    <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider">
                      Your Radar Is In Stealth Mode
                    </span>
                  </div>
                  <p className="text-xs text-[#d1c4b9] leading-relaxed">
                    Social Radar must be made visible on <strong>both ends</strong> to send and receive connection requests. Turn on your visibility so {name} can view your profile and table location.
                  </p>
                  <button
                    onClick={onToggleUserRadar}
                    className="w-full py-2.5 rounded-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Space_Grotesk',sans-serif] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span className="material-symbols-outlined text-sm">wifi_tethering</span>
                    <span>Turn On Social Radar & Connect</span>
                  </button>
                </div>
              ) : !isTargetRadarVisible ? (
                /* Target patron is in stealth mode */
                <div className="p-4 rounded-2xl bg-[#211f1e] border border-white/5 space-y-2 text-center">
                  <span className="material-symbols-outlined text-2xl text-[#bdcac0]">do_not_disturb_on</span>
                  <p className="font-['Syne',sans-serif] text-xs font-bold text-[#e6e1df]">
                    Patron in Stealth / Deep Focus
                  </p>
                  <p className="text-xs text-[#bdcac0]">
                    {name} has set their radar to Stealth mode and is not currently receiving new table requests.
                  </p>
                </div>
              ) : isPending ? (
                /* Request already sent */
                <div className="p-4 rounded-2xl bg-[#1e2a22] border border-[#75daa8]/30 text-center space-y-1.5 animate-fadeIn">
                  <div className="w-9 h-9 mx-auto rounded-full bg-[#75daa8]/20 flex items-center justify-center text-[#75daa8]">
                    <span className="material-symbols-outlined text-lg">done</span>
                  </div>
                  <p className="font-['Syne',sans-serif] text-xs font-bold text-[#e6e1df]">
                    Connection Request Sent to {name}
                  </p>
                  <p className="text-xs text-[#bdcac0]">
                    They will see your table profile and can accept or decline.
                  </p>
                </div>
              ) : (
                /* Both are visible! Can send request */
                <div className="space-y-3">
                  <div>
                    <label className="block font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-wider text-[#bdcac0] font-bold mb-1.5">
                      Select Connection Reason
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {intents.map((item) => {
                        const isChosen = selectedIntent === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedIntent(item.id)}
                            className={`p-2.5 rounded-xl text-left border transition-all ${
                              isChosen
                                ? 'bg-[#75daa8]/15 border-[#75daa8] text-[#75daa8]'
                                : 'bg-[#211f1e] border-white/5 text-[#bdcac0] hover:text-[#e6e1df]'
                            }`}
                          >
                            <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold block">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-[#bdcac0] block mt-0.5">
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-wider text-[#bdcac0] font-bold mb-1">
                      Personal Note / Icebreaker (Optional)
                    </label>
                    <input
                      type="text"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder={`Say hi or ask about ${tags[0] || 'coffee'}...`}
                      className="w-full bg-[#211f1e] border border-white/10 rounded-xl p-2.5 text-xs text-[#e6e1df] focus:outline-none focus:border-[#75daa8]"
                    />
                  </div>

                  <button
                    onClick={handleSend}
                    className="w-full py-3 px-4 rounded-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Syne',sans-serif] text-xs font-bold shadow-lg shadow-[#75daa8]/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>Send Request to {name}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
