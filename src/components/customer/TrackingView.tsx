import React, { useEffect, useState } from 'react';
import { TowRequest, RequestStatus } from '../../types';
import { store } from '../../services/store';
import { LeafletMap } from '../common/LeafletMap';
import { BASE_GARAGE } from '../../data/seedData';
import { 
  PhoneCall, 
  Clock, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Zap, 
  ShieldCheck, 
  ArrowLeft,
  Navigation,
  Car,
  Compass,
  Phone
} from 'lucide-react';

interface TrackingViewProps {
  requestId: string;
  onBackToHome: () => void;
  onTrackSearch: (query: string) => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  requestId,
  onBackToHome,
  onTrackSearch,
}) => {
  const [request, setRequest] = useState<TowRequest | undefined>(store.getRequestById(requestId));
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe to real-time store changes
  useEffect(() => {
    const update = () => {
      const found = store.getRequestById(requestId);
      setRequest(found);
    };

    update();
    const unsubscribe = store.subscribe(update);
    return () => unsubscribe();
  }, [requestId]);

  if (!request) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Tow Request Not Found</h2>
          <p className="text-xs text-slate-400">
            Could not find an active request with ID <span className="text-cyan-400 font-mono font-bold">&quot;{requestId}&quot;</span>.
          </p>
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) onTrackSearch(searchQuery.trim());
              }}
              className="space-y-2"
            >
              <input
                type="text"
                placeholder="Try another ID (e.g. VT-8492) or Mobile"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="w-full bg-cyan-500 text-slate-950 font-bold py-2 rounded-xl text-xs hover:bg-cyan-400 transition"
              >
                Search Again
              </button>
            </form>
          </div>
          <button
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    );
  }

  // 7-step timeline mapping
  const steps: { key: RequestStatus; label: string; desc: string }[] = [
    {
      key: 'pending_verification',
      label: 'Request Submitted',
      desc: 'Awaiting dispatch verification call'
    },
    {
      key: 'verified_approved',
      label: 'Call Verified & Approved',
      desc: 'Agreed quote & vehicle specs confirmed'
    },
    {
      key: 'driver_accepted',
      label: 'Assigned to Flatbed',
      desc: 'Tow truck driver accepted job'
    },
    {
      key: 'en_route',
      label: 'Driver En Route',
      desc: 'Tow truck heading to your location'
    },
    {
      key: 'arrived_pickup',
      label: 'Arrived at Pickup',
      desc: 'Truck is on site with skates ready'
    },
    {
      key: 'in_transit',
      label: 'EV Loaded & In Transit',
      desc: 'Secured on flatbed, moving to drop-off'
    },
    {
      key: 'completed',
      label: 'Rescue Completed',
      desc: 'Safely delivered to destination'
    }
  ];

  // Helper to determine step status
  const getStepIndex = (status: RequestStatus) => {
    switch (status) {
      case 'pending_verification': return 0;
      case 'verified_approved': return 1;
      case 'driver_accepted': return 2;
      case 'en_route': return 3;
      case 'arrived_pickup': return 4;
      case 'in_transit': return 5;
      case 'completed': return 6;
      case 'declined': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(request.status);
  const isDeclined = request.status === 'declined';

  // Build map markers
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
      title: 'Your EV Location',
      subtitle: `${request.vehicle.makeModel} - ${request.pickupLocation.address}`,
      type: 'pickup'
    }
  ];

  if (request.driverLiveLocation && ['verified_approved', 'driver_accepted', 'en_route', 'arrived_pickup', 'in_transit'].includes(request.status)) {
    markers.push({
      lat: request.driverLiveLocation.lat,
      lng: request.driverLiveLocation.lng,
      title: `${request.assignedDriverName || 'Tow Truck'} (${request.assignedTruckPlate || 'Flatbed'})`,
      subtitle: `Speed: ${request.driverLiveLocation.speed || 30} km/h`,
      type: 'truck' as const
    });
  }

  return (
    <div className="py-8 lg:py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Navigation & Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Tracking Reference:</span>
          <span className="font-mono text-base font-black px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 tracking-wider">
            {request.id}
          </span>
        </div>
      </div>

      {/* Main Alert Banner for Current State */}
      {isDeclined ? (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 text-rose-300 flex items-start gap-4">
          <XCircle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">Tow Request Declined by Dispatcher</h3>
            <p className="text-sm">
              Reason: <strong className="text-rose-200">{request.rejectionReason || 'Unable to service'}</strong>
            </p>
            {request.rejectionNotes && (
              <p className="text-xs text-slate-400 mt-1">
                Owner Note: {request.rejectionNotes}
              </p>
            )}
            <p className="text-xs text-slate-400 pt-2">
              If this was a misunderstanding, please call our 24/7 helpline at{' '}
              <a href={`tel:${BASE_GARAGE.phone}`} className="text-cyan-400 font-bold underline">
                {BASE_GARAGE.phone}
              </a>.
            </p>
          </div>
        </div>
      ) : request.status === 'pending_verification' ? (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-amber-300 flex items-start gap-4 animate-pulse-subtle">
          <Clock className="w-7 h-7 text-amber-400 shrink-0 mt-0.5 animate-spin" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">Step 1: Awaiting Owner Verification Call</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our dispatch owner will ring your mobile (<strong className="text-white font-mono">{request.customerPhone}</strong>) within <strong className="text-amber-300">2 minutes</strong> to confirm your EV's condition, tow requirements, and upfront quote before dispatching the truck.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs">
              <span className="text-slate-400">Keep your phone line free.</span>
              <a href={`tel:${BASE_GARAGE.phone}`} className="text-cyan-400 underline font-semibold">
                Or Tap to Call Owner Directly
              </a>
            </div>
          </div>
        </div>
      ) : request.status === 'completed' ? (
        <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-5 text-emerald-300 flex items-start gap-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">Rescue Completed Successfully!</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Your {request.vehicle.makeModel} has been delivered safely to {request.dropoffLocation.name}. Thank you for choosing VOLTRESCUE!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-500/40 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Truck className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider block">
                {request.status === 'verified_approved' ? 'Call Approved - Dispatching Driver' :
                 request.status === 'driver_accepted' ? 'Driver Confirmed Job' :
                 request.status === 'en_route' ? 'Tow Truck En Route' :
                 request.status === 'arrived_pickup' ? 'Tow Truck Arrived at Pickup' :
                 'Vehicle Loaded & Moving to Drop-off'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {request.assignedTruckPlate ? `Flatbed ${request.assignedTruckPlate}` : 'EV Hydraulic Flatbed'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Estimated Arrival</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                {request.etaMinutes ? `~${request.etaMinutes} mins` : 'Calculating...'}
              </span>
            </div>

            {request.assignedDriverPhone && (
              <a
                href={`tel:${request.assignedDriverPhone}`}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call Driver</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* 7-Step Progression Stepper */}
      {!isDeclined && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Live Dispatch Progress (Step {Math.max(1, currentStepIdx + 1)} of 7)
          </h4>

          {/* Stepper on Desktop/Tablet */}
          <div className="relative">
            <div className="hidden lg:grid grid-cols-7 gap-2">
              {steps.map((s, idx) => {
                const isPassed = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={s.key} className="relative flex flex-col items-center text-center">
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 w-full h-1 -z-0 ${
                          idx < currentStepIdx ? 'bg-cyan-500' : 'bg-slate-800'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
                        isPassed
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-glow-sm'
                          : isCurrent
                          ? 'bg-slate-900 border-cyan-400 text-cyan-400 ring-4 ring-cyan-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    {/* Label */}
                    <div className="mt-3">
                      <p
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-cyan-300' : isPassed ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {s.label}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 max-w-[120px] mx-auto line-clamp-2">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stepper for Mobile (Vertical list) */}
            <div className="lg:hidden space-y-3">
              {steps.map((s, idx) => {
                const isPassed = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={s.key}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition ${
                      isCurrent ? 'bg-cyan-500/10 border border-cyan-500/30' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                        isPassed
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                          : isCurrent
                          ? 'bg-slate-900 border-cyan-400 text-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-cyan-300' : isPassed ? 'text-white' : 'text-slate-500'}`}>
                        {s.label}
                      </p>
                      <p className="text-[11px] text-slate-400">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Grid: Live Interactive Map + Driver & Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Leaflet Map (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-cyan-400" />
              Live Route & GPS Telemetry
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Status: {request.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          <div className="h-[380px] rounded-2xl overflow-hidden border border-slate-800">
            <LeafletMap
              markers={markers}
              center={[request.pickupLocation.lat, request.pickupLocation.lng]}
              zoom={13}
              showRoute={true}
              className="h-full w-full"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Your EV (Pickup)
            </span>
            {request.driverLiveLocation && (
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span> Assigned Tow Truck (Moving)
              </span>
            )}
            <span className="text-slate-500">Updates live every 5s</span>
          </div>
        </div>

        {/* Right Column: Driver & Vehicle Specs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Assigned Driver Card */}
          {request.assignedDriverName ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Recovery Crew
                </h4>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  EV Certified
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-md">
                  {request.assignedDriverName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{request.assignedDriverName}</h4>
                  <p className="text-xs text-slate-400">Senior EV Flatbed Specialist</p>
                  <p className="text-xs text-cyan-400 font-mono font-semibold">{request.assignedTruckPlate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <a
                  href={`tel:${request.assignedDriverPhone}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver</span>
                </a>

                <a
                  href={`tel:${BASE_GARAGE.phone}`}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition border border-slate-700"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Call Dispatch</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center space-y-2">
              <Truck className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">Truck Assignment Pending</h4>
              <p className="text-xs text-slate-400">
                The dispatcher is currently matching the optimal hydraulic flatbed and wheel skates for your vehicle.
              </p>
            </div>
          )}

          {/* Job Details Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3.5 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-xs pb-2 border-b border-slate-800">
              Booking Details
            </h4>

            <div className="space-y-2">
              <div>
                <span className="text-slate-500 block text-[11px]">Vehicle:</span>
                <span className="text-white font-semibold">{request.vehicle.makeModel}</span>
                {request.vehicle.regNumber && (
                  <span className="text-slate-400 font-mono ml-2">({request.vehicle.regNumber})</span>
                )}
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Reported Issue:</span>
                <span className="text-amber-400 font-semibold">{request.issueType}</span>
                {request.issueDescription && (
                  <p className="text-slate-400 text-[11px] mt-0.5">{request.issueDescription}</p>
                )}
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Pickup Location:</span>
                <span className="text-slate-300">{request.pickupLocation.address}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Drop-off Destination:</span>
                <span className="text-slate-300">{request.dropoffLocation.name} - {request.dropoffLocation.address}</span>
              </div>

              {request.agreedPrice && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Confirmed Quote:</span>
                  <span className="text-base font-black text-cyan-400 font-mono">
                    ₹ {request.agreedPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
