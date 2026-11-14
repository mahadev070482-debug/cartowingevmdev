import React, { useState, useMemo } from 'react';
import { TowRequest, TowTruck, RequestStatus } from '../../types';
import { calculateDistanceKm } from '../../services/store';
import { BASE_GARAGE } from '../../data/seedData';
import { Search, ArrowUpDown, Phone, Truck, Eye } from 'lucide-react';

interface OrdersTableProps {
  requests: TowRequest[];
  trucks: TowTruck[];
  onSelectRequestForTracking?: (id: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'priority' | 'distance' | 'status';
type FilterTab = 'all' | 'pending' | 'active' | 'completed' | 'rejected';

export const OrdersTable: React.FC<OrdersTableProps> = ({
  requests,
  onSelectRequestForTracking,
}) => {
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredAndSortedRequests = useMemo(() => {
    let result = [...requests];

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

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((r) => 
        r.id.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
        r.vehicle.makeModel.toLowerCase().includes(q)
      );
    }

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

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending_verification':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Awaiting Call</span>;
      case 'verified_approved':
        return <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Approved</span>;
      case 'driver_accepted':
      case 'en_route':
        return <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">En Route</span>;
      case 'arrived_pickup':
        return <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">At Pickup</span>;
      case 'in_transit':
        return <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">In Transit</span>;
      case 'completed':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Completed</span>;
      case 'declined':
        return <span className="bg-red-50 text-red-800 border border-red-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Declined</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      
      {/* Controls Header: Search + Sort + Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending Verification' },
            { id: 'active', label: 'Active Rescues' },
            { id: 'completed', label: 'Completed' },
            { id: 'rejected', label: 'Declined' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as FilterTab)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                filterTab === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort dropdown */}
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
              <option value="distance">Distance from Base</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

      </div>

      {/* Orders List / Table */}
      {filteredAndSortedRequests.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No tow requests match the active filter or search criteria.
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Tracking ID</th>
                <th className="py-2.5 px-3">Customer & Phone</th>
                <th className="py-2.5 px-3">EV Vehicle</th>
                <th className="py-2.5 px-3">Issue</th>
                <th className="py-2.5 px-3">Distance</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Assigned Truck</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedRequests.map((req) => {
                const dist = calculateDistanceKm(
                  BASE_GARAGE.lat,
                  BASE_GARAGE.lng,
                  req.pickupLocation.lat,
                  req.pickupLocation.lng
                );

                return (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    {/* ID */}
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-800">
                      {req.id}
                    </td>

                    {/* Customer */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{req.customerName}</div>
                      <a
                        href={`tel:${req.customerPhone.replace(/\s+/g, '')}`}
                        className="text-[11px] text-slate-500 hover:text-sky-700 font-mono flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{req.customerPhone}</span>
                      </a>
                    </td>

                    {/* EV */}
                    <td className="py-2.5 px-3">
                      <div className="text-slate-800 font-medium">{req.vehicle.makeModel}</div>
                      {req.vehicle.regNumber && (
                        <div className="text-[10px] text-slate-400 font-mono">{req.vehicle.regNumber}</div>
                      )}
                    </td>

                    {/* Issue */}
                    <td className="py-2.5 px-3">
                      <div className="text-amber-900 font-medium">{req.issueType}</div>
                      <div className="text-[10px] text-slate-400">{req.urgency}</div>
                    </td>

                    {/* Distance */}
                    <td className="py-2.5 px-3 text-slate-600 font-mono">
                      {dist} km
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      {getStatusBadge(req.status)}
                    </td>

                    {/* Truck */}
                    <td className="py-2.5 px-3">
                      {req.assignedTruckPlate ? (
                        <div className="text-slate-800 font-medium flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-slate-500" />
                          <span>{req.assignedTruckPlate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                      {req.agreedPrice && (
                        <span className="text-[10px] text-emerald-700 font-bold block">
                          ₹ {req.agreedPrice}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onSelectRequestForTracking?.(req.id)}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition inline-flex items-center gap-1 text-[11px] font-medium"
                        title="View Customer Tracking View"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
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
