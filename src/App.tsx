import React, { useState, useEffect } from 'react';
import { ActiveAppView, TowRequest } from './types';
import { store } from './services/store';
import { EmergencyBar } from './components/common/EmergencyBar';
import { Navbar } from './components/common/Navbar';
import { ViewSwitcher } from './components/common/ViewSwitcher';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/customer/HeroSection';
import { BookingForm } from './components/customer/BookingForm';
import { TrackingView } from './components/customer/TrackingView';
import { ReviewsSection } from './components/customer/ReviewsSection';
import { EVWhyFlatbed } from './components/customer/EVWhyFlatbed';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { DriverPortal } from './components/driver/DriverPortal';

export function App() {
  const [currentView, setCurrentView] = useState<ActiveAppView>('customer');
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<string>('TRUCK-01');

  // Listen to hash / URL parameters if accessed directly (e.g. ?view=owner or ?view=driver or ?track=VT-8492)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const trackParam = params.get('track') || params.get('id');

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

  const handleOpenWhyFlatbed = () => {
    setTrackingId(null);
    const el = document.getElementById('why-flatbed');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
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

                <EVWhyFlatbed />

                <BookingForm onBookingSuccess={handleBookingSuccess} />

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

      {/* 5. Persistent Role Switcher Dock (3-in-1 Quick Switcher) */}
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

    </div>
  );
}

export default App;
