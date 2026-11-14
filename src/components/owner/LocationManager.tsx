import React, { useState } from 'react';
import { store } from '../../services/store';
import { ServiceableLocation } from '../../types';
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Shield,
  Search,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const LocationManager: React.FC = () => {
  const [locations, setLocations] = useState<ServiceableLocation[]>(store.getServiceableLocations());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [zone, setZone] = useState('Cyberabad IT Corridor');
  const [hubLandmark, setHubLandmark] = useState('');
  const [pincodesInput, setPincodesInput] = useState('');
  const [avgResponseMins, setAvgResponseMins] = useState(15);
  const [standbyTruck, setStandbyTruck] = useState('Truck #01 (Tilt-Bed)');
  const [priorityHub, setPriorityHub] = useState(false);

  const refreshLocations = () => {
    setLocations([...store.getServiceableLocations()]);
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const pincodes = pincodesInput
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    store.addServiceableLocation({
      name: name.trim(),
      zone: zone.trim() || 'Hyderabad Metro Zone',
      hubLandmark: hubLandmark.trim() || 'Central Roadway Hub',
      pincodes: pincodes.length > 0 ? pincodes : ['500001'],
      avgResponseMins: Number(avgResponseMins) || 15,
      standbyTruck: standbyTruck || 'Truck #01 (Tilt-Bed)',
      isActive: true,
      priorityHub
    });

    refreshLocations();
    setName('');
    setHubLandmark('');
    setPincodesInput('');
    setShowAddForm(false);
    setSuccessMsg(`Added "${name}" to active serviceable coverage!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleToggle = (id: string) => {
    store.toggleServiceableLocation(id);
    refreshLocations();
  };

  const handleDelete = (id: string, locationName: string) => {
    if (window.confirm(`Are you sure you want to remove "${locationName}" from serviceable locations?`)) {
      store.removeServiceableLocation(id);
      refreshLocations();
    }
  };

  const filteredLocations = locations.filter(loc => {
    const q = searchQuery.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.zone.toLowerCase().includes(q) ||
      loc.hubLandmark.toLowerCase().includes(q) ||
      loc.pincodes.some(p => p.includes(q))
    );
  });

  const activeCount = locations.filter(l => l.isActive).length;

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Serviceable Locations & Corridors (Hyderabad)
            </h2>
            <span className="bg-sky-50 text-sky-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
              {activeCount} Active Hubs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Locations managed here are displayed publicly on the landing page and indexed for Google Search rankings in Hyderabad.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add New Serviceable Area'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add New Location Collapsible Form */}
      {showAddForm && (
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-5 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <MapPin className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Register New Serviceable Hyderabad Locality</h3>
          </div>

          <form onSubmit={handleAddLocation} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area / Corridors Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kokapet & Financial District Phase 2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Zone / Region Classification
              </label>
              <input
                type="text"
                placeholder="e.g. Cyberabad West Corridor"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Key Hub / Highway Landmark
              </label>
              <input
                type="text"
                placeholder="e.g. Near Neopolis Toll & ORR Exit 1"
                value={hubLandmark}
                onChange={(e) => setHubLandmark(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Covered Pincode(s) (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. 500075, 500032"
                value={pincodesInput}
                onChange={(e) => setPincodesInput(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Average Response Time (mins)
              </label>
              <input
                type="number"
                min={5}
                max={60}
                value={avgResponseMins}
                onChange={(e) => setAvgResponseMins(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standby Flatbed Tow Truck
              </label>
              <select
                value={standbyTruck}
                onChange={(e) => setStandbyTruck(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
              >
                <option value="Truck #01 (Tilt-Bed)">Truck #01 (Hydraulic Tilt-Bed)</option>
                <option value="Truck #02 (Rapid Flatbed)">Truck #02 (Rapid EV Flatbed)</option>
                <option value="On-Call Highway Standby">On-Call Highway Standby</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={priorityHub}
                  onChange={(e) => setPriorityHub(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="font-semibold">Mark as Priority Expressway Hub (Featured on Landing Page)</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  Save & Publish Location
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search Filter */}
      <div className="relative">
        <input
          type="text"
          placeholder="Filter Hyderabad locations by name, corridor, landmark, or pincode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-800 focus:outline-none focus:border-sky-600 shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {/* Locations Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map(loc => (
          <div
            key={loc.id}
            className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between transition ${
              loc.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                    {loc.zone}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">
                    {loc.name}
                  </h4>
                </div>
                {loc.priorityHub && (
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-semibold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                    <Sparkles className="w-2.5 h-2.5" />
                    Priority
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mb-2">
                <strong className="text-slate-700">Hub:</strong> {loc.hubLandmark}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {loc.pincodes.map((pin, i) => (
                  <span key={i} className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                    PIN: {pin}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>~{loc.avgResponseMins} mins response</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-sky-600" />
                  <span className="truncate">{loc.standbyTruck}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleToggle(loc.id)}
                className={`text-xs font-semibold flex items-center gap-1 ${
                  loc.isActive ? 'text-emerald-700 hover:text-emerald-800' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {loc.isActive ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-600" />
                    <span>Active (24/7 Dispatch)</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-slate-400" />
                    <span>Coverage Paused</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(loc.id, loc.name)}
                className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                title="Remove location"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
