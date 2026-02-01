import { motion } from 'framer-motion';

const Header = ({ date }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8"
  >
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight text-white flex items-center">
        SkyCast 
        <span className="ml-2 px-2 py-0.5 bg-accent text-card text-[10px] font-black rounded uppercase tracking-widest">
          ELITE
        </span>
      </h2>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
        Weather Intelligence
      </p>
    </div>
    <p className="text-slate-400 text-xs mt-1 font-medium">{date}</p>
  </motion.div>
);

export default Header;
