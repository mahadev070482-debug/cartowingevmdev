import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { TowRequest, TowTruck } from '../../types';
import { PendingCallQueue } from './PendingCallQueue';
import { OrdersTable } from './OrdersTable';
import { FleetMonitor } from './FleetMonitor';
import { ReviewModeration } from './ReviewModeration';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  PhoneCall, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  LogOut,
  RefreshCw,
  Search,
  Activity,
  Layers,
  MessageSquare
} from 'lucide-react';

interface OwnerDashboardProps {
  onSelectRequestForTracking?: (id: string) => void;
  onOpenDriverPortal?: (truckId: string) => void;
}

const OWNER_DEMO_PIN = '1234';

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onSelectRequestForTracking,
  onOpenDriverPortal,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('voltrescue_owner_authed') === 'true';
    }
    return false;
  });

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'orders' | 'fleet' | 'reviews'>('queue');

  // State from store
  const [requests, setRequests] = useState<TowRequest[]>(store.getRequests());
  const [trucks, setTrucks] = useState<TowTruck[]>(store.getTrucks());

  const handleRefresh = () => {
    setRequests([...store.getRequests()]);
    setTrucks([...store.getTrucks()]);
  };

  useEffect(() => {
    const update = () => {
      setRequests([...store.getRequests()]);
      setTrucks([...store.getTrucks()]);
    };
    const unsubscribe = store.subscribe(update);
    return () => unsubscribe();
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === OWNER_DEMO_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('voltrescue_owner_authed', 'true');
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('voltrescue_owner_authed');
  };

  // If not authenticated, show PIN entry modal / screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-black text-white">Owner & Dispatch Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Please enter your 4-digit security PIN to access the call verification queue and fleet controls.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="Enter PIN (Demo: 1234)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full bg-slate-950 border ${
                  pinError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-700 focus:border-cyan-400'
                } rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-white focus:outline-none transition`}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium">
                  Invalid PIN. Please use demo PIN: <strong>1234</strong>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3 rounded-xl text-sm shadow-lg transition"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <span>Demo PIN is: </span>
            <span className="font-mono font-bold text-cyan-400">1234</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate high-level counters
  const pendingCallsCount = requests.filter((r) => r.status === 'pending_verification').length;
  const activeJobsCount = requests.filter((r) => 
    ['verified_approved', 'driver_accepted', 'en_route', 'arrived_pickup', 'in_transit'].includes(r.status)
  ).length;
  const completedCount = requests.filter((r) => r.status === 'completed').length;
  const rejectedCount = requests.filter((r) => r.status === 'declined').length;
  const availableTrucksCount = trucks.filter((t) => t.status === 'idle').length;

  return (
    <div className="py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Owner / Dispatcher Control Tower
            </h1>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
              LIVE UNLOCKED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Call-First Verification Workflow, Fleet Routing, and Customer Order Moderation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition"
            title="Refresh Store"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-slate-700"
            title="Lock Dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Card 1: Pending Calls */}
        <div
          onClick={() => setActiveTab('queue')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'queue'
              ? 'bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-500/20'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Pending Calls</span>
            <div className={`p-1.5 rounded-lg ${pendingCallsCount > 0 ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-slate-800 text-slate-400'}`}>
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{pendingCallsCount}</div>
          <span className="text-[10px] text-amber-300/80">Requires verification call</span>
        </div>

        {/* Card 2: Active on Road */}
        <div
          onClick={() => setActiveTab('orders')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'orders'
              ? 'bg-cyan-500/10 border-cyan-500/60 ring-2 ring-cyan-500/20'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Active Rescues</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">{activeJobsCount}</div>
          <span className="text-[10px] text-cyan-300/80">Approved & in motion</span>
        </div>

        {/* Card 3: Trucks Available */}
        <div
          onClick={() => setActiveTab('fleet')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'fleet'
              ? 'bg-emerald-500/10 border-emerald-500/60 ring-2 ring-emerald-500/20'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Ready Trucks</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{availableTrucksCount} / {trucks.length}</div>
          <span className="text-[10px] text-emerald-300/80">Idle at base depot</span>
        </div>

        {/* Card 4: Completed */}
        <div
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Completed</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{completedCount}</div>
          <span className="text-[10px] text-slate-400">Delivered successfully</span>
        </div>

        {/* Card 5: Rejected */}
        <div
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Rejected / Spam</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">{rejectedCount}</div>
          <span className="text-[10px] text-slate-400">Cancelled / Out of area</span>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'queue'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call Verification Queue</span>
          {pendingCallsCount > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {pendingCallsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'orders'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Orders & Sorting</span>
          <span className="text-[11px] text-slate-500">({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'fleet'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Fleet Live Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'reviews'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Review Moderation</span>
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'queue' && (
        <PendingCallQueue
          requests={requests}
          trucks={trucks}
          onRefresh={handleRefresh}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersTable
          requests={requests}
          trucks={trucks}
          onSelectRequestForTracking={onSelectRequestForTracking}
        />
      )}

      {activeTab === 'fleet' && (
        <FleetMonitor
          trucks={trucks}
          onOpenDriverPortal={onOpenDriverPortal}
        />
      )}

      {activeTab === 'reviews' && (
        <ReviewModeration />
      )}

    </div>
  );
};
