import React, { useState, useEffect } from 'react';
import { ActiveAppView, TowRequest } from './types';
import { store } from './services/store';
import { EmergencyBar } from './components/common/EmergencyBar';
import { Navbar } from './components/common/Navbar';
import { ViewSwitcher } from './components/common/ViewSwitcher';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/customer/HeroSection';
import { ServicesSection } from './components/customer/ServicesSection';
import { BookingForm } from './components/customer/BookingForm';
import { TrackingTicketLookup } from './components/customer/TrackingTicketLookup';
import { TrackingView } from './components/customer/TrackingView';
import { ReviewsSection } from './components/customer/ReviewsSection';
import { EVWhyFlatbed } from './components/customer/EVWhyFlatbed';
import { RescueGallery } from './components/customer/RescueGallery';
import { FleetGallery } from './components/customer/FleetGallery';
import { HyderabadCoverage } from './components/customer/HyderabadCoverage';
import { FloatingContactBar } from './components/common/FloatingContactBar';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { DriverPortal } from './components/driver/DriverPortal';

export function App() {
  const [currentView, setCurrentView] = useState<ActiveAppView>('customer');
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<string>('TRUCK-01');
  const [prefillLocation, setPrefillLocation] = useState<{ address: string; landmark?: string } | null>(null);
  const [showDevSwitcher, setShowDevSwitcher] = useState<boolean>(false);

  // Listen to hash / URL parameters if accessed directly (e.g. ?view=owner or ?view=driver or ?track=VT-8492 or ?debug=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const trackParam = params.get('track') || params.get('id');
    const debugParam = params.get('debug') === 'true';

    if (debugParam) setShowDevSwitcher(true);

    if (viewParam === 'owner') setCurrentView('owner');
    else if (viewParam === 'driver') setCurrentView('driver');
    else if (viewParam === 'customer') setCurrentView('customer');

    if (trackParam) {
      setTrackingId(trackParam);
      setCurrentView('customer');
    }
  }, []);

  const handleTrackSearch = (query: string) => {
    const found = store.findRequest(query);
    if (found) {
      setTrackingId(found.id);
      setCurrentView('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Try using the query directly as an ID
      setTrackingId(query.trim().toUpperCase());
      setCurrentView('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookingSuccess = (newRequest: TowRequest) => {
    setTrackingId(newRequest.id);
    setCurrentView('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToBooking = () => {
    setTrackingId(null);
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCoverageArea = (areaName: string, landmark: string) => {
    setPrefillLocation({
      address: `${areaName}, Hyderabad, Telangana`,
      landmark: landmark
    });
    handleScrollToBooking();
  };

  const handleOpenWhyFlatbed = () => {
    setTrackingId(null);
    const el = document.getElementById('why-flatbed');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* 1. Sticky Emergency Contact Bar */}
      <EmergencyBar />

      {/* 2. Global Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          if (v !== 'customer') setTrackingId(null);
        }}
        onTrackSearch={handleTrackSearch}
        onNavigateHome={() => {
          setCurrentView('customer');
          setTrackingId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 3. Main Views Container */}
      <main className="flex-1">
        
        {/* VIEW 1: CUSTOMER VIEW */}
        {currentView === 'customer' && (
          <div>
            {trackingId ? (
              // Live Request Tracking Screen
              <TrackingView
                requestId={trackingId}
                onBackToHome={() => setTrackingId(null)}
                onTrackSearch={handleTrackSearch}
              />
            ) : (
              // Customer Landing Page with Booking Form & Reviews
              <div>
                <HeroSection
                  onScrollToBooking={handleScrollToBooking}
                  onTrackSearch={handleTrackSearch}
                  onOpenWhyFlatbed={handleOpenWhyFlatbed}
                />

                {/* Services Section with 25 in Large Recognisable Format & 100+ Rescues text */}
                <ServicesSection onScrollToBooking={handleScrollToBooking} />

                {/* Request Booking UP */}
                <BookingForm
                  onBookingSuccess={handleBookingSuccess}
                  initialLocation={prefillLocation}
                />

                {/* Tracking Ticket BELOW Request Booking */}
                <TrackingTicketLookup onTrackSearch={handleTrackSearch} />

                <EVWhyFlatbed />

                <FleetGallery />

                <HyderabadCoverage onSelectArea={handleSelectCoverageArea} />

                <RescueGallery onSelectBookNow={handleScrollToBooking} />

                <ReviewsSection isOwnerMode={false} />
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: OWNER / DISPATCHER DASHBOARD (PIN PROTECTED 1234) */}
        {currentView === 'owner' && (
          <OwnerDashboard
            onSelectRequestForTracking={(id) => {
              setTrackingId(id);
              setCurrentView('customer');
            }}
            onOpenDriverPortal={(truckId) => {
              setSelectedTruckId(truckId);
              setCurrentView('driver');
            }}
          />
        )}

        {/* VIEW 3: TOW TRUCK DRIVER VIEW */}
        {currentView === 'driver' && (
          <DriverPortal
            selectedTruckId={selectedTruckId}
            onSelectTruckId={setSelectedTruckId}
          />
        )}

      </main>

      {/* 4. Global Contact Section & Footer */}
      <Footer />

      {/* 5. Persistent Quick Emergency Dial & WhatsApp Dock */}
      <FloatingContactBar />

      {/* 6. Persistent Role Switcher Dock (Hidden by default, visible only with ?debug=true) */}
      {showDevSwitcher && (
        <ViewSwitcher
          currentView={currentView}
          onViewChange={(v) => {
            setCurrentView(v);
            if (v !== 'customer') setTrackingId(null);
          }}
          selectedTruckId={selectedTruckId}
          onSelectTruckId={setSelectedTruckId}
          onOpenTrackId={(id) => {
            setTrackingId(id);
            setCurrentView('customer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

    </div>
  );
}

export default App;
