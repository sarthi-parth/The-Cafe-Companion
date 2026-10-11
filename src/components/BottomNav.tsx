import React from 'react';
import { ScreenTab } from '../types/cafe';

interface BottomNavProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: ScreenTab; label: string; icon: string }[] = [
    { id: 'discover', label: 'Discover', icon: 'dashboard' },
    { id: 'ai-order', label: 'AI Order', icon: 'mic' },
    { id: 'community', label: 'Community', icon: 'forum' },
    { id: 'staff-hub', label: 'Staff Hub', icon: 'table_restaurant' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#0f0e0d]/90 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.4)] border-t border-white/5">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] px-2 transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-[#75daa8] font-bold scale-105'
                  : 'text-[#bdcac0] hover:text-[#e6e1df]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-2xl transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="font-['Space_Grotesk',sans-serif] text-[11px] tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
