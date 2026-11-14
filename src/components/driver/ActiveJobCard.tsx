import React from 'react';
import { TowRequest, TowTruck } from '../../types';
import { store } from '../../services/store';
import { DriverGPSControls } from './DriverGPSControls';
import { LeafletMap } from '../common/LeafletMap';
import { 
  MapPin, 
  Car, 
  Navigation, 
  FileText,
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
  const handleAcceptJob = () => {
    store.acceptJobByDriver(request.id, truck.id);
    onRefresh();
  };

  const handleAdvanceStatus = () => {
    store.advanceDriverStatus(request.id);
    onRefresh();
  };

  const getNextStepConfig = () => {
    switch (request.status) {
      case 'verified_approved':
        return {
          title: 'Accept Tow Request',
          subtext: 'Confirm job and begin live GPS broadcast',
          action: handleAcceptJob,
          className: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
        };
      case 'driver_accepted':
        return {
          title: '1. Start Driving (En Route)',
          subtext: 'Mark truck rolling towards customer pickup',
          action: handleAdvanceStatus,
          className: 'bg-sky-600 hover:bg-sky-700 text-white font-bold',
        };
      case 'en_route':
        return {
          title: '2. Mark Arrived at Pickup',
          subtext: 'Confirm truck is on site at customer location',
          action: handleAdvanceStatus,
          className: 'bg-amber-600 hover:bg-amber-700 text-white font-bold',
        };
      case 'arrived_pickup':
        return {
          title: '3. EV Loaded & In Transit',
          subtext: 'Vehicle secured on flatbed with wheel skates & soft straps',
          action: handleAdvanceStatus,
          className: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold',
        };
      case 'in_transit':
        return {
          title: '4. Complete Drop-off',
          subtext: 'Vehicle unloaded at destination',
          action: handleAdvanceStatus,
          className: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
        };
      case 'completed':
        return null;
      default:
        return null;
    }
  };

  const nextStep = getNextStepConfig();

  const markers: Array<{
    lat: number;
    lng: number;
    title: string;
    subtitle?: string;
    type: 'pickup' | 'truck' | 'dropoff' | 'base';
  }> = [
    {
      lat: request.pickupLocation.lat,
      lng: request.pickupLocation.lng,
      title: 'Customer Pickup',
      subtitle: request.pickupLocation.address,
      type: 'pickup'
    },
    {
      lat: truck.currentLocation.lat,
      lng: truck.currentLocation.lng,
      title: `${truck.callSign} (My Truck)`,
      subtitle: truck.driverName,
      type: 'truck'
    }
  ];

  return (
    <div className="bg-white border-2 border-sky-500 rounded-xl p-5 sm:p-7 shadow-sm space-y-5">
      
      {/* Top Banner: Status + Tracking ID */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-800 font-mono">
            ASSIGNED JOB: #{request.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {request.agreedPrice && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-md font-mono">
              Quote: ₹ {request.agreedPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-md font-medium">
            Status: {request.status.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Driver Attention Box: Owner's Call Notes */}
      {request.callNotes && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
            <FileText className="w-4 h-4 text-amber-700" />
            <span>Dispatcher Call Notes:</span>
          </div>
          <p className="text-slate-700 text-xs pl-5 leading-relaxed">
            &ldquo;{request.callNotes}&rdquo;
          </p>
        </div>
      )}

      {/* Customer & Breakdown Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Customer & Car Info */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Customer Name:</span>
            <span className="text-slate-900 font-bold text-sm">{request.customerName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Phone:</span>
            <a href={`tel:${request.customerPhone}`} className="text-sky-700 font-mono font-bold hover:underline">
              {request.customerPhone}
            </a>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
            <span className="text-slate-500">EV Model:</span>
            <span className="text-slate-900 font-semibold flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-sky-600" />
              {request.vehicle.makeModel}
            </span>
          </div>

          {request.vehicle.regNumber && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Reg Plate:</span>
              <span className="text-slate-800 font-mono font-bold">{request.vehicle.regNumber}</span>
            </div>
          )}

          {request.vehicle.hasWheelLock && (
            <div className="mt-2 p-2 rounded bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5 font-semibold text-[11px]">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Drive Wheels Locked: Use Go-Jack Wheel Skates!</span>
            </div>
          )}
        </div>

        {/* Route / Locations */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              Pickup:
            </span>
            <p className="text-slate-900 font-semibold pl-4">{request.pickupLocation.address}</p>
            {request.pickupLocation.landmark && (
              <p className="text-slate-500 text-[11px] pl-4">Landmark: {request.pickupLocation.landmark}</p>
            )}
          </div>

          <div className="space-y-0.5 pt-1.5 border-t border-slate-200/80">
            <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              Drop-off:
            </span>
            <p className="text-slate-900 font-semibold pl-4">
              {request.dropoffLocation.name}
            </p>
            <p className="text-slate-500 text-[11px] pl-4">{request.dropoffLocation.address}</p>
          </div>
        </div>
      </div>

      {/* Mini Leaflet Route Map */}
      <div className="h-60 rounded-lg overflow-hidden border border-slate-200">
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
        <div className="pt-1">
          <button
            onClick={nextStep.action}
            className={`w-full py-4 px-6 rounded-xl text-base shadow-sm transition flex flex-col items-center justify-center gap-0.5 ${nextStep.className}`}
          >
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span className="text-lg">{nextStep.title}</span>
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
