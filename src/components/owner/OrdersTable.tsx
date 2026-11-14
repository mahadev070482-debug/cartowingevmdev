import React, { useState, useMemo } from 'react';
import { TowRequest, TowTruck, RequestStatus } from '../../types';
import { calculateDistanceKm } from '../../services/store';
import { BASE_GARAGE } from '../../data/seedData';
import { 
  Search, 
  ArrowUpDown, 
  Filter, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Car, 
  Navigation,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface OrdersTableProps {
  requests: TowRequest[];
  trucks: TowTruck[];
  onSelectRequestForTracking?: (id: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'priority' | 'distance' | 'status';
type FilterTab = 'all' | 'pending' | 'active' | 'completed' | 'rejected';

export const OrdersTable: React.FC<OrdersTableProps> = ({
  requests,
  trucks,
  onSelectRequestForTracking,
}) => {
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Priority mapping for issues
  const issuePriorityWeight = (issue: TowRequest['issueType']): number => {
    switch (issue) {
      case 'Accident / Collision': return 5;
      case 'Dead Battery (0% SOC)': return 4;
      case '12V Auxiliary System Failure': return 3;
      case 'Flat Tire': return 2;
      case 'Mechanical / Drive Unit': return 1;
      default: return 0;
    }
  };

  // Filter and sort requests
  const filteredAndSortedRequests = useMemo(() => {
    let result = [...requests];

    // 1. Tab Filter
    if (filterTab === 'pending') {
      result = result.filter((r) => r.status === 'pending_verification');
    } else if (filterTab === 'active') {
      result = result.filter((r) => 
        ['verified_approved', 'driver_accepted', 'en_route', 'arrived_pickup', 'in_transit'].includes(r.status)
      );
    } else if (filterTab === 'completed') {
      result = result.filter((r) => r.status === 'completed');
    } else if (filterTab === 'rejected') {
      result = result.filter((r) => r.status === 'declined');
    }

    // 2. Search query (ID, Name, Phone)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((r) => 
        r.id.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
        r.vehicle.makeModel.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOption === 'priority') {
        return issuePriorityWeight(b.issueType) - issuePriorityWeight(a.issueType);
      }
      if (sortOption === 'distance') {
        const distA = calculateDistanceKm(BASE_GARAGE.lat, BASE_GARAGE.lng, a.pickupLocation.lat, a.pickupLocation.lng);
        const distB = calculateDistanceKm(BASE_GARAGE.lat, BASE_GARAGE.lng, b.pickupLocation.lat, b.pickupLocation.lng);
        return distA - distB;
      }
      if (sortOption === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return result;
  }, [requests, filterTab, sortOption, searchQuery]);

  // Status badge styling helper
  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending_verification':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">Awaiting Call</span>;
      case 'verified_approved':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">Approved (Assigned)</span>;
      case 'driver_accepted':
      case 'en_route':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">En Route</span>;
      case 'arrived_pickup':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">At Pickup</span>;
      case 'in_transit':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">In Transit</span>;
      case 'completed':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">Completed</span>;
      case 'declined':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">Declined</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
      
      {/* Controls Header: Search + Sort + Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending Verification' },
            { id: 'active', label: 'Approved & Active' },
            { id: 'completed', label: 'Completed' },
            { id: 'rejected', label: 'Rejected / Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as FilterTab)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                filterTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort dropdown */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by ID, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-slate-900">Newest First</option>
              <option value="oldest" className="bg-slate-900">Oldest First</option>
              <option value="priority" className="bg-slate-900">Priority (Accident &gt; Battery &gt; Tire)</option>
              <option value="distance" className="bg-slate-900">Distance from Base Garage</option>
              <option value="status" className="bg-slate-900">Status</option>
            </select>
          </div>
        </div>

      </div>

      {/* Orders List / Table */}
      {filteredAndSortedRequests.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs">
          No tow requests match the active filter or search criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Tracking ID</th>
                <th className="py-3 px-3">Customer & Phone</th>
                <th className="py-3 px-3">EV Vehicle</th>
                <th className="py-3 px-3">Issue & Priority</th>
                <th className="py-3 px-3">Distance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Assigned Truck</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAndSortedRequests.map((req) => {
                const dist = calculateDistanceKm(
                  BASE_GARAGE.lat,
                  BASE_GARAGE.lng,
                  req.pickupLocation.lat,
                  req.pickupLocation.lng
                );

                return (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition">
                    {/* ID */}
                    <td className="py-3.5 px-3 font-mono font-bold text-cyan-300">
                      {req.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{req.customerName}</div>
                      <a
                        href={`tel:${req.customerPhone.replace(/\s+/g, '')}`}
                        className="text-[11px] text-cyan-400 hover:underline font-mono flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{req.customerPhone}</span>
                      </a>
                    </td>

                    {/* EV */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-200 font-medium">{req.vehicle.makeModel}</div>
                      {req.vehicle.regNumber && (
                        <div className="text-[10px] text-slate-400 font-mono">{req.vehicle.regNumber}</div>
                      )}
                    </td>

                    {/* Issue */}
                    <td className="py-3.5 px-3">
                      <div className="text-amber-300 font-semibold">{req.issueType}</div>
                      <div className="text-[10px] text-slate-400">{req.urgency}</div>
                    </td>

                    {/* Distance */}
                    <td className="py-3.5 px-3 text-slate-300 font-mono">
                      {dist} km
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(req.status)}
                    </td>

                    {/* Truck */}
                    <td className="py-3.5 px-3">
                      {req.assignedTruckPlate ? (
                        <div className="text-white font-medium flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{req.assignedTruckPlate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                      {req.agreedPrice && (
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          ₹ {req.agreedPrice}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => onSelectRequestForTracking?.(req.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white transition inline-flex items-center gap-1 text-[11px]"
                        title="View Customer Tracking View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
