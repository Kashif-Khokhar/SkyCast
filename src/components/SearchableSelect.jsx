import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check } from 'lucide-react';

const SearchableSelect = ({ 
  options = [], 
  value = '', 
  onChange, 
  placeholder = "Select...", 
  icon: Icon,
  disabled = false,
  isSyncing = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return options.slice(0, 100); // Only show first 100 when empty for performance
    
    return options
      .filter(opt => opt.toLowerCase().includes(term))
      .slice(0, 100); // Cap results to 100 to keep DOM lightweight
  }, [options, search]);

  const handleSelect = (val) => {
    onChange({ target: { value: val } });
    setIsOpen(false);
    setSearch('');
  };

  const toggleOpen = () => {
    if (disabled || isSyncing) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <div 
        onClick={toggleOpen}
        className={`w-full bg-white/5 border ${isOpen ? 'border-accent ring-4 ring-accent/10' : 'border-white/10'} p-3.5 px-4 rounded-2xl text-white text-sm cursor-pointer transition-all duration-300 flex items-center justify-between hover:bg-white/[0.08] hover:border-white/20 ${(disabled || isSyncing) ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center overflow-hidden">
          {Icon && <Icon className={`w-3.5 h-3.5 mr-2.5 transition-colors ${isOpen ? 'text-accent' : 'text-slate-400'}`} />}
          <span className={`truncate ${!value ? 'text-slate-400' : 'text-white'}`}>
            {isSyncing ? (
              <span className="animate-pulse flex items-center text-accent">
                Syncing Nodes...
              </span>
            ) : (value || placeholder)}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] top-full left-0 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/40 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
              {isSyncing ? (
                 <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                   <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                   <div className="text-slate-400 text-xs animate-pulse">Initializing Global Sync...</div>
                 </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className="group flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-accent/10 transition-colors"
                  >
                    <span className={`text-sm ${value === opt ? 'text-accent font-medium' : 'text-slate-300 group-hover:text-white'}`}>
                      {opt}
                    </span>
                    {value === opt && <Check className="w-3.5 h-3.5 text-accent" />}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs italic">
                  No matching locations found
                </div>
              )}
            </div>

            {/* Footer metadata */}
            {options.length > 0 && (
              <div className="px-4 py-2 border-t border-white/5 bg-white/2 text-[9px] text-slate-500 flex justify-between uppercase tracking-tighter">
                <span>Total Nodes: {options.length}</span>
                {filteredOptions.length === 100 && <span>Displaying top 100</span>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchableSelect;

