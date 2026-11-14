import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { TowRequest, TowTruck } from '../../types';
import { PendingCallQueue } from './PendingCallQueue';
import { OrdersTable } from './OrdersTable';
import { FleetMonitor } from './FleetMonitor';
import { ReviewModeration } from './ReviewModeration';
import { LocationManager } from './LocationManager';
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
  MapPin
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
  const [activeTab, setActiveTab] = useState<'queue' | 'orders' | 'fleet' | 'reviews' | 'locations'>('queue');

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
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-sm w-full shadow-sm text-center space-y-5">
          <div className="w-14 h-14 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center mx-auto text-sky-700">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Owner & Dispatch Portal</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your 4-digit security PIN to access the call queue and dispatch controls.
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
                  Invalid PIN. Please use demo PIN: <strong>1234</strong>
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

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
            <span>Demo PIN: </span>
            <span className="font-mono font-bold text-slate-800">1234</span>
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
    <div className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dispatcher Control Dashboard
            </h1>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Logged In
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Call Verification, Tow Approvals, and Fleet Management
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs flex items-center gap-1.5 transition shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 font-medium px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition border border-slate-200 shadow-sm"
            title="Lock Dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Pending Calls */}
        <div
          onClick={() => setActiveTab('queue')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            activeTab === 'queue'
              ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 font-semibold">Pending Calls</span>
            <div className={`p-1.5 rounded-md ${pendingCallsCount > 0 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{pendingCallsCount}</div>
          <span className="text-[11px] text-amber-700">Requires phone check</span>
        </div>

        {/* Card 2: Active on Road */}
        <div
          onClick={() => setActiveTab('orders')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            activeTab === 'orders'
              ? 'bg-sky-50/80 border-sky-300 ring-1 ring-sky-300'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 font-semibold">Active Rescues</span>
            <div className="p-1.5 rounded-md bg-sky-100 text-sky-700">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{activeJobsCount}</div>
          <span className="text-[11px] text-sky-700">Approved & in progress</span>
        </div>

        {/* Card 3: Trucks Available */}
        <div
          onClick={() => setActiveTab('fleet')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            activeTab === 'fleet'
              ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 font-semibold">Ready Trucks</span>
            <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{availableTrucksCount} / {trucks.length}</div>
          <span className="text-[11px] text-emerald-700">Idle at base</span>
        </div>

        {/* Card 4: Completed */}
        <div
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition shadow-sm"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 font-semibold">Completed</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{completedCount}</div>
          <span className="text-[11px] text-slate-500">Delivered successfully</span>
        </div>

        {/* Card 5: Rejected */}
        <div
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition shadow-sm"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600 font-semibold">Declined</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-red-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{rejectedCount}</div>
          <span className="text-[11px] text-slate-500">Cancelled / Out of area</span>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
            activeTab === 'queue'
              ? 'bg-amber-100 text-amber-900 font-semibold'
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
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
            activeTab === 'orders'
              ? 'bg-sky-100 text-sky-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-sky-600" />
          <span>All Orders & History</span>
          <span className="text-[11px] text-slate-500">({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
            activeTab === 'fleet'
              ? 'bg-emerald-100 text-emerald-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Fleet Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
            activeTab === 'reviews'
              ? 'bg-purple-100 text-purple-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-purple-600" />
          <span>Review Moderation</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
            activeTab === 'locations'
              ? 'bg-emerald-100 text-emerald-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Serviceable Locations</span>
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

      {activeTab === 'locations' && (
        <LocationManager />
      )}

    </div>
  );
};
