import React, { useRef, useState } from 'react';
import { BASE_GARAGE } from '../../data/seedData';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

interface VideoShowcaseProps {
  onScrollToBooking?: () => void;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({ onScrollToBooking }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleBookClick = () => {
    if (onScrollToBooking) {
      onScrollToBooking();
    } else {
      const el = document.getElementById('booking-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="video-showcase" className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      
      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Recovery In Action • Hyderabad</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            See Zero-Degree Flatbed Recovery Live
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Watch real on-site night recovery footage of our hydraulic zero-degree flatbed in action. Zero pavement friction, zero bumper scrape, and 100% drive motor protection.
          </p>
        </div>

        {/* Video + Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Smartphone-Styled Video Player Container (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] rounded-3xl p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-slate-700/80 shadow-2xl shadow-sky-950/50">
              
              {/* Speaker / Camera Notch Mockup */}
              <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2.5 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-800" />
                <span className="w-8 h-1.5 rounded-full bg-slate-800" />
              </div>

              {/* Video Player Box */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[9/16] shadow-inner group">
                <video
                  ref={videoRef}
                  src="/videos/mahadev-flatbed-recovery.mp4"
                  playsInline
                  autoPlay
                  loop
                  muted={isMuted}
                  controls={false}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={togglePlay}
                />

                {/* Top Live Badges Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>ON-DUTY RESCUE</span>
                  </div>
                  <span className="bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold px-2 py-1 rounded-md border border-amber-500/30">
                    HYDERABAD
                  </span>
                </div>

                {/* Center Big Play Button (when paused) */}
                {!isPlaying && (
                  <div 
                    onClick={togglePlay}
                    className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg transition transform hover:scale-105">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>
                )}

                {/* Bottom Video Controls Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                      title={isPlaying ? "Pause Video" : "Play Video"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                      title={isMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium">
                    Mahadev Flatbed Fleet
                  </span>
                </div>

              </div>

              {/* Bottom Phone Bar Pill */}
              <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2.5" />
            </div>
          </div>

          {/* Right: Technical Features & Instant Booking (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                Hydraulic Engineering
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Why 0-Degree Ground Flatbed is the Gold Standard for Luxury &amp; EV Cars
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Standard hook-and-chain towing drags vehicle wheels against the pavement, risking permanent inverter burnout, transmission lock, and bumper scrapes. Our hydraulic flatbed slides fully flush to the road for completely roll-free loading.
              </p>
            </div>

            {/* Checklist of 4 Key Safeguards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Ground-Level 0° Transition</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Platform tilts flat to asphalt so low sports cars and luxury sedans never scrape front splitters or exhaust pipes.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Soft Rim Webbing Only</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  We use non-scratch synthetic wheel straps and dollies. Chains never touch your alloy wheels, suspension, or paint.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>EV Battery &amp; Motor Safety</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Both axles remain stationary on the deck, eliminating high-voltage regeneration heat that destroys electric drivetrains.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>24/7 Night Highway Dispatch</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Equipped with high-lumen LED floods and amber safety beacons for rapid recoveries across ORR, Gachibowli &amp; Airport corridors.
                </p>
              </div>

            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleBookClick}
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2"
              >
                <span>Request EV Flatbed</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call: {BASE_GARAGE.phone}</span>
              </a>

              <a
                href={`https://wa.me/${BASE_GARAGE.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Dispatch%2C%20I%20saw%20your%20flatbed%20recovery%20video%20and%20need%20assistance%20in%20Hyderabad`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
