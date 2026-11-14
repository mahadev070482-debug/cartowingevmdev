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
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-10 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-6 h-6 text-slate-950 fill-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-sans">
                  VOLT<span className="text-cyan-400">RESCUE</span>
                </span>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-cyan-400/30">
                  EV ONLY
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 tracking-wide font-medium">
                100% Zero-Drag Flatbed Assistance
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('booking-section')}
              className="hover:text-cyan-400 transition"
            >
              Request Tow
            </button>
            <button
              onClick={() => scrollToSection('why-flatbed')}
              className="hover:text-cyan-400 transition"
            >
              Why EV Flatbed?
            </button>
            <button
              onClick={() => scrollToSection('reviews-section')}
              className="hover:text-cyan-400 transition"
            >
              Verified Reviews
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="hover:text-cyan-400 transition"
            >
              Coverage & Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Track Input / Button */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Track ID (VT-...) or Phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-56 bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded"
                >
                  Go
                </button>
              )}
            </form>

            {/* Portal Direct Switches */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => onViewChange('owner')}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
                  currentView === 'owner' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title="Dispatcher & Owner Portal (PIN: 1234)"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Owner</span>
              </button>
              <button
                onClick={() => onViewChange('driver')}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
                  currentView === 'driver' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title="Tow Truck Driver Console"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Driver</span>
              </button>
            </div>

            {/* Urgent Phone CTA */}
            <a
              href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-glow-sm transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Emergency 24/7</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-slate-300 hover:text-cyan-400 bg-slate-800 rounded-lg"
              aria-label="Track My Tow"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g. VT-8492) or Mobile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-cyan-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Track
            </button>
          </form>

          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-200">
            <button
              onClick={() => scrollToSection('booking-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Request EV Tow</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => scrollToSection('why-flatbed')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Why EV Flatbed? (Critical Safety)</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => scrollToSection('reviews-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Customer Reviews</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Coverage & Garage Base</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onViewChange('owner');
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-semibold text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              <span>Owner Portal</span>
            </button>
            <button
              onClick={() => {
                onViewChange('driver');
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-semibold text-sky-400 border border-sky-500/30 flex items-center justify-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Driver Portal</span>
            </button>
          </div>
        </div>
      )}

      {/* Track Search Modal on Mobile */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base">Track Your EV Tow</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Enter Tracking ID or 10-Digit Mobile:
                </label>
                <input
                  type="text"
                  placeholder="e.g. VT-8492 or 9876511223"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition"
              >
                Search & View Live Status
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
