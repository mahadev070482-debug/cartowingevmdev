import React, { useState } from 'react';
import { store } from '../../services/store';
import { reverseGeocode } from '../../services/geocoding';
import { EV_MODELS, COMMON_EV_DROPOFFS } from '../../data/seedData';
import { LeafletMap } from '../common/LeafletMap';
import { TowRequest, IssueType } from '../../types';
import confetti from 'canvas-confetti';
import { 
  MapPin, 
  Navigation, 
  PhoneCall, 
  Car, 
  AlertCircle, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  BatteryCharging,
  Compass
} from 'lucide-react';

interface BookingFormProps {
  onBookingSuccess: (newRequest: TowRequest) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onBookingSuccess }) => {
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

  // Dropoff
  const [dropoffName, setDropoffName] = useState('Nearest Authorized EV Fast Charger Hub');
  const [dropoffAddress, setDropoffAddress] = useState('EV Fast Charging Hub, Sector XX, City - XXXXXX');
  const [dropoffType, setDropoffType] = useState<'service_center' | 'fast_charger' | 'home' | 'custom'>('fast_charger');

  // Vehicle & Issue
  const [selectedMakeModel, setSelectedMakeModel] = useState(EV_MODELS[0]);
  const [customModel, setCustomModel] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('Dead Battery (0% SOC)');
  const [issueDescription, setIssueDescription] = useState('');
  const [wheelLock, setWheelLock] = useState(true);
  const [urgency, setUrgency] = useState<TowRequest['urgency']>('Emergency (High Priority)');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle GPS One-Click
  const handleGetLiveGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setPickupLat(latitude);
        setPickupLng(longitude);
        setLocationSuccess(true);

        // Reverse geocode to get street name
        const readableAddress = await reverseGeocode(latitude, longitude);
        setPickupAddress(readableAddress);
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error or permission denied:', error.message);
        // Fallback to high-accuracy simulated city center location if in test/permission denied
        setIsLocating(false);
        setErrorMsg('Location permission was denied or timed out. You can drag the map pin or type your address manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleMarkerDragEnd = async (newLat: number, newLng: number) => {
    setPickupLat(newLat);
    setPickupLng(newLng);
    const readableAddress = await reverseGeocode(newLat, newLng);
    setPickupAddress(readableAddress);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validate phone number
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
      const finalVehicleModel = selectedMakeModel === 'Other Electric Vehicle' && customModel 
        ? customModel 
        : selectedMakeModel;

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
          name: dropoffName,
          address: dropoffAddress,
          type: dropoffType
        },
        vehicle: {
          makeModel: finalVehicleModel,
          regNumber: regNumber.trim().toUpperCase() || undefined,
          hasWheelLock: wheelLock
        },
        issueType,
        issueDescription: issueDescription.trim() || undefined,
        urgency
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
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
    <section id="booking-section" className="py-12 lg:py-20 bg-slate-900/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-cyan-400" />
            <span>Zero-Friction Emergency Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Request an EV Flatbed Tow Truck
          </h2>
          <p className="text-sm text-slate-400">
            No password or registration required. Fill in your pickup details and our dispatch owner will call you in 2 minutes.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Dispatch Notice Alert */}
          <div className="bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/40 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs sm:text-sm text-slate-200">
              <span className="font-bold text-cyan-300">Fast Call-Verification Guarantee:</span>{' '}
              Our dispatch owner will call your mobile number within <strong className="text-white">2 minutes</strong> to confirm your vehicle state, exact GPS pin, and upfront quote before dispatching the tow truck.
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Contact Details */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 text-xs font-black flex items-center justify-center">1</span>
                <span>Your Contact Details (No Login)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Driver XXXXXX"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    10-Digit Mobile Number (+91) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-sm text-slate-400 font-mono">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="00000 00000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-14 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-cyan-400/90 mt-1">
                    ✓ Owner calls this number within 120 seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: One-Click GPS Location & Interactive Map */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 text-xs font-black flex items-center justify-center">2</span>
                  <span>Pickup Location (Live GPS)</span>
                </h3>

                {/* The "Share My Live GPS Location" button */}
                <button
                  type="button"
                  onClick={handleGetLiveGPS}
                  disabled={isLocating}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Pinpointing Satellite GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 fill-slate-950" />
                      <span>Share My Live GPS Location</span>
                    </>
                  )}
                </button>
              </div>

              {locationSuccess && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>High-accuracy GPS captured! You can drag the red map pin below to fine-tune your exact curb position.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pickup Street Address / Landmark <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Highway Exit XX, Near Landmark XXXX, Sector XX"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nearby Landmark (Flyover, Mile Marker)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Pillar XXX / Exit XX"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Interactive Leaflet Map for Pickup */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    Interactive Map: Drag the red pin to adjust exact vehicle location
                  </span>
                  <span className="font-mono text-[11px] text-cyan-400">
                    {pickupLat.toFixed(4)}°N, {pickupLng.toFixed(4)}°E
                  </span>
                </div>

                <div className="h-64 rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
                  <LeafletMap
                    markers={[
                      {
                        lat: pickupLat,
                        lng: pickupLng,
                        title: 'Your Vehicle Pickup Location',
                        subtitle: pickupAddress,
                        type: 'pickup',
                        draggable: true
                      }
                    ]}
                    center={[pickupLat, pickupLng]}
                    zoom={15}
                    onMarkerDragEnd={handleMarkerDragEnd}
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Drop-off Location */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 text-xs font-black flex items-center justify-center">3</span>
                <span>Drop-off Destination</span>
              </h3>

              {/* Quick Drop-off chips */}
              <div className="flex flex-wrap gap-2">
                {COMMON_EV_DROPOFFS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDropoffName(chip.name);
                      setDropoffAddress(chip.address);
                      setDropoffType(chip.type);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                      dropoffName === chip.name
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {chip.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Destination Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Authorized Tata Service Center or Home"
                    value={dropoffName}
                    onChange={(e) => setDropoffName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Destination Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Old Airport Road, Domlur"
                    value={dropoffAddress}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Vehicle & Issue Details */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 text-xs font-black flex items-center justify-center">4</span>
                <span>EV Model & Issue Specifics</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Electric Vehicle Make & Model <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={selectedMakeModel}
                    onChange={(e) => setSelectedMakeModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                  >
                    {EV_MODELS.map((model, idx) => (
                      <option key={idx} value={model} className="bg-slate-900 text-white">
                        {model}
                      </option>
                    ))}
                  </select>

                  {selectedMakeModel === 'Other Electric Vehicle' && (
                    <input
                      type="text"
                      placeholder="Specify EV Brand & Model"
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Registration Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. XX-00-EV-XXXX"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition uppercase"
                  />
                </div>
              </div>

              {/* Issue Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  What is the issue with your EV? <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      'Dead Battery (0% SOC)',
                      'Flat Tire',
                      'Accident / Collision',
                      'Mechanical / Drive Unit',
                      '12V Auxiliary System Failure'
                    ] as IssueType[]
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIssueType(type)}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        issueType === type
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-semibold">{type}</span>
                      {issueType === type && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special EV Consideration: Wheel Lock */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="wheelLock"
                  checked={wheelLock}
                  onChange={(e) => setWheelLock(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700"
                />
                <label htmlFor="wheelLock" className="text-xs text-slate-300 cursor-pointer">
                  <strong className="text-white block font-semibold">Drive wheels locked / Vehicle stuck in &apos;Park&apos;?</strong>
                  If checked, we dispatch a flatbed equipped with hydraulic Go-Jack wheel skates so your car can be loaded without dragging the locked motor.
                </label>
              </div>

              {/* Additional notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Additional Notes for Dispatcher (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Car is in basement parking B2, or car is in middle lane with hazards on..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-base sm:text-lg py-4 rounded-2xl shadow-glow-blue transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-slate-950" />
                    <span>Submit EV Tow Request (Call Within 2 Mins)</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                🔒 No credit card required upfront. Transparent quotes confirmed verbally by phone.
              </p>
            </div>

          </form>

        </div>
      </div>
    </section>
  );
};
