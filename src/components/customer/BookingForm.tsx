import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { reverseGeocode, fetchIpLocation } from '../../services/geocoding';
import { LeafletMap } from '../common/LeafletMap';
import { TowRequest, IssueType, VehicleCategory } from '../../types';
import confetti from 'canvas-confetti';
import { 
  Navigation, 
  PhoneCall, 
  AlertCircle, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ShieldAlert, 
  Compass, 
  RotateCcw, 
  MapPin, 
  LocateFixed,
  Car,
  Truck,
  Sparkles
} from 'lucide-react';

interface BookingFormProps {
  onBookingSuccess: (newRequest: TowRequest) => void;
  initialLocation?: { address: string; landmark?: string } | null;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onBookingSuccess, initialLocation }) => {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Location
  const [pickupAddress, setPickupAddress] = useState('Sector XX, Main Highway Road, City - XXXXXX');
  const [pickupLat, setPickupLat] = useState(12.9538);
  const [pickupLng, setPickupLng] = useState(77.6980);
  const [landmark, setLandmark] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [pointDropped, setPointDropped] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);

  // Vehicle & Issue
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('Luxury Vehicle');
  const [vehicleModelInput, setVehicleModelInput] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('Accident Car Towing');
  const [issueDescription, setIssueDescription] = useState('');
  const [wheelLock, setWheelLock] = useState(true);
  const [urgency] = useState<TowRequest['urgency']>('Emergency (High Priority)');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dual-tier location detector: High-Accuracy GPS with Instant Network/IP Fallback
  const detectCurrentLocation = (silent: boolean = false) => {
    if (!silent) setIsLocating(true);
    setErrorMsg('');

    const applyCoords = async (lat: number, lng: number, fallbackLabel?: string) => {
      setPickupLat(lat);
      setPickupLng(lng);
      setLocationSuccess(true);
      setPointDropped(false);
      setIsLocating(false);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastRefreshedAt(nowStr);

      const readableAddress = await reverseGeocode(lat, lng);
      setPickupAddress(readableAddress || fallbackLabel || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
    };

    const fallbackToIp = async () => {
      try {
        const ipLoc = await fetchIpLocation();
        if (ipLoc && ipLoc.lat && ipLoc.lng) {
          await applyCoords(ipLoc.lat, ipLoc.lng, ipLoc.formattedAddress);
          return;
        }
      } catch {
        // Fallback failed
      }

      setIsLocating(false);
      if (!silent) {
        setErrorMsg('Could not detect exact GPS coordinates. Please click on the map to drop your vehicle pin.');
      }
    };

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (_err) => {
          // If browser GPS is blocked, unavailable, or on desktop PC without GPS, automatically fall back to IP location!
          fallbackToIp();
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: silent ? 10000 : 0 // Force fresh reading on manual refresh
        }
      );
    } else {
      fallbackToIp();
    }
  };

  // Automatically detect user location on page load
  useEffect(() => {
    detectCurrentLocation(true);
  }, []);

  // Handle GPS One-Click / Refresh Button
  const handleRefreshLocation = () => {
    detectCurrentLocation(false);
  };

  // Handle Point Drop (either clicking map or dragging marker)
  const handlePointDrop = async (newLat: number, newLng: number) => {
    setPickupLat(newLat);
    setPickupLng(newLng);
    setLocationSuccess(true);
    setPointDropped(true);
    const readableAddress = await reverseGeocode(newLat, newLng);
    setPickupAddress(readableAddress);
  };

  // Sync external prefilled location when customer selects from Hyderabad coverage cards
  useEffect(() => {
    if (initialLocation) {
      if (initialLocation.address) setPickupAddress(initialLocation.address);
      if (initialLocation.landmark) setLandmark(initialLocation.landmark);
    }
  }, [initialLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number (+91).');
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    if (!pickupAddress.trim()) {
      setErrorMsg('Please enter or share your pickup location.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalVehicleModel = vehicleModelInput.trim() || `${vehicleCategory} (General)`;

      const created = store.createRequest({
        customerName: customerName.trim(),
        customerPhone: `+91 ${cleanPhone.slice(-10)}`,
        pickupLocation: {
          address: pickupAddress.trim(),
          lat: pickupLat,
          lng: pickupLng,
          landmark: landmark.trim() || undefined
        },
        dropoffLocation: {
          name: 'Confirmed on verification call',
          address: 'Customer destination / Nearest Service Station',
          type: 'custom'
        },
        vehicle: {
          category: vehicleCategory,
          makeModel: finalVehicleModel,
          regNumber: regNumber.trim().toUpperCase() || undefined,
          hasWheelLock: wheelLock
        },
        issueType,
        issueDescription: issueDescription.trim() || undefined,
        urgency
      });

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setIsSubmitting(false);
      onBookingSuccess(created);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not submit request. Please try calling directly.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking-section" className="py-12 lg:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 border border-sky-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-sky-600" />
            <span>Fast Assistance • No Login Required</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Book an EV Flatbed Tow Truck
          </h2>
          <p className="text-sm text-slate-600">
            Provide your breakdown details below. Our dispatcher will call you directly to verify vehicle specs and quote before dispatching.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm">
          
          {/* Dispatch Notice Alert */}
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-sky-950">
              <span className="font-bold">2-Minute Verification Call:</span>{' '}
              Our dispatch owner will call your mobile number within <strong className="text-sky-900">2 minutes</strong> to confirm your vehicle state, exact GPS pin, and upfront quote before dispatching the tow truck.
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Contact Details */}
            <div className="space-y-4">
              <h3 className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <span>Your Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Driver XXXXXX"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    10-Digit Mobile Number (+91) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-slate-500 font-mono">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="00000 00000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg pl-12 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 transition font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ✓ Dispatcher calls this number immediately to confirm quote.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: One-Click GPS Location & Interactive Map */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                    <span>Pickup Location (Live GPS)</span>
                  </h3>
                  <span className="hidden sm:inline-block text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                    Free • No API Required
                  </span>
                </div>

                {/* GPS Refresh & Share Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefreshLocation}
                    disabled={isLocating}
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg text-xs border border-slate-300 transition disabled:opacity-50"
                    title="Re-query GPS coordinates from device"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-sky-600' : 'text-slate-600'}`} />
                    <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRefreshLocation}
                    disabled={isLocating}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs shadow-sm transition disabled:opacity-50"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Detecting Coordinates...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Share My Live GPS Location</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Banner: Point Dropped vs GPS Captured */}
              {pointDropped ? (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Point dropped at: <strong className="text-slate-900">{pickupAddress}</strong> (Click anywhere to relocate pin)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshLocation}
                    disabled={isLocating}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    <RotateCcw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>Re-center GPS</span>
                  </button>
                </div>
              ) : locationSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>GPS location captured! {lastRefreshedAt ? `(Refreshed at ${lastRefreshedAt})` : ''} Tap or click anywhere on the map to drop a point.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshLocation}
                    disabled={isLocating}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    <RotateCcw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address / Highway Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Highway Exit XX, Near Landmark XXXX, Sector XX"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Landmark or Mile Marker
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Pillar XXX / Exit XX"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 transition"
                  />
                </div>
              </div>

              {/* Interactive Leaflet Map for Pickup (Supports Point Dropping & Refresh) */}
              <div>
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 mb-1.5 gap-2">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>Click anywhere on map to drop pin &bull; or drag the red marker</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {pickupLat.toFixed(4)}°N, {pickupLng.toFixed(4)}°E
                    </span>
                  </div>
                </div>

                <div className="h-72 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <LeafletMap
                    markers={[
                      {
                        lat: pickupLat,
                        lng: pickupLng,
                        title: 'Your EV Location',
                        subtitle: pickupAddress,
                        type: 'pickup',
                        draggable: true
                      }
                    ]}
                    center={[pickupLat, pickupLng]}
                    zoom={15}
                    onMarkerDragEnd={handlePointDrop}
                    onMapClick={handlePointDrop}
                    onRefreshLocation={handleRefreshLocation}
                    isRefreshing={isLocating}
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Vehicle & Issue Details */}
            <div className="space-y-4">
              <h3 className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                <span>Vehicle Type & Breakdown Details</span>
              </h3>

              {/* Vehicle Type Selector (Luxury Vehicle, Car, SUV) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Vehicle Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'Luxury Vehicle' as VehicleCategory, label: 'Luxury Vehicle', icon: Sparkles },
                      { id: 'Car' as VehicleCategory, label: 'Car / Sedan', icon: Car },
                      { id: 'SUV' as VehicleCategory, label: 'SUV / MUV', icon: Truck }
                    ]
                  ).map((cat) => {
                    const IconComponent = cat.icon;
                    const isSelected = vehicleCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setVehicleCategory(cat.id)}
                        className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
                          isSelected
                            ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600 text-sky-950 font-medium shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <IconComponent className="w-5 h-5 shrink-0" />
                        </div>
                        <span className="text-sm font-bold leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Simple Model Input (No Complicated Dropdown) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vehicle Make & Model (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter vehicle make & model (Optional)"
                    value={vehicleModelInput}
                    onChange={(e) => setVehicleModelInput(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 transition"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Selected: <strong className="text-sky-700">{vehicleCategory}</strong> • Dispatcher will confirm exact specs on call.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registration Plate Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TS-09-XX-0000"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 transition uppercase font-mono"
                  />
                </div>
              </div>

              {/* Issue Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Breakdown Reason / Service Required <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      'Accident Car Towing',
                      'Total Damage / Total Loss',
                      'Jump Start Service',
                      'Dead Battery (0% SOC)',
                      'Flat Tire / Wheel Damage',
                      'Mechanical / Drive Unit'
                    ] as IssueType[]
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIssueType(type)}
                      className={`p-3 rounded-lg border text-left transition flex items-center justify-between text-xs ${
                        issueType === type
                          ? 'bg-sky-50 border-sky-600 text-sky-900 font-semibold ring-1 ring-sky-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{type}</span>
                      {issueType === type && <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special EV Consideration: Wheel Lock */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="wheelLock"
                  checked={wheelLock}
                  onChange={(e) => setWheelLock(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <label htmlFor="wheelLock" className="text-xs text-slate-700 cursor-pointer">
                  <strong className="text-slate-900 block font-semibold">Drive wheels locked / Gear stuck in &apos;Park&apos;?</strong>
                  If checked, we dispatch a flatbed with hydraulic Go-Jack wheel skates so the car can be rolled onto the deck without forcing the electric motor.
                </label>
              </div>

              {/* Additional notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Notes for Dispatcher (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Car is in basement parking B2, or hazards are turned on..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full bg-white border border-slate-300 focus:border-sky-600 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 transition resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-base py-3.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Tow Request (Call Within 2 Mins)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500">
                No credit card required upfront. Transparent quotes confirmed verbally by phone.
              </p>
            </div>

          </form>

        </div>
      </div>
    </section>
  );
};
