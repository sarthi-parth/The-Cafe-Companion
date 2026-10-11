import React, { useState } from 'react';
import { CurrentUserProfile, SeatReservation } from '../types/cafe';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  presenceVisible: boolean;
  onTogglePresence: () => void;
  userProfile: CurrentUserProfile;
  onSaveProfile: (updatedProfile: CurrentUserProfile) => void;
  activeReservation?: SeatReservation | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  presenceVisible,
  onTogglePresence,
  userProfile,
  onSaveProfile,
  activeReservation,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'recipient-preview' | 'rewards'>('edit');

  // Form State
  const [name, setName] = useState(userProfile.name);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [headline, setHeadline] = useState(userProfile.headline);
  const [bio, setBio] = useState(userProfile.bio);
  const [tableNumber, setTableNumber] = useState(
    activeReservation ? `${activeReservation.tableName}` : userProfile.tableNumber
  );
  const [currentDrink, setCurrentDrink] = useState(userProfile.currentDrink);
  const [currentActivity, setCurrentActivity] = useState(userProfile.currentActivity);
  const [tags, setTags] = useState<string[]>(userProfile.tags);
  const [newTagInput, setNewTagInput] = useState('');
  const [contactOrSocial, setContactOrSocial] = useState(userProfile.contactOrSocial || '');
  const [testAcceptedState, setTestAcceptedState] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  ];

  const suggestedTags = [
    '#GenerativeDesign',
    '#TypeScript',
    '#SpecialtyCoffee',
    '#SciFi',
    '#Startups',
    '#DesignSystems',
    '#FilmPhotography',
    '#AcousticFocus',
    '#OpenSource',
    '#CreativeWriting',
  ];

  const bioTemplates = [
    {
      label: 'Engineer / Builder',
      text: 'Building full-stack canvas applications & AI tools at the corner booth. Love single-origin Geshas and clean code. Always open for a 10-minute coffee chat or debugging discussion.',
    },
    {
      label: 'Designer & Creative',
      text: 'Product designer exploring generative UI systems and typography. Sipping an iced ceremonial matcha. Happy to connect over design critique or creative book recommendations.',
    },
    {
      label: 'Researcher & Reader',
      text: 'Dwelling in speculative fiction & complex systems. Slow morning pour-over ritual. Say hi if you want to chat about sci-fi, architecture, or specialty coffee lots.',
    },
  ];

  const handleAddTag = (tagToAdd: string) => {
    const formatted = tagToAdd.startsWith('#') ? tagToAdd : `#${tagToAdd}`;
    if (!tags.includes(formatted) && formatted.length > 1) {
      setTags([...tags, formatted]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CurrentUserProfile = {
      ...userProfile,
      name,
      avatar,
      headline,
      bio,
      tableNumber,
      currentDrink,
      currentActivity,
      tags,
      contactOrSocial,
    };
    onSaveProfile(updated);
    onClose();
  };

  const syncActiveReservationTable = () => {
    if (activeReservation) {
      setTableNumber(`${activeReservation.tableName}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg bg-[#1a1918] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-settings-title"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#211f1e]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#75daa8]/15 border border-[#75daa8]/30 flex items-center justify-center text-[#75daa8]">
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </div>
            <div>
              <h3 id="profile-settings-title" className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
                My Café Companion Profile
              </h3>
              <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                Customize your bio & radar info for connection requests
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#bdcac0] hover:text-[#e6e1df] transition-colors"
            aria-label="Close profile modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 pt-3 pb-2 bg-[#211f1e]/40 border-b border-white/5 flex gap-2">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 rounded-full font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'edit'
                ? 'bg-[#75daa8] text-[#003823] shadow-md'
                : 'text-[#bdcac0] hover:text-[#e6e1df] bg-[#2b2a28]/60'
            }`}
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            <span>Edit Profile & Bio</span>
          </button>
          <button
            onClick={() => setActiveTab('recipient-preview')}
            className={`flex-1 py-2 rounded-full font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'recipient-preview'
                ? 'bg-[#75daa8] text-[#003823] shadow-md'
                : 'text-[#bdcac0] hover:text-[#e6e1df] bg-[#2b2a28]/60'
            }`}
          >
            <span className="material-symbols-outlined text-sm">preview</span>
            <span>Recipient View Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-2 px-3 rounded-full font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'rewards'
                ? 'bg-[#75daa8] text-[#003823] shadow-md'
                : 'text-[#bdcac0] hover:text-[#e6e1df] bg-[#2b2a28]/60'
            }`}
          >
            <span className="material-symbols-outlined text-sm">loyalty</span>
            <span>Rewards</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* TAB 1: EDIT PROFILE & BIO */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSave} className="space-y-4">
              {/* Avatar & Presence Status */}
              <div className="p-4 rounded-2xl bg-[#211f1e] border border-white/5 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#75daa8]/60 shadow-lg"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1a1918] ${
                        presenceVisible ? 'bg-[#75daa8]' : 'bg-[#88948b]'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold">
                        Social Radar Visibility
                      </span>
                      <button
                        type="button"
                        onClick={onTogglePresence}
                        className={`px-3 py-1 rounded-full font-['Space_Grotesk',sans-serif] text-xs font-bold transition-all flex items-center gap-1 ${
                          presenceVisible
                            ? 'bg-[#52b788]/20 text-[#75daa8] border border-[#75daa8]/40'
                            : 'bg-[#363433] text-[#bdcac0]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {presenceVisible ? 'wifi_tethering' : 'visibility_off'}
                        </span>
                        <span>{presenceVisible ? 'Visible on Radar' : 'Stealth Mode'}</span>
                      </button>
                    </div>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#bdcac0] mt-1">
                      {presenceVisible
                        ? 'Other patrons can see your table profile and accept your requests.'
                        : 'You are hidden. Switch to visible so recipients can see your bio.'}
                    </p>
                  </div>
                </div>

                {/* Avatar Preset Picker */}
                <div>
                  <span className="text-[10px] font-['Space_Grotesk',sans-serif] text-[#bdcac0] uppercase tracking-wider block mb-1.5">
                    Choose Avatar
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          avatar === preset ? 'border-[#75daa8] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Headline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold mb-1">
                    Your Name / Handle *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarthi P."
                    className="w-full bg-[#211f1e] border border-white/10 rounded-xl p-2.5 text-xs text-[#e6e1df] font-medium focus:outline-none focus:border-[#75daa8]"
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold mb-1">
                    Professional Headline / Role
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Full-Stack Engineer & AI Technologist"
                    className="w-full bg-[#211f1e] border border-white/10 rounded-xl p-2.5 text-xs text-[#e6e1df] focus:outline-none focus:border-[#75daa8]"
                  />
                </div>
              </div>

              {/* Seating & Current In-Café Vibe */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#211f1e]/80 border border-white/5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase font-bold">
                      Current Table
                    </label>
                    {activeReservation && (
                      <button
                        type="button"
                        onClick={syncActiveReservationTable}
                        className="text-[9px] text-[#75daa8] hover:underline"
                        title="Sync with your active seat booking"
                      >
                        Sync Booking
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Table 07 • Corner Booth"
                    className="w-full bg-[#141312] border border-white/10 rounded-lg p-2 text-xs text-[#e6e1df] focus:outline-none focus:border-[#75daa8]"
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase font-bold mb-1">
                    Current Drink
                  </label>
                  <input
                    type="text"
                    value={currentDrink}
                    onChange={(e) => setCurrentDrink(e.target.value)}
                    placeholder="Iced Ceremonial Matcha"
                    className="w-full bg-[#141312] border border-white/10 rounded-lg p-2 text-xs text-[#e6e1df] focus:outline-none focus:border-[#75daa8]"
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase font-bold mb-1">
                    Current Activity
                  </label>
                  <input
                    type="text"
                    value={currentActivity}
                    onChange={(e) => setCurrentActivity(e.target.value)}
                    placeholder="Coding interactive canvas"
                    className="w-full bg-[#141312] border border-white/10 rounded-lg p-2 text-xs text-[#e6e1df] focus:outline-none focus:border-[#75daa8]"
                  />
                </div>
              </div>

              {/* Bio & About Me */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold">
                    About Me & Bio * (Shown to recipients of your requests)
                  </label>
                  <span className="text-[10px] text-[#75daa8] font-['Space_Grotesk',sans-serif]">
                    {bio.length} characters
                  </span>
                </div>

                {/* Quick Bio Templates */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 mb-2 no-scrollbar">
                  <span className="text-[10px] text-[#88948b] shrink-0 pt-1 font-['Space_Grotesk',sans-serif]">
                    Templates:
                  </span>
                  {bioTemplates.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBio(t.text)}
                      className="px-2.5 py-0.5 rounded-full bg-[#2b2a28] hover:bg-[#363433] text-[10px] text-[#bdcac0] hover:text-[#75daa8] shrink-0 font-['Space_Grotesk',sans-serif] border border-white/5 transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <textarea
                  required
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share what you are working on, your favorite coffee tasting notes, and why you enjoy connecting at the cafe..."
                  className="w-full bg-[#211f1e] border border-white/10 rounded-xl p-3 text-xs text-[#e6e1df] leading-relaxed focus:outline-none focus:border-[#75daa8]"
                />
              </div>

              {/* Interest & Vibe Tags */}
              <div>
                <label className="block font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold mb-1.5">
                  Interest & Vibe Tags (Used for affinity match)
                </label>

                {/* Current Selected Tags */}
                <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-[#211f1e] border border-white/5 mb-2 min-h-11">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-[#0f0e0d] text-[#75daa8] text-xs font-['Space_Grotesk',sans-serif] flex items-center gap-1 border border-white/5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-[#ff8080] text-xs ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Tag Input & Suggestions */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newTagInput.trim()) handleAddTag(newTagInput.trim());
                      }
                    }}
                    placeholder="Type a new tag (e.g. #Robotics, #Architecture)..."
                    className="flex-1 bg-[#211f1e] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#e6e1df] focus:outline-none focus:border-[#75daa8]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTagInput.trim()) handleAddTag(newTagInput.trim());
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#2b2a28] hover:bg-[#363433] text-[#75daa8] text-xs font-bold font-['Space_Grotesk',sans-serif]"
                  >
                    + Add
                  </button>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-1">
                  {suggestedTags
                    .filter((st) => !tags.includes(st))
                    .slice(0, 6)
                    .map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleAddTag(st)}
                        className="px-2 py-0.5 rounded-full bg-[#141312] text-[10px] text-[#bdcac0] hover:text-[#75daa8] border border-white/5 font-['Space_Grotesk',sans-serif]"
                      >
                        + {st}
                      </button>
                    ))}
                </div>
              </div>

              {/* Social / Contact Link */}
              <div>
                <label className="block font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] font-semibold mb-1">
                  Contact or Social Handle (Optional)
                </label>
                <input
                  type="text"
                  value={contactOrSocial}
                  onChange={(e) => setContactOrSocial(e.target.value)}
                  placeholder="@sarthiparth • github.com/sarthi"
                  className="w-full bg-[#211f1e] border border-white/10 rounded-xl p-2.5 text-xs text-[#e6e1df] focus:outline-none focus:border-[#75daa8]"
                />
              </div>

              {/* Actions: Save & Preview */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('recipient-preview')}
                  className="px-4 py-3 rounded-full bg-[#2b2a28] hover:bg-[#363433] text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-xs font-bold transition-colors"
                >
                  Preview Recipient Card
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-full bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] font-['Syne',sans-serif] text-xs font-bold shadow-lg shadow-[#75daa8]/20 flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: LIVE RECIPIENT PREVIEW */}
          {activeTab === 'recipient-preview' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 rounded-xl bg-[#2b2520] border border-[#ffb780]/30 text-xs text-[#d1c4b9] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb780] text-base">visibility</span>
                <span>
                  <strong>Recipient View:</strong> This is the exact profile and invitation card that Maya, Liam, or other patrons see when you send a connection request.
                </span>
              </div>

              {/* Mock Incoming Request Card as seen by recipient */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#253229] to-[#1e1c1b] border border-[#75daa8]/40 shadow-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#75daa8]">
                    <span className="material-symbols-outlined text-base">person_add</span>
                    <span className="font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-wider">
                      Incoming Connection Request
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#75daa8]/20 text-[#75daa8] text-[9px] font-['Space_Grotesk',sans-serif] font-bold">
                    96% Vibe Match
                  </span>
                </div>

                {/* Profile Header */}
                <div className="flex items-start gap-3.5 pt-1">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#2b2a28] ring-2 ring-[#75daa8] shrink-0 shadow-lg">
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#75daa8] border-2 border-[#1a1918]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df] truncate">
                        {name}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded bg-[#ffb780]/20 text-[#ffb780] font-['Space_Grotesk',sans-serif] text-[9px] font-bold">
                        {userProfile.loyaltyTier}
                      </span>
                    </div>

                    <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#75daa8] font-medium mt-0.5">
                      {tableNumber}
                    </p>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0] truncate">
                      {headline}
                    </p>
                  </div>
                </div>

                {/* Bio Display */}
                <div className="p-3 rounded-xl bg-[#0f0e0d]/80 border border-white/5 space-y-1.5">
                  <span className="text-[10px] text-[#bdcac0] uppercase tracking-wider font-['Space_Grotesk',sans-serif] font-bold block">
                    Patron Bio
                  </span>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#e6e1df] leading-relaxed">
                    "{bio}"
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-[#bdcac0] border-t border-white/5">
                    <span>Drinking: <strong className="text-[#e6e1df]">{currentDrink}</strong></span>
                    <span>Activity: <strong className="text-[#e6e1df]">{currentActivity}</strong></span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-[#0f0e0d] text-[10px] text-[#75daa8] font-['Space_Grotesk',sans-serif]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Connection Reason Note */}
                <div className="p-2.5 rounded-xl bg-[#141312] border border-white/5 text-xs text-[#bdcac0]">
                  <span className="text-[#ffb780] font-bold block text-[10px]">Connection Intent:</span>
                  <span>☕ Coffee & Casual Chat • "Hey! Love your setup, mind if I ask about your project or say hi?"</span>
                </div>

                {/* Recipient Action Controls (Interactive simulation) */}
                <div className="space-y-2 pt-1 border-t border-white/10">
                  <span className="text-[10px] text-[#bdcac0] font-['Space_Grotesk',sans-serif] block text-center">
                    Simulate how the other person will respond:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTestAcceptedState(true)}
                      className={`flex-1 py-2.5 rounded-full font-['Syne',sans-serif] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        testAcceptedState === true
                          ? 'bg-[#52b788] text-[#003823]'
                          : 'bg-[#75daa8] hover:bg-[#92f7c3] text-[#003823] shadow-md'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>{testAcceptedState === true ? 'Accepted! Connected 🤝' : 'Recipient Accepts Request'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestAcceptedState(false)}
                      className="py-2.5 px-4 rounded-full bg-[#2b2a28] hover:bg-[#363433] text-[#bdcac0] hover:text-[#ff8080] font-['Space_Grotesk',sans-serif] text-xs font-semibold"
                    >
                      Decline
                    </button>
                  </div>

                  {testAcceptedState === true && (
                    <p className="text-center text-xs text-[#75daa8] animate-fadeIn font-medium">
                      ✓ Recipient saw your bio and accepted! Table sharing & chat unlocked at {tableNumber}.
                    </p>
                  )}
                  {testAcceptedState === false && (
                    <p className="text-center text-xs text-[#bdcac0] animate-fadeIn">
                      Recipient declined quietly without notification.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className="px-4 py-2 rounded-full bg-[#75daa8] text-[#003823] font-['Space_Grotesk',sans-serif] text-xs font-bold"
                >
                  Back to Editing
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REWARDS & FLAVOR FORMULA */}
          {activeTab === 'rewards' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Gold Roaster Badge */}
              <div className="p-4 rounded-2xl bg-[#211f1e] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#ffb780] uppercase tracking-wider font-bold">
                      Loyalty Tier
                    </span>
                    <h4 className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
                      {userProfile.loyaltyTier}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="font-['Syne',sans-serif] text-xl font-bold text-[#75daa8]">
                      {userProfile.points}
                    </span>
                    <span className="text-[10px] text-[#bdcac0] block font-['Space_Grotesk',sans-serif]">
                      Bloom Points
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#363433] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#75daa8] h-full rounded-full" style={{ width: '70%' }} />
                </div>
                <p className="text-xs text-[#bdcac0] font-['Space_Grotesk',sans-serif]">
                  80 points until next complimentary Gesha pour-over flight.
                </p>
              </div>

              {/* Barista Formula */}
              <div className="p-4 rounded-2xl bg-[#211f1e] border border-white/5 space-y-2.5">
                <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] uppercase tracking-wider block font-bold">
                  Saved Barista Formula
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#141312] border border-white/5">
                    <span className="text-[#88948b] block text-[10px]">Oat Milk Brand</span>
                    <span className="text-[#e6e1df] font-medium">Califia Farms Barista</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141312] border border-white/5">
                    <span className="text-[#88948b] block text-[10px]">Ice Ratio</span>
                    <span className="text-[#e6e1df] font-medium">Light Ice (70/30)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141312] border border-white/5">
                    <span className="text-[#88948b] block text-[10px]">Roast Preference</span>
                    <span className="text-[#e6e1df] font-medium">Nordic Light / Floral</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141312] border border-white/5">
                    <span className="text-[#88948b] block text-[10px]">Sweetener</span>
                    <span className="text-[#e6e1df] font-medium">Lavender Half-Pump</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
