import { motion } from 'framer-motion';
import { Droplets, Wind, Thermometer, TrendingUp, TrendingDown } from 'lucide-react';

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return (
    <div className="py-20 flex flex-col items-center justify-center text-slate-500">
      <Thermometer className="w-12 h-12 mb-4 opacity-20" />
      <p className="text-sm font-medium tracking-wide">Awaiting Data Context</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center relative">
        <motion.div 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="flex justify-center mb-2"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
            <img 
              src={weatherData.icon} 
              alt={weatherData.condition}
              className="w-28 h-28 relative animate-pulse-slow" 
            />
          </div>
        </motion.div>
        
        <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-1">
          {weatherData.name}
        </h1>
        <p className="text-[11px] font-bold text-accent uppercase tracking-[0.2em] mb-4">
          {weatherData.country} • Local Time Sync
        </p>
        
        <div className="text-lg font-semibold text-white/90 capitalize tracking-tight mb-0.5">
          {weatherData.condition}
        </div>
        
        <div className="text-[11px] font-medium text-slate-400 mb-4">
          Feels like {weatherData.tempFeels}° 
        </div>

        <div className="flex justify-center gap-6 items-center">
          <div className="flex items-center text-[#ff7e5f] font-bold">
            <TrendingUp className="w-4 h-4 mr-1.5" />
            <span className="text-sm">H: {weatherData.tempHigh}°</span>
          </div>
          <div className="flex items-center text-accent font-bold">
            <TrendingDown className="w-4 h-4 mr-1.5" />
            <span className="text-sm">L: {weatherData.tempLow}°</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Celsius', value: `${weatherData.tempC}°`, color: 'from-accent/20 to-transparent' },
          { label: 'Fahrenheit', value: `${weatherData.tempF}°`, color: 'from-orange-500/20 to-transparent' },
        ].map((metric, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className={`bg-gradient-to-b ${metric.color} border border-white/10 p-5 rounded-3xl text-center backdrop-blur-sm`}
          >
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              {metric.label}
            </span>
            <h3 className="text-4xl font-black text-white">{metric.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-4 p-5 bg-white/[0.03] border border-white/[0.05] rounded-3xl backdrop-blur-md">
        <div className="flex-1 flex flex-col items-center border-r border-white/10">
          <Droplets className="w-5 h-5 text-accent mb-1.5" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Humidity</span>
          <span className="text-sm font-black text-white">{weatherData.humidity}%</span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <Wind className="w-5 h-5 text-accent mb-1.5" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Wind Speed</span>
          <span className="text-sm font-black text-white">{weatherData.windSpeed} km/h</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherDisplay;
