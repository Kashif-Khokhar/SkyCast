import { motion, AnimatePresence } from 'framer-motion';

const Background = ({ condition }) => {
  const getBackgroundClass = () => {
    const main = condition?.toLowerCase() || '';
    if (main.includes('clear')) return 'from-blue-400 to-blue-600';
    if (main.includes('cloud')) return 'from-slate-600 to-slate-800';
    if (main.includes('rain') || main.includes('drizzle')) return 'from-indigo-700 to-blue-900';
    if (main.includes('snow')) return 'from-blue-100 to-slate-300';
    if (main.includes('thunder')) return 'from-purple-900 to-slate-900';
    return 'from-[#1e293b] to-[#020617]';
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={condition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className={`absolute inset-0 bg-gradient-to-br transition-colors duration-1000 ${getBackgroundClass()}`}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
    </div>
  );
};

export default Background;
