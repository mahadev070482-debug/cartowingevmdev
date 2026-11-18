import React, { useState, useEffect, useRef } from 'react';
import { store } from '../../services/store';
import { TowRequest, TowTruck } from '../../types';
import { PendingCallQueue } from './PendingCallQueue';
import { OrdersTable } from './OrdersTable';
import { ReviewModeration } from './ReviewModeration';
import { LocationManager } from './LocationManager';
import { StatsManager } from './StatsManager';
import { 
  Lock, 
  PhoneCall, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut,
  RefreshCw,
  Activity,
  Layers,
  MessageSquare,
  MapPin,
  Sparkles,
  ExternalLink,
  Volume2,
  VolumeX,
  BellRing,
  Clock
} from 'lucide-react';

interface OwnerDashboardProps {
  onSelectRequestForTracking?: (id: string) => void;
  onExitToCustomerSite?: () => void;
}

const OWNER_DEMO_PIN = '1234';

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onSelectRequestForTracking,
  onExitToCustomerSite,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('voltrescue_owner_authed') === 'true';
    }
    return false;
  });

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'orders' | 'reviews' | 'locations' | 'stats'>('queue');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('owner_sound_alert') !== 'false';
    }
    return true;
  });

  // State from store
  const [requests, setRequests] = useState<TowRequest[]>(store.getRequests());
  const [trucks, setTrucks] = useState<TowTruck[]>(store.getTrucks());
  const prevPendingCountRef = useRef<number>(requests.filter((r) => r.status === 'pending_verification').length);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio autoplay policy or not supported
    }
  };

  const handleRefresh = () => {
    setRequests([...store.getRequests()]);
    setTrucks([...store.getTrucks()]);
  };

  useEffect(() => {
    const update = () => {
      const updatedRequests = [...store.getRequests()];
      const updatedPending = updatedRequests.filter((r) => r.status === 'pending_verification').length;
      if (updatedPending > prevPendingCountRef.current) {
        playChime();
      }
      prevPendingCountRef.current = updatedPending;
      setRequests(updatedRequests);
      setTrucks([...store.getTrucks()]);
    };
    const unsubscribe = store.subscribe(update);
    return () => unsubscribe();
  }, [soundEnabled]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('owner_sound_alert', String(next));
    if (next) playChime();
  };

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

  const handleExit = () => {
    if (onExitToCustomerSite) {
      onExitToCustomerSite();
    } else {
      window.location.href = '/';
    }
  };

  // If not authenticated, show PIN entry modal / screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-100/70">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-sm w-full shadow-lg text-center space-y-5">
          <div className="w-14 h-14 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center mx-auto text-sky-700 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Mahadev Towing Portal</h2>
            <p className="text-xs text-slate-500 mt-1">
              Private Dispatcher &amp; Fleet Management Console
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3.5">
            <div>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="PIN: 1234"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full bg-slate-50 border ${
                  pinError ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-sky-600 focus:bg-white'
                } rounded-lg px-4 py-2.5 text-center text-xl font-mono tracking-widest text-slate-900 focus:outline-none transition`}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">
                  Invalid PIN. Please use authorization PIN: <strong>1234</strong>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-lg text-sm shadow-sm transition"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>PIN: <strong className="text-slate-800 font-mono">1234</strong></span>
            <button
              onClick={handleExit}
              className="text-sky-700 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Back to Customer Site</span>
            </button>
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

  return (
    <div className="py-6 lg:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Header & Navigation Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dispatcher &amp; Fleet Operations
            </h1>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Connected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mahadev Car Towing Services • Gachibowli HQ Central Dispatch
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Sound Alert Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 border transition shadow-xs ${
              soundEnabled
                ? 'bg-sky-50 border-sky-300 text-sky-800'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title={soundEnabled ? 'Mute booking alert chime' : 'Enable booking alert chime'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-sky-600" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Muted'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Exit to Customer Website */}
          <button
            onClick={handleExit}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
            title="Return to public customer website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>

          {/* Lock / Logout */}
          <button
            onClick={handleLogout}
            className="bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition border border-slate-200 shadow-xs"
            title="Lock Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </div>

      {/* Prominent Alert Banner when Pending Calls are Waiting */}
      {pendingCallsCount > 0 && (
        <div className="bg-amber-500 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-amber-600 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {pendingCallsCount} New Booking Request{pendingCallsCount > 1 ? 's' : ''} Awaiting Call Verification!
              </h3>
              <p className="text-xs text-amber-100">
                Call the customer directly to confirm vehicle condition and lock in flatbed dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('queue')}
            className="bg-white text-amber-900 hover:bg-amber-50 font-bold px-4 py-2 rounded-lg text-xs transition shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            View Call Queue ({pendingCallsCount})
          </button>
        </div>
      )}

      {/* KPI Stat Cards (4 Clean Columns, No Truck Monitoring) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Pending Calls */}
        <div
          onClick={() => setActiveTab('queue')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            activeTab === 'queue'
              ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 font-semibold">Call Queue</span>
            <div className={`p-1.5 rounded-md ${pendingCallsCount > 0 ? 'bg-amber-600 text-white animate-bounce' : 'bg-slate-100 text-slate-500'}`}>
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{pendingCallsCount}</div>
          <span className="text-[11px] text-amber-700 font-medium">Awaiting phone check</span>
        </div>

        {/* Card 2: Active on Road */}
        <div
          onClick={() => setActiveTab('orders')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            activeTab === 'orders'
              ? 'bg-sky-50/80 border-sky-300 ring-1 ring-sky-300'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 font-semibold">Active On-Road</span>
            <div className="p-1.5 rounded-md bg-sky-100 text-sky-700">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{activeJobsCount}</div>
          <span className="text-[11px] text-sky-700 font-medium">En Route / In Transit</span>
        </div>

        {/* Card 3: Completed */}
        <div
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition shadow-xs"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 font-semibold">Delivered</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{completedCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Completed rescues</span>
        </div>

        {/* Card 4: Rejected */}
        <div
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition shadow-xs"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 font-semibold">Declined</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-red-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{rejectedCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Cancelled / Out of area</span>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs sm:text-sm font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'queue'
              ? 'bg-amber-100 text-amber-900 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PhoneCall className="w-4 h-4 text-amber-600" />
          <span>Call Verification Queue</span>
          {pendingCallsCount > 0 && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingCallsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-sky-100 text-sky-900 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-sky-600" />
          <span>All Orders &amp; Dispatch Progression</span>
          <span className="text-[11px] text-slate-500">({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-purple-100 text-purple-900 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-purple-600" />
          <span>Review Moderation</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'locations'
              ? 'bg-emerald-100 text-emerald-900 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Service Hubs</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-sky-100 text-sky-900 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Edit Stats</span>
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

      {activeTab === 'reviews' && (
        <ReviewModeration />
      )}

      {activeTab === 'locations' && (
        <LocationManager />
      )}

      {activeTab === 'stats' && (
        <StatsManager />
      )}

    </div>
  );
};
