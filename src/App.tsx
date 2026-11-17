import React, { useState, useEffect } from 'react';
import { ActiveAppView, TowRequest } from './types';
import { store } from './services/store';
import { EmergencyBar } from './components/common/EmergencyBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ClassicLayout } from './components/layouts/ClassicLayout';
import { TrackingView } from './components/customer/TrackingView';
import { FloatingContactBar } from './components/common/FloatingContactBar';
import { OwnerDashboard } from './components/owner/OwnerDashboard';

export function App() {
  const [currentView, setCurrentView] = useState<ActiveAppView>('customer');
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [prefillLocation, setPrefillLocation] = useState<{ address: string; landmark?: string } | null>(null);

  // Private owner routing check: hidden behind designated URLs/parameters
  const checkIsOwnerRoute = () => {
    const pathname = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const ownerPaths = ['/admin', '/owner', '/owner-portal', '/dispatch'];
    const hasOwnerPath = ownerPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
    const hasOwnerParam = 
      params.get('portal') === 'admin' ||
      params.get('portal') === 'owner' ||
      params.get('admin') === 'true' ||
      params.get('secret') === 'owner' ||
      params.get('view') === 'owner';
    return hasOwnerPath || hasOwnerParam;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trackParam = params.get('track') || params.get('id');

    if (trackParam) {
      setTrackingId(trackParam);
      setCurrentView('customer');
      return;
    }

    if (checkIsOwnerRoute()) {
      setCurrentView('owner');
    } else {
      setCurrentView('customer');
    }

    // Listen to popstate (back/forward navigation)
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const t = p.get('track') || p.get('id');
      if (t) {
        setTrackingId(t);
        setCurrentView('customer');
      } else if (checkIsOwnerRoute()) {
        setCurrentView('owner');
      } else {
        setCurrentView('customer');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTrackSearch = (query: string) => {
    const found = store.findRequest(query);
    if (found) {
      setTrackingId(found.id);
      setCurrentView('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
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

  const handleExitToCustomerSite = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      window.location.href = '/';
    }
    setCurrentView('customer');
    setTrackingId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          handleExitToCustomerSite();
        }}
      />

      {/* 3. Main Views Container */}
      <main className="flex-1">
        
        {/* VIEW 1: CUSTOMER VIEW (UI 1: Classic Clean Layout) */}
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
              // Confirmed UI: Classic Clean Layout
              <ClassicLayout
                onBookingSuccess={handleBookingSuccess}
                onTrackSearch={handleTrackSearch}
                onScrollToBooking={handleScrollToBooking}
                onOpenWhyFlatbed={handleOpenWhyFlatbed}
                onSelectCoverageArea={handleSelectCoverageArea}
                prefillLocation={prefillLocation}
              />
            )}
          </div>
        )}

        {/* VIEW 2: OWNER / DISPATCHER DASHBOARD (PIN PROTECTED 1234, HIDDEN BEHIND /admin or ?portal=admin) */}
        {currentView === 'owner' && (
          <OwnerDashboard
            onSelectRequestForTracking={(id) => {
              setTrackingId(id);
              setCurrentView('customer');
            }}
            onExitToCustomerSite={handleExitToCustomerSite}
          />
        )}

      </main>

      {/* 4. Global Contact Section & Footer */}
      <Footer />

      {/* 5. Persistent Quick Emergency Dial & WhatsApp Dock */}
      <FloatingContactBar />

    </div>
  );
}

export default App;
