import { motion, AnimatePresence } from 'framer-motion';

const Background = ({ condition, mainCondition }) => {
  const getAtmosphere = () => {
    // Priority: mainCondition (normalized) > condition (description)
    const main = (mainCondition || condition || '').toLowerCase();
    
    // Elite Atmosphere Mapping
    if (main.includes('thunderstorm') || main.includes('thunder')) {
      return {
        url: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2071&auto=format&fit=crop',
        avgColor: '#1e1b4b',
        effect: 'thunder'
      };
    }
    if (main.includes('drizzle') || main.includes('rain')) {
      return {
        url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974&auto=format&fit=crop',
        avgColor: '#1e293b',
        effect: 'rain'
      };
    }
    if (main.includes('snow')) {
      return {
        url: 'https://images.unsplash.com/photo-1478265409131-1f65c88af665?q=80&w=1935&auto=format&fit=crop',
        avgColor: '#f1f5f9',
        effect: 'snow'
      };
    }
    if (main.includes('cloud') || main.includes('overcast')) {
      return {
        url: 'https://images.unsplash.com/photo-1534088568595-a066f77cbc3d?q=80&w=1935&auto=format&fit=crop',
        avgColor: '#475569',
        effect: 'clouds'
      };
    }
    if (main.includes('mist') || main.includes('fog') || main.includes('haze') || main.includes('dust') || main.includes('sand')) {
      return {
        url: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=80&w=1974&auto=format&fit=crop',
        avgColor: '#94a3b8',
        effect: 'mist'
      };
    }
    if (main.includes('sunny') || main.includes('clear') || main.includes('sun')) {
      return {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop',
        avgColor: '#0ea5e9',
        effect: 'sunny'
      };
    }
    
    // Opening Atmosphere: Cinematic World View
    return {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
      avgColor: '#020617',
      effect: 'none'
    };
  };

  const atmosphere = getAtmosphere();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      {/* 
        Persistent Base Layer: 
        Ensures the screen NEVER goes black during transitions 
      */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)` }}
      />

      <AnimatePresence mode="popLayout">
        <motion.div
          key={atmosphere.url + atmosphere.effect} 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className={`absolute inset-0 bg-cover bg-center ${atmosphere.effect === 'sunny' ? 'animate-shimmer' : ''}`}
          style={{ backgroundImage: `url(${atmosphere.url})` }}
        >
          {/* Subtle Color Grading Overlay */}
          <div 
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{ backgroundColor: atmosphere.avgColor }}
          />
          
          {/* Weather Effect Overlays */}
          {atmosphere.effect === 'thunder' && (
            <motion.div 
              animate={{ opacity: [0, 0.4, 0, 0.2, 0] }}
              transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1, 0.15, 1] }}
              className="absolute inset-0 bg-white mix-blend-screen"
            />
          )}
          {atmosphere.effect === 'rain' && (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-25 animate-rain" />
          )}
          {(atmosphere.effect === 'clouds' || atmosphere.effect === 'mist') && (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-15 blur-2xl animate-drift pointer-events-none" />
          )}
          {atmosphere.effect === 'snow' && (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-sand.png')] opacity-40 animate-snow pointer-events-none" />
          )}
          {atmosphere.effect === 'sunny' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/10 to-transparent opacity-30 pointer-events-none" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* High-end vignette and noise */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
    </div>
  );
};

export default Background;
