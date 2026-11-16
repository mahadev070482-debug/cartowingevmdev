import React, { useState } from 'react';
import { store } from '../../services/store';
import { CompanyStats } from '../../types';
import { Sparkles, CheckCircle2, Award, Clock, Truck, ShieldCheck, Save, RotateCcw } from 'lucide-react';

export const StatsManager: React.FC = () => {
  const currentStats = store.getStats();

  const [yearsExperience, setYearsExperience] = useState<number>(currentStats.yearsExperience);
  const [rescuesCountText, setRescuesCountText] = useState<string>(currentStats.rescuesCountText);
  const [responseMinutes, setResponseMinutes] = useState<number>(currentStats.responseMinutes);
  const [activeTrucksCount, setActiveTrucksCount] = useState<number>(currentStats.activeTrucksCount);
  const [satisfactionRate, setSatisfactionRate] = useState<string>(currentStats.satisfactionRate);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateStats({
      yearsExperience: Number(yearsExperience) || 25,
      rescuesCountText: rescuesCountText.trim() || '100+ Rescues',
      responseMinutes: Number(responseMinutes) || 15,
      activeTrucksCount: Number(activeTrucksCount) || 8,
      satisfactionRate: satisfactionRate.trim() || '99.8%'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetDefaults = () => {
    setYearsExperience(25);
    setRescuesCountText('100+ Rescues');
    setResponseMinutes(15);
    setActiveTrucksCount(8);
    setSatisfactionRate('99.8%');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Live Company Statistics & Homepage Rescues Display
            </h2>
            <span className="text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full">
              Owner Controls
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Update the large recognizable 25+ experience number and 100+ rescues text displayed on the customer homepage.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Homepage Updated Successfully!</span>
          </div>
        )}
      </div>

      {/* Live Preview Box: Shows Large Recognizable Format */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Live Customer Preview (Large Format)</span>
          </span>
          <span className="text-[11px] text-slate-500">Updates live when saved</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          <div className="text-center sm:text-left sm:pr-4">
            <div className="text-5xl sm:text-6xl font-black text-sky-400 leading-none">
              {yearsExperience}+
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mt-2">
              Years Experience
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Automotive recovery since 2001</p>
          </div>

          <div className="text-center sm:text-left sm:px-4 pt-4 sm:pt-0">
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 leading-none">
              {rescuesCountText}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mt-2">
              EV Rescues Completed
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">100% zero-damage recoveries</p>
          </div>

          <div className="text-center sm:text-left sm:px-4 pt-4 sm:pt-0">
            <div className="text-4xl sm:text-5xl font-black text-amber-400 leading-none">
              {responseMinutes} MIN
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mt-2">
              Average Arrival
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Standby at Gachibowli & ORR</p>
          </div>

          <div className="text-center sm:text-left sm:pl-4 pt-4 sm:pt-0">
            <div className="text-4xl sm:text-5xl font-black text-white leading-none">
              100%
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mt-2">
              Zero-Degree Guarantee
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Hydraulic tilt flatbeds only</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* 1. Rescues Count Text (e.g. 100+ Rescues) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <label className="block text-xs font-bold text-slate-900">
              EV Rescues Text Display <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={rescuesCountText}
              onChange={(e) => setRescuesCountText(e.target.value)}
              placeholder="e.g. 100+ Rescues or 150+"
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ✓ <strong className="text-slate-700">Text Only:</strong> Updates the headline metric on the homepage without injecting redundant dummy records.
            </p>
          </div>

          {/* 2. Years Service Experience (e.g. 25) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <label className="block text-xs font-bold text-slate-900">
              Years Service Experience <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={yearsExperience}
              onChange={(e) => setYearsExperience(Number(e.target.value))}
              placeholder="e.g. 25"
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ✓ Rendered in giant, recognizable typography across the new Services and Hero sections.
            </p>
          </div>

          {/* 3. Average Response Minutes */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <label className="block text-xs font-bold text-slate-900">
              Average Response Time (Minutes)
            </label>
            <input
              type="number"
              min={5}
              max={120}
              value={responseMinutes}
              onChange={(e) => setResponseMinutes(Number(e.target.value))}
              placeholder="e.g. 15"
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Average dispatch ETA for Hitec City, Gachibowli, and Madhapur corridor.
            </p>
          </div>

          {/* 4. Active Fleet Count */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <label className="block text-xs font-bold text-slate-900">
              Active Standby Flatbeds in Fleet
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={activeTrucksCount}
              onChange={(e) => setActiveTrucksCount(Number(e.target.value))}
              placeholder="e.g. 8"
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Number of tilt flatbed carriers operating across Hyderabad zones.
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Defaults (25 Yrs, 100+ Rescues)</span>
          </button>

          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply to Website</span>
          </button>
        </div>

      </form>

    </div>
  );
};
