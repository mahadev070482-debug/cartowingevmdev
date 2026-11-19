import React, { useRef, useState } from 'react';
import { BASE_GARAGE } from '../../data/seedData';
import { 
  Play, 
  Pause, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  ArrowRight,
  Sparkles,
  Zap,
  Film,
  Smartphone
} from 'lucide-react';

interface VideoShowcaseProps {
  onScrollToBooking?: () => void;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({ onScrollToBooking }) => {
  const [activeTab, setActiveTab] = useState<'video1' | 'video2'>('video1');
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);

  const [isPlaying1, setIsPlaying1] = useState(true);
  const [isPlaying2, setIsPlaying2] = useState(false);

  const handleSelectTab = (tab: 'video1' | 'video2') => {
    setActiveTab(tab);
    if (tab === 'video1') {
      if (video2Ref.current) {
        video2Ref.current.pause();
        setIsPlaying2(false);
      }
      if (video1Ref.current) {
        video1Ref.current.play().catch(() => {});
        setIsPlaying1(true);
      }
    } else {
      if (video1Ref.current) {
        video1Ref.current.pause();
        setIsPlaying1(false);
      }
      if (video2Ref.current) {
        video2Ref.current.play().catch(() => {});
        setIsPlaying2(true);
      }
    }
  };

  const togglePlayActive = () => {
    if (activeTab === 'video1') {
      if (!video1Ref.current) return;
      if (isPlaying1) {
        video1Ref.current.pause();
        setIsPlaying1(false);
      } else {
        video1Ref.current.play().catch(() => {});
        setIsPlaying1(true);
      }
    } else {
      if (!video2Ref.current) return;
      if (isPlaying2) {
        video2Ref.current.pause();
        setIsPlaying2(false);
      } else {
        video2Ref.current.play().catch(() => {});
        setIsPlaying2(true);
      }
    }
  };

  const handleBookClick = () => {
    if (onScrollToBooking) {
      onScrollToBooking();
    } else {
      const el = document.getElementById('booking-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isCurrentPlaying = activeTab === 'video1' ? isPlaying1 : isPlaying2;

  return (
    <section id="video-showcase" className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      
      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Recovery In Action • 2 Live Videos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            See Zero-Degree Flatbed Recovery Live
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Watch authentic on-site recovery footage of our hydraulic zero-degree flatbeds in action. Zero ground friction, zero bumper scrape, and complete high-voltage motor protection.
          </p>

          {/* Video Selector Tabs (Desktop & Mobile accessible) */}
          <div className="pt-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => handleSelectTab('video1')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border ${
                activeTab === 'video1'
                  ? 'bg-sky-600 text-white border-sky-400 shadow-lg shadow-sky-600/30'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>Video 1: 0° Night Recovery</span>
            </button>

            <button
              onClick={() => handleSelectTab('video2')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border ${
                activeTab === 'video2'
                  ? 'bg-sky-600 text-white border-sky-400 shadow-lg shadow-sky-600/30'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>Video 2: Full Flatbed Operation</span>
            </button>
          </div>
        </div>

        {/* Video + Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Dynamic Video Player Container (5-6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Active Video Player Box */}
            <div className={`w-full transition-all duration-300 ${activeTab === 'video1' ? 'max-w-[340px]' : 'max-w-[540px]'}`}>
              
              {/* Outer Phone / Cinema Frame */}
              <div className="relative rounded-3xl p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-slate-700/80 shadow-2xl shadow-sky-950/50">
                
                {/* Top Notch Bar for vertical reel view */}
                {activeTab === 'video1' && (
                  <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2.5 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-800" />
                    <span className="w-8 h-1.5 rounded-full bg-slate-800" />
                  </div>
                )}

                {/* Video Container */}
                <div className={`relative rounded-2xl overflow-hidden bg-slate-900 shadow-inner group ${
                  activeTab === 'video1' ? 'aspect-[9/16]' : 'aspect-[16/9]'
                }`}>
                  
                  {/* Video 1 (Vertical 9:16) */}
                  <video
                    ref={video1Ref}
                    src="/videos/mahadev-flatbed-recovery.mp4"
                    playsInline
                    autoPlay
                    loop
                    muted
                    controls={false}
                    className={`w-full h-full object-cover cursor-pointer ${activeTab === 'video1' ? 'block' : 'hidden'}`}
                    onClick={togglePlayActive}
                  />

                  {/* Video 2 (Widescreen 16:9) */}
                  <video
                    ref={video2Ref}
                    src="/videos/mahadev-flatbed-loading-operation.mp4"
                    playsInline
                    loop
                    muted
                    controls={false}
                    className={`w-full h-full object-cover cursor-pointer ${activeTab === 'video2' ? 'block' : 'hidden'}`}
                    onClick={togglePlayActive}
                  />

                  {/* Top Live Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{activeTab === 'video1' ? 'NIGHT RESCUE' : 'FULL RECOVERY OPERATION'}</span>
                    </div>
                    <span className="bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold px-2 py-1 rounded-md border border-amber-500/30">
                      HYDERABAD
                    </span>
                  </div>

                  {/* Center Big Play Button (when paused) */}
                  {!isCurrentPlaying && (
                    <div 
                      onClick={togglePlayActive}
                      className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg transition transform hover:scale-105">
                        <Play className="w-8 h-8 fill-current ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Video Controls Overlay - Minimalist Play / Pause */}
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                    <button
                      onClick={togglePlayActive}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                      title={isCurrentPlaying ? "Pause Video" : "Play Video"}
                    >
                      {isCurrentPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span className="text-[10px]">{isCurrentPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                  </div>

                </div>

                {/* Bottom Notch Bar for vertical reel view */}
                {activeTab === 'video1' && (
                  <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2.5" />
                )}
              </div>

            </div>

            {/* Sub-Switch / Thumbnail Cards (Visible on Both Desktop & Mobile) */}
            <div className="w-full max-w-[540px] grid grid-cols-2 gap-2.5 mt-4">
              
              <button
                onClick={() => handleSelectTab('video1')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'video1'
                    ? 'bg-sky-950/60 border-sky-500 shadow-xs'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-400'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-sky-900/50 border border-sky-500/40 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">Video 1: Night Rescue</div>
                  <div className="text-[10px] text-slate-400">Zero-Degree Recovery</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('video2')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'video2'
                    ? 'bg-sky-950/60 border-sky-500 shadow-xs'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-400'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-amber-900/50 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Film className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">Video 2: Full Operation</div>
                  <div className="text-[10px] text-slate-400">Hydraulic Winch Loading</div>
                </div>
              </button>

            </div>

          </div>

          {/* Right: Technical Features & Instant Booking (6 Cols) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
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
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request EV Flatbed</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call: {BASE_GARAGE.phone}</span>
              </a>

              <a
                href={`https://wa.me/${BASE_GARAGE.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Dispatch%2C%20I%20saw%20your%20flatbed%20recovery%20video%20and%20need%20assistance%20in%20Hyderabad`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
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