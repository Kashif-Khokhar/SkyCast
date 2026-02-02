import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin } from 'lucide-react';
import SearchableSelect from './SearchableSelect';

const Controls = ({ 
  selectedCountry, 
  handleCountryChange, 
  countryData, 
  selectedCity, 
  handleCityChange,
  isCitiesSyncing
}) => {
  const countries = Object.keys(countryData).sort();
  const cities = countryData[selectedCountry] || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 gap-5 mb-8"
    >
      <div className="space-y-2">
        <label className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
          <Globe className="w-3 h-3 mr-1.5 text-accent" />
          Region
        </label>
        <SearchableSelect
          options={countries}
          value={selectedCountry}
          onChange={handleCountryChange}
          placeholder="Select Country"
          icon={Globe}
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
          <MapPin className="w-3 h-3 mr-1.5 text-accent" />
          Location
        </label>
        <SearchableSelect
          options={cities}
          value={selectedCity}
          onChange={handleCityChange}
          placeholder="Select City"
          icon={MapPin}
          disabled={!selectedCountry}
          isSyncing={isCitiesSyncing}
        />
      </div>
    </motion.div>
  );
};

export default Controls;

