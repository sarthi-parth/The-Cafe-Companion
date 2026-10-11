import React from 'react';
import { ActiveTicket } from '../types/cafe';

interface FloatingTrackerProps {
  ticket: ActiveTicket;
  onOpen: () => void;
}

export const FloatingTracker: React.FC<FloatingTrackerProps> = ({ ticket, onOpen }) => {
  return (
    <aside className="fixed bottom-20 right-4 z-40 pb-safe pointer-events-auto">
      <button
        onClick={onOpen}
        className="flex items-center gap-2 pl-4 pr-3.5 h-11 rounded-full bg-[#2b2a28]/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)] text-[#e6e1df] font-['Space_Grotesk',sans-serif] text-[12px] font-medium border border-white/10 hover:border-[#75daa8]/40 hover:bg-[#363433] transition-all group active:scale-95"
        aria-label="View Active Order Tracker"
      >
        <span className="w-2 h-2 rounded-full bg-[#75daa8] animate-ping" />
        <span className="material-symbols-outlined text-lg text-[#75daa8]">local_cafe</span>
        <span className="font-semibold text-[#e6e1df]">Prep {ticket.estimatedWait.replace('~', '')}</span>
        <span className="material-symbols-outlined text-xs text-[#bdcac0] group-hover:translate-x-0.5 transition-transform">
          arrow_forward_ios
        </span>
      </button>
    </aside>
  );
};
