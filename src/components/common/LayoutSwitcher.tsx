import React from 'react';
import { WebsiteLayoutId } from '../../types';

interface LayoutSwitcherProps {
  currentLayout: WebsiteLayoutId;
  onSelectLayout: (layout: WebsiteLayoutId) => void;
}

export const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({
  currentLayout,
  onSelectLayout
}) => {
  const layouts: { id: WebsiteLayoutId; label: string }[] = [
    { id: 'classic', label: 'UI 1' },
    { id: 'modern-app', label: 'UI 2' },
    { id: 'auto-club', label: 'UI 3' },
    { id: 'emergency-sos', label: 'UI 4' }
  ];

  return (
    <div className="sticky top-0 z-[9999] bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md py-1.5 px-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            UI Switcher:
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {layouts.map((l) => {
            const isSelected = currentLayout === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onSelectLayout(l.id)}
                className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-400/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
