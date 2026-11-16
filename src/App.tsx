import React, { useState, useEffect } from 'react';
import { ActiveAppView, TowRequest, WebsiteLayoutId } from './types';
import { store } from './services/store';
import { LayoutSwitcher } from './components/common/LayoutSwitcher';
import { EmergencyBar } from './components/common/EmergencyBar';
import { Navbar } from './components/common/Navbar';
import { ViewSwitcher } from './components/common/ViewSwitcher';
import { Footer } from './components/common/Footer';
import { ClassicLayout } from './components/layouts/ClassicLayout';
import { ModernAppLayout } from './components/layouts/ModernAppLayout';
import { AutoClubLayout } from './components/layouts/AutoClubLayout';
import { EmergencySosLayout } from './components/layouts/EmergencySosLayout';
import { TrackingView } from './components/customer/TrackingView';
import { FloatingContactBar } from './components/common/FloatingContactBar';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { DriverPortal } from './components/driver/DriverPortal';

export function App() {
  const [currentView, setCurrentView] = useState<ActiveAppView>('customer');
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<string>('TRUCK-01');
  const [prefillLocation, setPrefillLocation] = useState<{ address: string; landmark?: string } | null>(null);
  const [showDevSwitcher, setShowDevSwitcher] = useState<boolean>(false);
  const [websiteLayout, setWebsiteLayout] = useState<WebsiteLayoutId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('voltrescue_ui_layout') as WebsiteLayoutId;
      if (saved && ['classic', 'modern-app', 'auto-club', 'emergency-sos'].includes(saved)) {
        return saved;
      }
    }
    return 'classic';
  });

  const handleSelectLayout = (layout: WebsiteLayoutId) => {
    setWebsiteLayout(layout);
    if (typeof window !== 'undefined') {
      localStorage.setItem('voltrescue_ui_layout', layout);
    }
  };

  // Listen to hash / URL parameters if accessed directly (e.g. ?view=owner or ?view=driver or ?track=VT-8492 or ?debug=true or ?layout=modern-app)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const trackParam = params.get('track') || params.get('id');
    const debugParam = params.get('debug') === 'true';
    const layoutParam = params.get('layout') as WebsiteLayoutId;

    if (debugParam) setShowDevSwitcher(true);

    if (layoutParam && ['classic', 'modern-app', 'auto-club', 'emergency-sos'].includes(layoutParam)) {
      setWebsiteLayout(layoutParam);
      localStorage.setItem('voltrescue_ui_layout', layoutParam);
    }

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
      
      {/* 0. Multi-UI Layout Switcher (Allows picking from 4 distinct designs) */}
      <LayoutSwitcher
        currentLayout={websiteLayout}
        onSelectLayout={handleSelectLayout}
      />

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
              // 4 Distinct Website UI Layouts
              <div>
                {websiteLayout === 'classic' && (
                  <ClassicLayout
                    onBookingSuccess={handleBookingSuccess}
                    onTrackSearch={handleTrackSearch}
                    onScrollToBooking={handleScrollToBooking}
                    onOpenWhyFlatbed={handleOpenWhyFlatbed}
                    onSelectCoverageArea={handleSelectCoverageArea}
                    prefillLocation={prefillLocation}
                  />
                )}

                {websiteLayout === 'modern-app' && (
                  <ModernAppLayout
                    onBookingSuccess={handleBookingSuccess}
                    onTrackSearch={handleTrackSearch}
                    onScrollToBooking={handleScrollToBooking}
                  />
                )}

                {websiteLayout === 'auto-club' && (
                  <AutoClubLayout
                    onBookingSuccess={handleBookingSuccess}
                    onTrackSearch={handleTrackSearch}
                    onScrollToBooking={handleScrollToBooking}
                  />
                )}

                {websiteLayout === 'emergency-sos' && (
                  <EmergencySosLayout
                    onBookingSuccess={handleBookingSuccess}
                    onTrackSearch={handleTrackSearch}
                    onScrollToBooking={handleScrollToBooking}
                  />
                )}
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
