import React, { useState, useMemo } from 'react';
import { TowRequest, TowTruck, RequestStatus } from '../../types';
import { store, calculateDistanceKm } from '../../services/store';
import { BASE_GARAGE } from '../../data/seedData';
import { DriverAssignModal } from './DriverAssignModal';
import { RejectModal } from './RejectModal';
import { 
  Search, 
  ArrowUpDown, 
  Phone, 
  Truck, 
  Eye, 
  ChevronRight, 
  CheckCircle, 
  Navigation, 
  MapPin, 
  MessageCircle, 
  Copy, 
  Check, 
  AlertCircle,
  User,
  UserPlus,
  Pencil,
  XCircle
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingDriverReq, setEditingDriverReq] = useState<TowRequest | null>(null);
  const [rejectingReq, setRejectingReq] = useState<TowRequest | null>(null);

  const pendingCount = useMemo(() => requests.filter((r) => r.status === 'pending_verification').length, [requests]);
  const activeCount = useMemo(() => requests.filter((r) => 
    ['verified_approved', 'driver_accepted', 'en_route', 'arrived_pickup', 'in_transit'].includes(r.status)
  ).length, [requests]);
  const completedCount = useMemo(() => requests.filter((r) => r.status === 'completed').length, [requests]);
  const rejectedCount = useMemo(() => requests.filter((r) => r.status === 'declined').length, [requests]);

  const issuePriorityWeight = (issue: TowRequest['issueType']): number => {
    switch (issue) {
      case 'Total Damage / Total Loss':
      case 'Accident Car Towing':
      case 'Accident / Collision': return 5;
      case 'Dead Battery (0% SOC)': return 4;
      case 'Jump Start Service':
      case '12V Auxiliary System Failure': return 3;
      case 'Flat Tire / Wheel Damage':
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
        r.vehicle.makeModel.toLowerCase().includes(q) ||
        r.pickupLocation.address.toLowerCase().includes(q)
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

  const handleAdvanceStatus = (reqId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    store.advanceDriverStatus(reqId);
  };

  const handleCopyLink = (reqId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/?track=${reqId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(reqId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending_verification':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">Awaiting Call</span>;
      case 'verified_approved':
        return <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">Approved &amp; Assigned</span>;
      case 'driver_accepted':
      case 'en_route':
        return <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">Driver En Route</span>;
      case 'arrived_pickup':
        return <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">At Pickup</span>;
      case 'in_transit':
        return <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">Vehicle In Transit</span>;
      case 'completed':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">Completed</span>;
      case 'declined':
        return <span className="bg-red-50 text-red-800 border border-red-200 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">Declined</span>;
    }
  };

  const renderProgressionAction = (req: TowRequest) => {
    switch (req.status) {
      case 'verified_approved':
      case 'driver_accepted':
        return (
          <button
            onClick={(e) => handleAdvanceStatus(req.id, e)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2.5 py-1.5 rounded-md text-[11px] flex items-center justify-center gap-1 transition shadow-xs"
            title="Update: Tow truck driver has departed base"
          >
            <Navigation className="w-3 h-3" />
            <span>Mark En Route</span>
          </button>
        );
      case 'en_route':
        return (
          <button
            onClick={(e) => handleAdvanceStatus(req.id, e)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-2.5 py-1.5 rounded-md text-[11px] flex items-center justify-center gap-1 transition shadow-xs"
            title="Update: Flatbed has reached customer location"
          >
            <MapPin className="w-3 h-3" />
            <span>Mark Arrived</span>
          </button>
        );
      case 'arrived_pickup':
        return (
          <button
            onClick={(e) => handleAdvanceStatus(req.id, e)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-2.5 py-1.5 rounded-md text-[11px] flex items-center justify-center gap-1 transition shadow-xs"
            title="Update: Car loaded on flatbed, rolling to destination"
          >
            <Truck className="w-3 h-3" />
            <span>Mark In Transit</span>
          </button>
        );
      case 'in_transit':
        return (
          <button
            onClick={(e) => handleAdvanceStatus(req.id, e)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1.5 rounded-md text-[11px] flex items-center justify-center gap-1 transition shadow-xs"
            title="Update: Car unloaded & payment received"
          >
            <CheckCircle className="w-3 h-3" />
            <span>Complete Job</span>
          </button>
        );
      case 'completed':
        return (
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'declined':
        return (
          <span className="text-[11px] text-red-600 font-medium italic">
            Closed
          </span>
        );
      case 'pending_verification':
        return (
          <span className="text-[11px] text-amber-700 font-medium">
            Requires Call
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      
      {/* Controls Header: Search + Sort + Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Filter Tabs with Counter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
          {[
            { id: 'all', label: 'All Requests', count: requests.length },
            { id: 'pending', label: 'Call Queue', count: pendingCount, highlight: pendingCount > 0 },
            { id: 'active', label: 'Active on Road', count: activeCount },
            { id: 'completed', label: 'Completed', count: completedCount },
            { id: 'rejected', label: 'Declined', count: rejectedCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as FilterTab)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
                filterTab === tab.id
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                filterTab === tab.id
                  ? 'bg-white/20 text-white'
                  : tab.highlight
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort controls */}
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, name, car, area..."
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
        <div className="text-center py-12 text-slate-400 text-xs space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
          <p>No tow requests match the active filter or search criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Customer &amp; Phone</th>
                <th className="py-2.5 px-3">Vehicle Details</th>
                <th className="py-2.5 px-3">Issue &amp; Urgency</th>
                <th className="py-2.5 px-3">Pickup Location</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Driver Details</th>
                <th className="py-2.5 px-3 text-center">Fast Status Update</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
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

                const cleanPhone = req.customerPhone.replace(/[^0-9]/g, '').slice(-10);

                return (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    {/* ID */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-sky-800 text-xs">
                        {req.id}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{req.customerName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="text-[11px] text-sky-700 hover:underline font-mono flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{req.customerPhone}</span>
                        </a>
                        <a
                          href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(req.customerName)},%20Mahadev%20Car%20Towing%20update%20for%20ticket%20${req.id}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-semibold">{req.vehicle.makeModel}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        {req.vehicle.regNumber && <span>{req.vehicle.regNumber}</span>}
                        {req.vehicle.hasWheelLock && (
                          <span className="text-red-700 bg-red-50 border border-red-200 px-1 py-0.2 rounded font-sans">
                            Locked
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Issue */}
                    <td className="py-3 px-3">
                      <div className="text-slate-900 font-medium">{req.issueType}</div>
                      <span className="text-[10px] text-slate-500 block">{req.urgency}</span>
                    </td>

                    {/* Pickup & Distance */}
                    <td className="py-3 px-3 max-w-[180px]">
                      <div className="truncate text-slate-700" title={req.pickupLocation.address}>
                        {req.pickupLocation.address}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {dist} km from Gachibowli HQ
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {getStatusBadge(req.status)}
                    </td>

                    {/* Driver Details */}
                    <td className="py-3 px-3">
                      {req.assignedDriverName || req.assignedDriverPhone ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                            <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span className="truncate max-w-[95px]">{req.assignedDriverName || 'Driver'}</span>
                            <button
                              onClick={() => setEditingDriverReq(req)}
                              className="text-slate-400 hover:text-sky-600 p-0.5 rounded transition"
                              title="Edit driver details"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                          {req.assignedDriverPhone && (
                            <a
                              href={`tel:${req.assignedDriverPhone}`}
                              className="text-[11px] text-sky-700 hover:underline font-mono flex items-center gap-1"
                            >
                              <Phone className="w-2.5 h-2.5 text-slate-400" />
                              <span>{req.assignedDriverPhone}</span>
                            </a>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingDriverReq(req)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-1 rounded-md transition"
                          title="Assign driver name & phone number"
                        >
                          <UserPlus className="w-3 h-3 text-sky-600" />
                          <span>+ Add Driver</span>
                        </button>
                      )}
                    </td>

                    {/* Fast Status Progression Button */}
                    <td className="py-3 px-3 text-center min-w-[130px]">
                      {renderProgressionAction(req)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => handleCopyLink(req.id, e)}
                          className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Copy Customer Tracking Link"
                        >
                          {copiedId === req.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                        <button
                          onClick={() => onSelectRequestForTracking?.(req.id)}
                          className="p-1.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 transition inline-flex items-center gap-1 text-[11px] font-semibold border border-sky-200"
                          title="Open Customer Live GPS Screen"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-600" />
                          <span>Track</span>
                        </button>
                        {req.status !== 'completed' && req.status !== 'declined' && (
                          <button
                            onClick={() => setRejectingReq(req)}
                            className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 transition"
                            title="Decline / Cancel Request"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Driver Assignment Modal */}
      {editingDriverReq && (
        <DriverAssignModal
          request={editingDriverReq}
          onClose={() => setEditingDriverReq(null)}
          onSuccess={() => {
            // Updated
          }}
        />
      )}

      {/* Decline / Cancel Request Modal */}
      {rejectingReq && (
        <RejectModal
          request={rejectingReq}
          onClose={() => setRejectingReq(null)}
          onSuccess={() => {
            // Updated
          }}
        />
      )}

    </div>
  );
};
