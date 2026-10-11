import React from 'react';
import { ActiveTicket, StoreLocation } from '../types/cafe';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: ActiveTicket;
  currentStore: StoreLocation;
  onAdvanceTicketStep: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  ticket,
  currentStore,
  onAdvanceTicketStep,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#1d1b1a] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#211f1e]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#75daa8] text-2xl">local_cafe</span>
            <div>
              <h3 className="font-['Syne',sans-serif] text-lg font-bold text-[#e6e1df]">
                Live Order Tracker
              </h3>
              <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                Active Ticket #{ticket.ticketNumber} • {currentStore.name}
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

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Estimated Time Big Banner */}
          <div className="p-4 rounded-2xl bg-[#2b2a28]/90 border border-[#75daa8]/20 flex items-center justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#75daa8]/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-center gap-1.5 text-[#75daa8] font-['Space_Grotesk',sans-serif] text-xs uppercase tracking-wider font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-[#75daa8] animate-pulse" />
                <span>{ticket.step === 3 ? 'Ready for Pickup' : 'In Preparation'}</span>
              </div>
              <h2 className="font-['Syne',sans-serif] text-3xl font-extrabold text-[#e6e1df]">
                {ticket.step === 3 ? 'AT BAR COUNTER' : ticket.estimatedWait}
              </h2>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0] mt-1">
                {ticket.statusDescription}
              </p>
            </div>
            <div className="text-right">
              <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0] block">
                Pickup Spot
              </span>
              <span className="font-['Space_Grotesk',sans-serif] text-sm text-[#92f7c3] font-bold">
                Counter 1
              </span>
            </div>
          </div>

          {/* 3-Step Live Progress Tracker */}
          <div className="p-4 rounded-2xl bg-[#211f1e] space-y-4">
            <div className="flex items-center justify-between font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
              <span className="font-bold text-[#e6e1df]">Order Progress</span>
              <span className="text-[#75daa8]">Step {ticket.step} of {ticket.totalSteps}</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {/* Step 1 */}
              <div className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    ticket.step >= 1 ? 'bg-[#75daa8] text-[#003823]' : 'bg-[#363433] text-[#bdcac0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs font-bold">check</span>
                </div>
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#e6e1df]">
                    Ticket Received & Queued
                  </h4>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0]">
                    Routed to {currentStore.name} Espresso Bar
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    ticket.step >= 2
                      ? ticket.step === 2
                        ? 'bg-[#75daa8] text-[#003823] ring-4 ring-[#75daa8]/20 animate-pulse'
                        : 'bg-[#75daa8] text-[#003823]'
                      : 'bg-[#363433] text-[#bdcac0]'
                  }`}
                >
                  {ticket.step > 2 ? (
                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                  ) : (
                    '2'
                  )}
                </div>
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#e6e1df]">
                    Crafting at Bar ({ticket.baristaName})
                  </h4>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0]">
                    {ticket.statusDescription}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    ticket.step === 3
                      ? 'bg-[#75daa8] text-[#003823] ring-4 ring-[#75daa8]/30 animate-pulse'
                      : 'bg-[#363433] text-[#bdcac0]'
                  }`}
                >
                  3
                </div>
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#e6e1df]">
                    Ready at Hand-off Counter
                  </h4>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0]">
                    Show your barcode or Ticket #{ticket.ticketNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode & Pickup Pass */}
          <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-white/5 text-center space-y-3">
            <span className="font-['Space_Grotesk',sans-serif] text-xs tracking-widest text-[#bdcac0] uppercase">
              Digital Barista Pass
            </span>
            <div className="flex justify-center items-center gap-1.5 py-1">
              {/* Simulated barcode stripes */}
              {[4, 2, 8, 3, 6, 2, 9, 3, 7, 2, 4, 8, 3, 5, 2, 6, 8, 3, 7, 4, 2].map((w, i) => (
                <div
                  key={i}
                  className="bg-[#e6e1df] h-12 rounded-sm"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <p className="font-['Space_Grotesk',sans-serif] text-sm font-bold text-[#75daa8] tracking-widest">
              CB-TKT-{ticket.ticketNumber}-MERCER
            </p>
          </div>

          {/* Order Summary */}
          <div className="p-4 rounded-2xl bg-[#211f1e] space-y-2">
            <div className="flex justify-between text-xs text-[#bdcac0] font-['Space_Grotesk',sans-serif]">
              <span>Items in Ticket</span>
              <span>Paid: {ticket.totalAmount}</span>
            </div>
            {ticket.items.map((item, idx) => (
              <div key={idx} className="text-xs text-[#e6e1df] font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#75daa8]">done</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Barista Simulation Button */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onAdvanceTicketStep}
              className="flex-1 py-3 rounded-full bg-[#75daa8] text-[#003823] font-['Syne',sans-serif] text-sm font-bold hover:bg-[#92f7c3] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#75daa8]/20"
            >
              <span className="material-symbols-outlined text-base">forward</span>
              <span>
                {ticket.step === 1
                  ? 'Simulate: Start Steaming'
                  : ticket.step === 2
                  ? 'Simulate: Mark Order Ready'
                  : 'Order Complete! Reset Demo'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
