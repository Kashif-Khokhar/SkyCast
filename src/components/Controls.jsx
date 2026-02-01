import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin } from 'lucide-react';

const Controls = ({ 
  selectedCountry, 
  handleCountryChange, 
  countryData, 
  selectedCity, 
  handleCityChange 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 gap-5 mb-8"
    >
      <div className="space-y-2">
        <label className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Globe className="w-3 h-3 mr-1.5 text-accent" />
          Region
        </label>
        <div className="relative group">
          <select 
            value={selectedCountry} 
            onChange={handleCountryChange}
            className="w-full bg-white/5 border border-white/10 p-3.5 pr-10 rounded-2xl text-white text-sm outline-none cursor-pointer appearance-none transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 focus:bg-accent/10 focus:border-accent group-focus-within:ring-4 group-focus-within:ring-accent/10"
            style={{ backgroundImage: 'none' }}
          >
            <option value="" disabled className="bg-slate-900 text-slate-400">Select Country</option>
            {Object.keys(countryData).sort().map(country => (
              <option key={country} value={country} className="bg-slate-900">{country}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[calc(-50%+2px)]">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <MapPin className="w-3 h-3 mr-1.5 text-accent" />
          Location
        </label>
        <div className="relative group">
          <select 
            value={selectedCity} 
            onChange={handleCityChange}
            disabled={!selectedCountry}
            className="w-full bg-white/5 border border-white/10 p-3.5 pr-10 rounded-2xl text-white text-sm outline-none cursor-pointer appearance-none transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 focus:bg-accent/10 focus:border-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
            style={{ backgroundImage: 'none' }}
          >
            <option value="" disabled className="bg-slate-900 text-slate-400">Select City</option>
            {(countryData[selectedCountry] || []).map(city => (
              <option key={city} value={city} className="bg-slate-900">{city}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Controls;
