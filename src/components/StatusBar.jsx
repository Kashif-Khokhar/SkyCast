const StatusBar = ({ isSyncing, weatherData, weatherStatus, globalStatus }) => {
  const isActive = isSyncing || weatherData;

  return (
    <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-center gap-3">
      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
        isActive 
          ? 'bg-success shadow-[0_0_15px_-2px_#00ff88]' 
          : 'bg-slate-700'
      }`} />
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
        {isSyncing ? weatherStatus : (weatherData ? weatherStatus : globalStatus)}
      </span>
    </div>
  );
};

export default StatusBar;
