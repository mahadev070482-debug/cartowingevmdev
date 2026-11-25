import React, { useEffect, useState } from 'react';
import { TowRequest, RequestStatus } from '../../types';
import { store } from '../../services/store';
import { cloudDb } from '../../services/db';
import { LeafletMap } from '../common/LeafletMap';
import { BASE_GARAGE } from '../../data/seedData';
import { 
  PhoneCall, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowLeft,
  Navigation,
  Car,
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

  // Subscribe to real-time store changes and live sync from cloud database
  useEffect(() => {
    let isMounted = true;

    const update = () => {
      const found = store.getRequestById(requestId);
      if (isMounted) setRequest(found);
    };

    update();
    const unsubscribe = store.subscribe(update);

    // Cross-device live cloud sync: Fetch status from Firebase every 2.5 seconds
    const syncFromCloud = async () => {
      if (cloudDb.isCloudConnected()) {
        try {
          const cloudReq = await cloudDb.fetchTowRequestById(requestId);
          if (cloudReq && isMounted) {
            store.updateRequestFromCloud(cloudReq);
            setRequest(cloudReq);
          }
        } catch (e) {
          // ignore transient network errors
        }
      }
    };

    // Immediately trigger cloud fetch
    syncFromCloud();

    // Fast 2.5-second live polling interval
    const interval = setInterval(syncFromCloud, 2500);

    return () => {
      isMounted = false;
      unsubscribe();
      clearInterval(interval);
    };
  }, [requestId]);

  if (!request) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center mx-auto text-red-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Tow Request Not Found</h2>
          <p className="text-xs text-slate-600">
            Could not find an active request with ID <strong className="text-slate-900 font-mono">&quot;{requestId}&quot;</strong>.
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
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
              <button
                type="submit"
                className="w-full bg-sky-600 text-white font-medium py-2 rounded-lg text-xs hover:bg-sky-700 transition"
              >
                Search Again
              </button>
            </form>
          </div>
          <button
            onClick={onBackToHome}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto pt-2"
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
      desc: 'Vehicle confirmed & dispatch approved'
    },
    {
      key: 'driver_accepted',
      label: 'Assigned to Truck',
      desc: 'Driver accepted job'
    },
    {
      key: 'en_route',
      label: 'Driver En Route',
      desc: 'Tow truck heading to pickup'
    },
    {
      key: 'arrived_pickup',
      label: 'Arrived at Pickup',
      desc: 'Truck is on site with skates ready'
    },
    {
      key: 'in_transit',
      label: 'EV Loaded & In Transit',
      desc: 'Secured on flatbed, moving to destination'
    },
    {
      key: 'completed',
      label: 'Rescue Completed',
      desc: 'Safely delivered to destination'
    }
  ];

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
      type: 'truck'
    });
  }

  return (
    <div className="py-8 lg:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Navigation & Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Tracking Reference:</span>
          <span className="font-mono text-sm font-bold px-3 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
            {request.id}
          </span>
        </div>
      </div>

      {/* Main Alert Banner for Current State */}
      {isDeclined ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-900 flex items-start gap-4">
          <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-red-900">Tow Request Declined by Dispatcher</h3>
            <p className="text-xs text-slate-700">
              Reason: <strong className="text-red-800">{request.rejectionReason || 'Unable to service'}</strong>
            </p>
            {request.rejectionNotes && (
              <p className="text-xs text-slate-600 mt-1">
                Owner Note: {request.rejectionNotes}
              </p>
            )}
            <p className="text-xs text-slate-600 pt-1">
              If this was a misunderstanding, please call our 24/7 helpline at{' '}
              <a href={`tel:${BASE_GARAGE.phone}`} className="text-sky-700 font-bold underline">
                {BASE_GARAGE.phone}
              </a>.
            </p>
          </div>
        </div>
      ) : request.status === 'pending_verification' ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-950 flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5 animate-spin" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Step 1: Awaiting Owner Verification Call</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Our dispatch owner will ring your mobile (<strong className="text-slate-900 font-mono">{request.customerPhone}</strong>) within <strong className="text-amber-800">2 minutes</strong> to confirm your vehicle state and exact location before dispatching the truck.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs">
              <span className="text-slate-500">Keep your phone line free.</span>
              <a href={`tel:${BASE_GARAGE.phone}`} className="text-sky-700 underline font-medium">
                Or Tap to Call Dispatch Directly
              </a>
            </div>
          </div>
        </div>
      ) : request.status === 'completed' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-950 flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Rescue Completed Successfully!</h3>
            <p className="text-xs sm:text-sm text-slate-700">
              Your {request.vehicle.makeModel} has been delivered safely to {request.dropoffLocation.name}.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-sky-700 font-semibold uppercase tracking-wider block">
                {request.status === 'verified_approved' ? 'Call Approved - Dispatching Driver' :
                 request.status === 'driver_accepted' ? 'Driver Confirmed Job' :
                 request.status === 'en_route' ? 'Tow Truck En Route' :
                 request.status === 'arrived_pickup' ? 'Tow Truck Arrived at Pickup' :
                 'Vehicle Loaded & In Transit'}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {request.assignedDriverName ? `Driver: ${request.assignedDriverName}` : 'Mahadev Hydraulic Flatbed'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Estimated Arrival</span>
              <span className="text-xl font-bold text-sky-700 font-mono">
                {request.etaMinutes ? `~${request.etaMinutes} mins` : 'Calculating...'}
              </span>
            </div>

            {request.assignedDriverPhone && (
              <a
                href={`tel:${request.assignedDriverPhone}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Driver</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* 7-Step Progression Stepper */}
      {!isDeclined && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-5">
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
                        className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${
                          idx < currentStepIdx ? 'bg-sky-600' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                        isPassed
                          ? 'bg-sky-600 border-sky-600 text-white'
                          : isCurrent
                          ? 'bg-white border-sky-600 text-sky-700 ring-2 ring-sky-100'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    {/* Label */}
                    <div className="mt-2.5">
                      <p
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-sky-700' : isPassed ? 'text-slate-800' : 'text-slate-400'
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
            <div className="lg:hidden space-y-2.5">
              {steps.map((s, idx) => {
                const isPassed = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={s.key}
                    className={`flex items-start gap-3 p-2 rounded-lg transition ${
                      isCurrent ? 'bg-sky-50/70 border border-sky-200' : ''
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                        isPassed
                          ? 'bg-sky-600 border-sky-600 text-white'
                          : isCurrent
                          ? 'bg-white border-sky-600 text-sky-700'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-sky-700' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                        {s.label}
                      </p>
                      <p className="text-[11px] text-slate-500">{s.desc}</p>
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
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-sky-600" />
              Live Route & GPS Telemetry
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Status: {request.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          <div className="h-[360px] rounded-lg overflow-hidden border border-slate-200">
            <LeafletMap
              markers={markers}
              center={[request.pickupLocation.lat, request.pickupLocation.lng]}
              zoom={13}
              showRoute={true}
              className="h-full w-full"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Your EV (Pickup)
            </span>
            {request.driverLiveLocation && (
              <span className="flex items-center gap-1.5 text-sky-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> Tow Truck (Moving)
              </span>
            )}
            <span className="text-slate-400">Updates live</span>
          </div>
        </div>

        {/* Right Column: Driver & Vehicle Specs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Assigned Driver Card */}
          {request.assignedDriverName || request.assignedDriverPhone ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Assigned Recovery Driver
                </h4>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  Flatbed Driver
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-base">
                  {(request.assignedDriverName || 'D')[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{request.assignedDriverName || 'Assigned Driver'}</h4>
                  <p className="text-xs text-slate-500">Mahadev Flatbed Driver</p>
                  {request.assignedDriverPhone && (
                    <p className="text-xs text-slate-700 font-mono font-medium">{request.assignedDriverPhone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                {request.assignedDriverPhone ? (
                  <a
                    href={`tel:${request.assignedDriverPhone}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Driver</span>
                  </a>
                ) : (
                  <a
                    href={`tel:${BASE_GARAGE.phone}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Dispatch</span>
                  </a>
                )}

                <a
                  href={`tel:${BASE_GARAGE.phone}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition border border-slate-200"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                  <span>HQ: 9912324247</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-center space-y-2 shadow-sm">
              <Truck className="w-7 h-7 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Driver Assignment in Progress</h4>
              <p className="text-xs text-slate-500">
                Our central dispatch is assigning a recovery driver. For immediate updates, contact dispatch at <strong className="text-slate-800">9912324247</strong>.
              </p>
            </div>
          )}

          {/* Job Details Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-500 text-xs pb-2 border-b border-slate-100">
              Trip Details
            </h4>

            <div className="space-y-2 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Vehicle:</span>
                <span className="text-slate-900 font-semibold">{request.vehicle.makeModel}</span>
                {request.vehicle.regNumber && (
                  <span className="text-slate-500 font-mono ml-2">({request.vehicle.regNumber})</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Reported Issue:</span>
                <span className="text-amber-800 font-medium">{request.issueType}</span>
                {request.issueDescription && (
                  <p className="text-slate-500 text-[11px] mt-0.5">{request.issueDescription}</p>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Pickup Location:</span>
                <span className="text-slate-800">{request.pickupLocation.address}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Drop-off Destination:</span>
                <span className="text-slate-800">{request.dropoffLocation.name} - {request.dropoffLocation.address}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
