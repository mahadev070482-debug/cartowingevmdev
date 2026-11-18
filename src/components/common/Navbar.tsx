import React, { useState } from 'react';
import { Zap, Phone, Search, Shield, Truck, Menu, X, ArrowRight } from 'lucide-react';
import { BASE_GARAGE } from '../../data/seedData';
import { ActiveAppView } from '../../types';

interface NavbarProps {
  currentView: ActiveAppView;
  onViewChange: (view: ActiveAppView) => void;
  onTrackSearch: (query: string) => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onTrackSearch,
  onNavigateHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onTrackSearch(searchQuery.trim());
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  const scrollToSection = (id: string) => {
    onNavigateHome();
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-4">
          
          {/* Logo */}
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-xs shrink-0">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center shrink-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  Mahadev <span className="text-sky-600">Car Towing</span>
                </span>
                <span className="bg-sky-50 text-sky-700 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-sky-200 uppercase tracking-wider whitespace-nowrap">
                  Services
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-none mt-1 whitespace-nowrap">
                24/7 Flatbed &amp; Breakdown Services
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-medium text-slate-600 whitespace-nowrap">
            <button
              onClick={() => scrollToSection('services-section')}
              className="hover:text-sky-600 transition"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('booking-section')}
              className="hover:text-sky-600 font-semibold text-slate-900 transition"
            >
              Request Tow
            </button>
            <button
              onClick={() => scrollToSection('fleet-gallery')}
              className="hidden xl:inline hover:text-sky-600 transition"
            >
              Our Fleet
            </button>
            <button
              onClick={() => scrollToSection('why-flatbed')}
              className="hover:text-sky-600 transition"
            >
              Why Flatbed?
            </button>
            <button
              onClick={() => scrollToSection('coverage-areas')}
              className="hover:text-sky-600 transition"
            >
              Coverage Hubs
            </button>
            <button
              onClick={() => scrollToSection('reviews-section')}
              className="hover:text-sky-600 transition"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="hover:text-sky-600 transition"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Quick Track Input / Button */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Track ID or Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 lg:w-40 xl:w-48 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 pl-8 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded"
                >
                  Go
                </button>
              )}
            </form>

            {/* Phone CTA */}
            <a
              href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Helpline</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
              aria-label="Track My Tow"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g. VT-8492) or Mobile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 pl-9 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-sky-600 text-white text-xs font-semibold px-3 py-1.5 rounded"
            >
              Track
            </button>
          </form>

          <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => scrollToSection('services-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Services (25+ Yrs & Rescues)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => scrollToSection('booking-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between font-bold text-sky-700"
            >
              <span>Request EV Tow</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => scrollToSection('tracking-ticket-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Track Active Ticket</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => scrollToSection('fleet-gallery')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Our Fleet (Stock Images)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => scrollToSection('why-flatbed')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Why EV Flatbed?</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => scrollToSection('coverage-areas')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Hyderabad Service Hubs</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => scrollToSection('gallery-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Rescue Gallery</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => scrollToSection('reviews-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Customer Reviews</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Service Areas & Garage Base</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <a
              href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call 24/7 Helpline: {BASE_GARAGE.phone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Track Search Modal on Mobile */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Track Your EV Tow</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  Enter Tracking ID or 10-Digit Mobile:
                </label>
                <input
                  type="text"
                  placeholder="e.g. VT-8492 or 0000000000"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
              >
                Track Status & Map
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
