import React, { useState } from 'react';
import { ASSETS, INITIAL_PARSED_ORDER } from '../../data/mockData';
import { ParsedDrinkOrder, StoreLocation } from '../../types/cafe';

interface AiOrderScreenProps {
  currentStore: StoreLocation;
  onSwitchStore: (storeId: string) => void;
  onPlaceOrder: (order: ParsedDrinkOrder, withPastry: boolean) => void;
}

export const AiOrderScreen: React.FC<AiOrderScreenProps> = ({
  currentStore,
  onSwitchStore,
  onPlaceOrder,
}) => {
  const [showProximityAlert, setShowProximityAlert] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Active parsed order
  const [parsedOrder, setParsedOrder] = useState<ParsedDrinkOrder>(INITIAL_PARSED_ORDER);
  const [pastryAdded, setPastryAdded] = useState(false);

  // User prompt displayed in the chat
  const [userPromptText, setUserPromptText] = useState(
    'Can I get an iced ceremonial matcha with oat milk, light ice, and a splash of lavender syrup?'
  );

  const calculateTotal = () => {
    const baseNumber = parseFloat(parsedOrder.totalPrice.replace('$', '')) || 7.75;
    const pastryNumber = pastryAdded ? 4.5 : 0;
    return `$${(baseNumber + pastryNumber).toFixed(2)}`;
  };

  const handleAudioToggle = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(parsedOrder.aiResponse);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleQuickPill = (text: string) => {
    let prompt = '';
    if (text === 'My Usual') {
      prompt = 'Give me my usual: iced ceremonial matcha with Califia oat milk and lavender';
    } else if (text === 'Surprise Me') {
      prompt = 'Surprise me with a specialty citrus cold drip or refreshing signature brew';
    } else if (text === 'Low Caffeine Today') {
      prompt = 'I want something botanical and low caffeine with floral notes';
    } else {
      prompt = 'Suggest a slow pourover paired with an artisanal pastry';
    }
    setUserPromptText(prompt);
    executeAiParse(prompt);
  };

  const executeAiParse = async (promptQuery: string) => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/parse-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        setParsedOrder({
          ...INITIAL_PARSED_ORDER,
          ...data,
          image: data.image || ASSETS.matchaGlass,
          components: data.components || INITIAL_PARSED_ORDER.components,
          pairing: data.pairing || INITIAL_PARSED_ORDER.pairing,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setUserPromptText(inputText);
    executeAiParse(inputText);
    setInputText('');
  };

  const handleMicToggle = () => {
    setIsListening(!isListening);
    // Simulate speech recognition
    if (!isListening) {
      const speechSamples = [
        'Can I get an iced flat white with oat milk and half pump vanilla?',
        'I would love a cold drip tonic with yuzu and sparkling water',
        'Single-origin Ethiopian Gesha pour over, served neat in ceramic',
      ];
      const sample = speechSamples[Math.floor(Math.random() * speechSamples.length)];
      setTimeout(() => {
        setIsListening(false);
        setUserPromptText(sample);
        executeAiParse(sample);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 space-y-4 pb-12 max-w-md mx-auto animate-fadeIn">
      {/* 1. Smart Proximity Warning Toast */}
      {showProximityAlert && (
        <aside
          className="w-full relative overflow-hidden rounded-2xl p-4 bg-[#93000a]/20 text-[#e6e1df] shadow-xl backdrop-blur-xl border border-[#ffb4ab]/30 transition-all duration-300"
          id="proximity-toast"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#93000a]/60 text-[#ffb4ab] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] uppercase tracking-wider text-[#ffb4ab] font-bold">
                  Proximity Alert
                </span>
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                  1.4 mi away
                </span>
              </div>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#e6e1df] leading-tight">
                You are ordering from <span className="font-semibold text-[#e6e1df]">{currentStore.name}</span>. Did you mean to pick up at{' '}
                <span className="font-bold text-[#75daa8]">Downtown Soho</span>?
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    onSwitchStore('downtown-soho');
                    setShowProximityAlert(false);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#ffb4ab] text-[#690005] font-['Space_Grotesk',sans-serif] text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">swap_horiz</span>
                  <span>Switch to Soho</span>
                </button>
                <button
                  onClick={() => setShowProximityAlert(false)}
                  className="px-3 py-1.5 rounded-full bg-[#2b2a28]/60 text-[#bdcac0] hover:text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-xs transition-all"
                >
                  Keep Mercer
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Smart Model Indicator Banner */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-full bg-[#1d1b1a]/80 backdrop-blur-md border border-white/5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#75daa8] animate-pulse" />
          <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] tracking-wide uppercase font-semibold">
            Craft & Bloom Smart Barista Engine
          </span>
        </div>
        <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] flex items-center gap-1">
          <span className="material-symbols-outlined text-xs text-[#75daa8]">bolt</span>
          Ultra-Low Latency
        </span>
      </div>

      {/* 2. AI Chat Stream & Voice Waveform */}
      <section className="flex flex-col space-y-4">
        {/* User Bubble */}
        <div className="flex justify-end items-end gap-2 pl-6">
          <div className="rounded-2xl rounded-br-none p-3.5 bg-[#50483f]/80 text-[#e6e1df] shadow-md backdrop-blur-md max-w-full border border-white/5">
            <div className="flex items-center gap-1 text-[#ffb780] font-['Space_Grotesk',sans-serif] text-[10px] mb-1 font-semibold">
              <span className="material-symbols-outlined text-xs">mic</span>
              <span>Voice Prompt</span>
            </div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#e6e1df] leading-snug">
              "{userPromptText}"
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#2b2a28] flex items-center justify-center shrink-0 text-[#75daa8] ring-1 ring-white/10">
            <span className="material-symbols-outlined text-base">person</span>
          </div>
        </div>

        {/* Assistant Stream with Waveform */}
        <div className="flex items-start gap-2 pr-2">
          <div className="w-8 h-8 rounded-full bg-[#75daa8]/20 text-[#75daa8] flex items-center justify-center shrink-0 mt-1 shadow-sm ring-1 ring-[#75daa8]/30">
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="rounded-2xl rounded-tl-none p-4 bg-[#211f1e]/90 text-[#e6e1df] shadow-lg backdrop-blur-md border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8] tracking-wider uppercase flex items-center gap-1 font-bold">
                  Craft & Bloom Master Barista
                </span>
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0]">
                  {isLoadingAi ? 'Crafting Formula...' : 'Live Stream'}
                </span>
              </div>

              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#e6e1df] mb-3 leading-relaxed">
                {isLoadingAi ? 'Crafting custom espresso & botanicals formula...' : parsedOrder.aiResponse}
              </p>

              {/* Voice Waveform Visualizer */}
              <div className="w-full bg-[#0f0e0d]/90 rounded-full px-3.5 py-2 flex items-center justify-between gap-2 shadow-inner border border-white/5">
                <button
                  onClick={handleAudioToggle}
                  className="w-7 h-7 rounded-full bg-[#75daa8] text-[#003823] flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform"
                  aria-label="Toggle audio playback"
                >
                  <span className="material-symbols-outlined text-base">
                    {isPlayingAudio ? 'volume_up' : 'volume_off'}
                  </span>
                </button>

                <div className="flex-1 flex items-center justify-center gap-1 h-6 px-1 overflow-hidden">
                  {[2, 4, 5, 3, 6, 4, 2, 5, 3, 6, 4, 2].map((height, idx) => (
                    <span
                      key={idx}
                      className={`w-1 rounded-full ${
                        isPlayingAudio ? 'bg-[#75daa8] animate-pulse' : 'bg-[#75daa8]/30'
                      }`}
                      style={{
                        height: `${height * 3.5}px`,
                        animationDelay: `${idx * 60}ms`,
                      }}
                    />
                  ))}
                </div>

                <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#75daa8] tracking-tight font-bold">
                  0:04
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI Real-time Drink Parser Card */}
      <section className="rounded-2xl p-4 bg-[#2b2a28]/90 text-[#e6e1df] shadow-xl backdrop-blur-xl space-y-3.5 border border-white/5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0f0e0d] shrink-0 shadow-md relative">
              <img
                className="w-full h-full object-cover"
                alt={parsedOrder.name}
                src={parsedOrder.image || ASSETS.matchaGlass}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] px-2 py-0.5 rounded-full bg-[#75daa8]/15 text-[#75daa8] font-bold">
                  Artisan Custom Formula
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#75daa8] animate-ping" />
              </div>
              <h2 className="font-['Syne',sans-serif] text-lg font-bold text-[#e6e1df] truncate mt-0.5">
                {parsedOrder.name}
              </h2>
              <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] truncate">
                {parsedOrder.origin}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="font-['Syne',sans-serif] text-xl font-bold text-[#75daa8]">
              {parsedOrder.totalPrice}
            </div>
            <div className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] flex items-center justify-end gap-0.5">
              <span className="material-symbols-outlined text-xs text-[#ffb780]">timer</span>
              <span>{parsedOrder.prepTime}</span>
            </div>
          </div>
        </div>

        {/* Parsed Ingredients Breakdown */}
        <div className="space-y-1 rounded-xl bg-[#0f0e0d]/80 p-2.5 shadow-inner border border-white/5">
          {parsedOrder.components.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-1 px-1.5 text-xs font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-[#211f1e] flex items-center justify-center text-[#75daa8] text-xs shrink-0">
                  <span className="material-symbols-outlined text-xs">{item.icon}</span>
                </span>
                <span className="text-[#e6e1df] truncate">
                  <strong className="text-[#bdcac0] font-normal">{item.label}: </strong>
                  {item.detail}
                </span>
              </div>
              <span
                className={`font-['Space_Grotesk',sans-serif] text-[11px] shrink-0 font-medium ml-2 ${
                  item.price === 'Included' ? 'text-[#75daa8]' : 'text-[#bdcac0]'
                }`}
              >
                {item.price}
              </span>
            </div>
          ))}
        </div>

        {/* Suggested Pairing Micro Tile */}
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#211f1e]/80 border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#0f0e0d] shrink-0">
              <img
                className="w-full h-full object-cover"
                alt={parsedOrder.pairing.name}
                src={parsedOrder.pairing.image || ASSETS.yuzuCroissantSquare}
              />
            </div>
            <div className="min-w-0">
              <div className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#ffb780] flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-xs">star</span>
                AI Recommended Pairing
              </div>
              <div className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#e6e1df] font-semibold truncate">
                {parsedOrder.pairing.name}
              </div>
            </div>
          </div>

          <button
            onClick={() => setPastryAdded(!pastryAdded)}
            className={`px-3 py-1.5 rounded-full font-['Space_Grotesk',sans-serif] text-xs shrink-0 transition-all flex items-center gap-1 ${
              pastryAdded
                ? 'bg-[#75daa8] text-[#003823] font-bold shadow-md'
                : 'bg-[#363433] hover:bg-[#75daa8] hover:text-[#003823] text-[#e6e1df]'
            }`}
          >
            <span className="material-symbols-outlined text-xs">
              {pastryAdded ? 'check' : 'add'}
            </span>
            <span>{pastryAdded ? 'Added' : '+ ' + parsedOrder.pairing.price}</span>
          </button>
        </div>
      </section>

      {/* 4. Quick Prompt Pills */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#bdcac0] uppercase tracking-wider">
            Tap to Speak Quick Inquiries
          </span>
          <span className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#75daa8]">
            Barista Presets
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => handleQuickPill('My Usual')}
            className="shrink-0 px-3.5 py-2 rounded-full bg-[#2b2a28]/80 hover:bg-[#75daa8] hover:text-[#003823] text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95 border border-white/5"
          >
            <span className="material-symbols-outlined text-sm text-[#75daa8]">favorite</span>
            <span>My Usual</span>
          </button>

          <button
            onClick={() => handleQuickPill('Surprise Me')}
            className="shrink-0 px-3.5 py-2 rounded-full bg-[#2b2a28]/80 hover:bg-[#75daa8] hover:text-[#003823] text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95 border border-white/5"
          >
            <span className="material-symbols-outlined text-sm text-[#ffb780]">casino</span>
            <span>Surprise Me</span>
          </button>

          <button
            onClick={() => handleQuickPill('Low Caffeine Today')}
            className="shrink-0 px-3.5 py-2 rounded-full bg-[#2b2a28]/80 hover:bg-[#75daa8] hover:text-[#003823] text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95 border border-white/5"
          >
            <span className="material-symbols-outlined text-sm text-[#bdcac0]">bedtime</span>
            <span>Low Caffeine Today</span>
          </button>

          <button
            onClick={() => handleQuickPill('Pastry Pairing')}
            className="shrink-0 px-3.5 py-2 rounded-full bg-[#2b2a28]/80 hover:bg-[#75daa8] hover:text-[#003823] text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95 border border-white/5"
          >
            <span className="material-symbols-outlined text-sm text-[#ffb780]">bakery_dining</span>
            <span>Pastry Pairing</span>
          </button>
        </div>
      </section>

      {/* 5. Bottom Interaction Area */}
      <section className="space-y-3 pt-1">
        <form onSubmit={handleFormSubmit} className="relative flex items-center w-full">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? 'Listening to voice stream...' : 'Type or speak your customized order...'}
            className="w-full h-12 pl-4 pr-12 rounded-full bg-[#2b2a28] text-[#e6e1df] placeholder:text-[#88948b] font-['Plus_Jakarta_Sans',sans-serif] text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-[#75daa8]/50 border border-white/10 transition-all"
          />
          <button
            type="button"
            onClick={handleMicToggle}
            aria-label="Hold to speak with Barista"
            className={`absolute right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform ${
              isListening ? 'bg-[#ffb780] text-[#4e2600] animate-bounce' : 'bg-[#75daa8] text-[#003823]'
            }`}
          >
            <span className="material-symbols-outlined text-xl">mic</span>
          </button>
        </form>

        {/* Review & Place Order Primary CTA */}
        <button
          onClick={() => onPlaceOrder(parsedOrder, pastryAdded)}
          className="w-full h-12 rounded-full bg-[#75daa8] text-[#003823] font-['Syne',sans-serif] text-base font-bold flex items-center justify-between px-6 shadow-xl hover:bg-[#92f7c3] active:scale-[0.98] transition-all shadow-[#75daa8]/20"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
            <span>Review & Place Order</span>
          </div>
          <span className="font-['Syne',sans-serif] text-base font-extrabold">{calculateTotal()}</span>
        </button>
      </section>
    </div>
  );
};
