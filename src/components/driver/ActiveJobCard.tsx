import React from 'react';
import { TowRequest, TowTruck } from '../../types';
import { store } from '../../services/store';
import { DriverGPSControls } from './DriverGPSControls';
import { LeafletMap } from '../common/LeafletMap';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Car, 
  AlertTriangle, 
  Navigation, 
  DollarSign, 
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  Truck
} from 'lucide-react';

interface ActiveJobCardProps {
  request: TowRequest;
  truck: TowTruck;
  onRefresh: () => void;
}

export const ActiveJobCard: React.FC<ActiveJobCardProps> = ({ request, truck, onRefresh }) => {
  const isPendingAcceptance = request.status === 'verified_approved';

  const handleAcceptJob = () => {
    store.acceptJobByDriver(request.id, truck.id);
    onRefresh();
  };

  const handleAdvanceStatus = () => {
    store.advanceDriverStatus(request.id);
    onRefresh();
  };

  // Determine the next step text and button style for the thumb-friendly button
  const getNextStepConfig = () => {
    switch (request.status) {
      case 'verified_approved':
        return {
          title: 'Accept Tow Request',
          subtext: 'Confirm job and begin live GPS broadcast',
          action: handleAcceptJob,
          className: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black',
          stepNumber: 'Step 1'
        };
      case 'driver_accepted':
        return {
          title: '1. Start Driving (En Route)',
          subtext: 'Mark truck rolling towards customer pickup',
          action: handleAdvanceStatus,
          className: 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black',
          stepNumber: 'Step 2'
        };
      case 'en_route':
        return {
          title: '2. Mark Arrived at Pickup',
          subtext: 'Confirm truck is on site at customer location',
          action: handleAdvanceStatus,
          className: 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black',
          stepNumber: 'Step 3'
        };
      case 'arrived_pickup':
        return {
          title: '3. EV Loaded & In Transit',
          subtext: 'Vehicle secured on flatbed with wheel skates & soft straps',
          action: handleAdvanceStatus,
          className: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black',
          stepNumber: 'Step 4'
        };
      case 'in_transit':
        return {
          title: '4. Complete Drop-off',
          subtext: 'Vehicle unloaded at service center / charger / home',
          action: handleAdvanceStatus,
          className: 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black',
          stepNumber: 'Final Step'
        };
      case 'completed':
        return null;
      default:
        return null;
    }
  };

  const nextStep = getNextStepConfig();

  // Map markers
  const markers = [
    {
      lat: request.pickupLocation.lat,
      lng: request.pickupLocation.lng,
      title: 'Customer Pickup',
      subtitle: request.pickupLocation.address,
      type: 'pickup' as const
    },
    {
      lat: truck.currentLocation.lat,
      lng: truck.currentLocation.lng,
      title: `${truck.callSign} (My Truck)`,
      subtitle: truck.driverName,
      type: 'truck' as const
    }
  ];

  return (
    <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      
      {/* Top Banner: Status + Tracking ID */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            ACTIVE ASSIGNED JOB: #{request.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {request.agreedPrice && (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-xl font-mono">
              Quote: ₹ {request.agreedPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-xl font-medium">
            Status: {request.status.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Driver Attention Box: Owner's Call Notes */}
      {request.callNotes && (
        <div className="bg-gradient-to-r from-amber-500/10 via-slate-950 to-amber-500/10 border border-amber-500/40 rounded-2xl p-4 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <FileText className="w-4 h-4" />
            <span>Owner Dispatch Notes (From Customer Phone Call):</span>
          </div>
          <p className="text-slate-200 text-xs pl-5 leading-relaxed">
            &ldquo;{request.callNotes}&rdquo;
          </p>
        </div>
      )}

      {/* Customer & Breakdown Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Customer & Car Info */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Customer Name:</span>
            <span className="text-white font-bold text-sm">{request.customerName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Phone:</span>
            <a href={`tel:${request.customerPhone}`} className="text-cyan-400 font-mono font-bold hover:underline">
              {request.customerPhone}
            </a>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-slate-400">EV Model:</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              {request.vehicle.makeModel}
            </span>
          </div>

          {request.vehicle.regNumber && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Reg Plate:</span>
              <span className="text-slate-300 font-mono font-bold">{request.vehicle.regNumber}</span>
            </div>
          )}

          {request.vehicle.hasWheelLock && (
            <div className="mt-2 p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-bold text-[11px]">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Drive Wheels Locked in Park: Use Wheel Skates!</span>
            </div>
          )}
        </div>

        {/* Route / Locations */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="space-y-1">
            <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Pickup Location:
            </span>
            <p className="text-white font-semibold pl-4">{request.pickupLocation.address}</p>
            {request.pickupLocation.landmark && (
              <p className="text-slate-400 text-[11px] pl-4">Landmark: {request.pickupLocation.landmark}</p>
            )}
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800">
            <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              Drop-off Destination:
            </span>
            <p className="text-white font-semibold pl-4">
              {request.dropoffLocation.name}
            </p>
            <p className="text-slate-400 text-[11px] pl-4">{request.dropoffLocation.address}</p>
          </div>
        </div>
      </div>

      {/* Mini Leaflet Route Map */}
      <div className="h-64 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        <LeafletMap
          markers={markers}
          center={[request.pickupLocation.lat, request.pickupLocation.lng]}
          zoom={13}
          showRoute={true}
          className="h-full w-full"
        />
      </div>

      {/* Live GPS Controls & Turn-by-Turn Nav */}
      <DriverGPSControls request={request} truck={truck} />

      {/* The Big Thumb-Friendly One-Tap Action Button */}
      {nextStep && (
        <div className="pt-2">
          <button
            onClick={nextStep.action}
            className={`w-full py-5 px-6 rounded-2xl text-base sm:text-lg shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex flex-col items-center justify-center gap-1 ${nextStep.className}`}
          >
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 animate-pulse" />
              <span className="text-lg sm:text-xl">{nextStep.title}</span>
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-xs opacity-90 font-normal">
              {nextStep.subtext}
            </span>
          </button>
        </div>
      )}

    </div>
  );
};
