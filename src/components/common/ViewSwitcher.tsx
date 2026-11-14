import React, { useState } from 'react';
import { ActiveAppView } from '../../types';
import { store } from '../../services/store';
import { Shield, Truck, User, RotateCcw, ChevronDown, ChevronUp, Bell } from 'lucide-react';

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
      <div className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-xl shadow-lg p-2.5 sm:p-3 text-slate-800 transition-all">
        
        {/* Switcher Header */}
        <div className="flex items-center justify-between gap-2 px-1 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Interface Mode
            </span>
          </div>

          <div className="flex items-center gap-2">
            {pendingCallsCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                <Bell className="w-2.5 h-2.5" />
                {pendingCallsCount} Call Pending
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition"
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* View Switch Buttons */}
        {!collapsed && (
          <div className="pt-2 space-y-2">
            <div className="grid grid-cols-3 gap-1.5">
              {/* Customer View Button */}
              <button
                onClick={() => onViewChange('customer')}
                className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-semibold transition border ${
                  currentView === 'customer'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4 mb-0.5" />
                <span>Customer</span>
                <span className={`text-[9px] font-normal ${currentView === 'customer' ? 'text-slate-300' : 'text-slate-400'}`}>Public View</span>
              </button>

              {/* Owner View Button */}
              <button
                onClick={() => onViewChange('owner')}
                className={`relative flex flex-col items-center justify-center p-2 rounded-lg text-xs font-semibold transition border ${
                  currentView === 'owner'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pendingCallsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {pendingCallsCount}
                  </span>
                )}
                <Shield className="w-4 h-4 mb-0.5" />
                <span>Owner</span>
                <span className={`text-[9px] font-normal ${currentView === 'owner' ? 'text-slate-300' : 'text-slate-400'}`}>PIN: 1234</span>
              </button>

              {/* Driver View Button */}
              <button
                onClick={() => onViewChange('driver')}
                className={`relative flex flex-col items-center justify-center p-2 rounded-lg text-xs font-semibold transition border ${
                  currentView === 'driver'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {activeJobsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sky-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {activeJobsCount}
                  </span>
                )}
                <Truck className="w-4 h-4 mb-0.5" />
                <span>Driver</span>
                <span className={`text-[9px] font-normal ${currentView === 'driver' ? 'text-slate-300' : 'text-slate-400'}`}>Console</span>
              </button>
            </div>

            {/* Sub-selector for Driver View */}
            {currentView === 'driver' && (
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Logged in as:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onSelectTruckId('TRUCK-01')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      selectedTruckId === 'TRUCK-01'
                        ? 'bg-slate-800 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Truck #01
                  </button>
                  <button
                    onClick={() => onSelectTruckId('TRUCK-02')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      selectedTruckId === 'TRUCK-02'
                        ? 'bg-slate-800 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Truck #02
                  </button>
                </div>
              </div>
            )}

            {/* Quick Demo Shortcuts */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span>Demo IDs:</span>
                <button
                  onClick={() => onOpenTrackId?.('VT-8492')}
                  className="text-sky-700 hover:underline font-mono font-medium"
                  title="Awaiting Call"
                >
                  VT-8492
                </button>
                <span>|</span>
                <button
                  onClick={() => onOpenTrackId?.('VT-3108')}
                  className="text-emerald-700 hover:underline font-mono font-medium"
                  title="Active Job"
                >
                  VT-3108
                </button>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-slate-400 hover:text-red-600 transition"
                title="Reset to fresh demo seed"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
