import React, { useState } from 'react';
import { WebsiteLayoutId } from '../../types';
import { Layout, Smartphone, Crown, AlertTriangle, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface LayoutSwitcherProps {
  currentLayout: WebsiteLayoutId;
  onSelectLayout: (layout: WebsiteLayoutId) => void;
}

export const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({
  currentLayout,
  onSelectLayout
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const layouts: {
    id: WebsiteLayoutId;
    label: string;
    sub: string;
    badge: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      id: 'classic',
      label: '1. Classic Clean',
      sub: 'Comprehensive AAA / Daylight Map',
      badge: 'Standard',
      icon: Layout,
      color: 'bg-sky-600'
    },
    {
      id: 'modern-app',
      label: '2. Modern App',
      sub: 'Uber-Style High-Conversion & Radar',
      badge: 'Fast Dispatch',
      icon: Smartphone,
      color: 'bg-indigo-600'
    },
    {
      id: 'auto-club',
      label: '3. Premier Auto Club',
      sub: 'Executive Navy & Gold Heritage',
      badge: 'Luxury / Prestige',
      icon: Crown,
      color: 'bg-amber-600'
    },
    {
      id: 'emergency-sos',
      label: '4. Highway SOS',
      sub: 'High-Visibility Emergency Command',
      badge: 'Rapid Response',
      icon: AlertTriangle,
      color: 'bg-orange-600'
    }
  ];

  return (
    <div className="sticky top-0 z-[9999] bg-slate-900/95 backdrop-blur-md border-b-2 border-sky-500/50 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-2">
          
          {/* Header Title with Active Layout Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
                UI Layout Switcher
              </span>
              <span className="hidden sm:inline text-[11px] text-slate-400">
                — Pick &amp; Test 4 Website Styles:
              </span>
            </div>
          </div>

          {/* Minimize / Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition"
            title={isCollapsed ? "Expand Layout Switcher" : "Minimize Layout Switcher"}
          >
            <span className="font-medium">{isCollapsed ? "Change UI" : "Minimize"}</span>
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 4 Layout Selection Pills */}
        {!isCollapsed && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-2 pb-1">
            {layouts.map((l) => {
              const Icon = l.icon;
              const isSelected = currentLayout === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => onSelectLayout(l.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-sky-400 ring-2 ring-sky-500 shadow-md text-white'
                      : 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? l.color + ' text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">{l.label}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      )}
                    </div>
                    <span className="block text-[10px] text-slate-400 truncate">{l.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
