import React from 'react';
import { StoreLocation } from '../types/cafe';

interface StorePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: StoreLocation[];
  currentStore: StoreLocation;
  onSelectStore: (store: StoreLocation) => void;
}

export const StorePickerModal: React.FC<StorePickerModalProps> = ({
  isOpen,
  onClose,
  stores,
  currentStore,
  onSelectStore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#1d1b1a] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#211f1e]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#75daa8] text-xl">near_me</span>
            <div>
              <h3 className="font-['Syne',sans-serif] text-base font-bold text-[#e6e1df]">
                Select Café Location
              </h3>
              <p className="font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                Proximity guard automatically syncs wait times
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#bdcac0]"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-4 space-y-2.5 overflow-y-auto">
          {stores.map((store) => {
            const isSelected = store.id === currentStore.id;
            return (
              <button
                key={store.id}
                onClick={() => {
                  onSelectStore(store);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#52b788]/15 border-[#75daa8] shadow-md shadow-[#75daa8]/10'
                    : 'bg-[#211f1e] border-white/5 hover:bg-[#2b2a28] hover:border-white/10'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#e6e1df] truncate">
                      {store.name}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full bg-[#75daa8] text-[#003823] font-['Space_Grotesk',sans-serif] text-[10px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#bdcac0] mt-0.5 truncate">
                    {store.address}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 font-['Space_Grotesk',sans-serif] text-xs text-[#bdcac0]">
                    <span className="text-[#75daa8] font-medium">{store.distance} away</span>
                    <span>•</span>
                    <span>{store.status}</span>
                    <span>•</span>
                    <span className="text-[#ffb780]">Pickup: {store.prepTime}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`material-symbols-outlined text-xl ${
                      isSelected ? 'text-[#75daa8]' : 'text-[#88948b]'
                    }`}
                  >
                    {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
