import React, { useState } from 'react';
import { ActiveAppView } from '../../types';
import { store } from '../../services/store';
import { Shield, Truck, User, RotateCcw, ChevronDown, ChevronUp, Bell, CheckCircle2 } from 'lucide-react';

interface ViewSwitcherProps {
  currentView: ActiveAppView;
  onViewChange: (view: ActiveAppView) => void;
  selectedTruckId: string;
  onSelectTruckId: (truckId: string) => void;
  onOpenTrackId?: (id: string) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentView,
  onViewChange,
  selectedTruckId,
  onSelectTruckId,
  onOpenTrackId,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const requests = store.getRequests();
  const pendingCallsCount = requests.filter((r) => r.status === 'pending_verification').length;
  const activeJobsCount = requests.filter(
    (r) => ['verified_approved', 'driver_accepted', 'en_route', 'arrived_pickup', 'in_transit'].includes(r.status)
  ).length;

  const handleReset = () => {
    if (window.confirm('Reset all requests, trucks, and reviews back to initial seed data?')) {
      store.resetToDemo();
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-auto">
      <div className="bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-2xl p-2 sm:p-3 text-white transition-all duration-300">
        
        {/* Switcher Header */}
        <div className="flex items-center justify-between gap-2 px-1 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Role Switcher (3-in-1 View)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {pendingCallsCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full animate-bounce">
                <Bell className="w-2.5 h-2.5" />
                {pendingCallsCount} Call Pending
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition"
              title={collapsed ? "Expand Controls" : "Collapse Controls"}
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* View Switch Buttons */}
        {!collapsed && (
          <div className="pt-2 space-y-2">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {/* Customer View Button */}
              <button
                onClick={() => onViewChange('customer')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  currentView === 'customer'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 mb-1" />
                <span>Customer</span>
                <span className="text-[10px] text-slate-400 font-normal">Public View</span>
              </button>

              {/* Owner View Button */}
              <button
                onClick={() => onViewChange('owner')}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  currentView === 'owner'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-glow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {pendingCallsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                    {pendingCallsCount}
                  </span>
                )}
                <Shield className="w-4 h-4 mb-1" />
                <span>Owner</span>
                <span className="text-[10px] text-slate-400 font-normal">PIN: 1234</span>
              </button>

              {/* Driver View Button */}
              <button
                onClick={() => onViewChange('driver')}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  currentView === 'driver'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-glow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {activeJobsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cyan-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                    {activeJobsCount}
                  </span>
                )}
                <Truck className="w-4 h-4 mb-1" />
                <span>Driver</span>
                <span className="text-[10px] text-slate-400 font-normal">Mobile Console</span>
              </button>
            </div>

            {/* Sub-selector for Driver View */}
            {currentView === 'driver' && (
              <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] font-medium">Logged in Truck:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onSelectTruckId('TRUCK-01')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedTruckId === 'TRUCK-01'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    Truck #01 (Rajesh)
                  </button>
                  <button
                    onClick={() => onSelectTruckId('TRUCK-02')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedTruckId === 'TRUCK-02'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    Truck #02 (Vikram)
                  </button>
                </div>
              </div>
            )}

            {/* Quick Demo Shortcuts */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>Demo IDs:</span>
                <button
                  onClick={() => onOpenTrackId?.('VT-8492')}
                  className="text-cyan-400 hover:underline font-mono"
                  title="Awaiting Verification Call"
                >
                  VT-8492
                </button>
                <span>|</span>
                <button
                  onClick={() => onOpenTrackId?.('VT-3108')}
                  className="text-emerald-400 hover:underline font-mono"
                  title="Approved & Driver Active"
                >
                  VT-3108
                </button>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition"
                title="Reset to fresh demo seed"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Seed</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
