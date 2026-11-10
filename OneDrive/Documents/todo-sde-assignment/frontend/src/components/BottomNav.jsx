import { NavLink } from 'react-router-dom';
import { CalendarDays, Search, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const tabs = [
    { to: '/', icon: CalendarDays, label: 'Sprints' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/stats', icon: BarChart3, label: 'Insights' },
  ];

  return (
    <div className="absolute bottom-4 left-0 right-0 px-5 flex justify-center z-50 pointer-events-none">
      {/* Floating Glass Pill */}
      <div className="w-full max-w-[340px] bg-[#FFF8EF]/90 backdrop-blur-xl border border-[#C88A93]/30 rounded-2xl p-1.5 flex items-center justify-around shadow-[0_10px_30px_rgba(122,83,90,0.12)] pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-2 px-5 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-[#3A2A2D]' : 'text-[#7A535A]/70 hover:text-[#3A2A2D]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Icon className="w-5 h-5 relative z-10" />
                  </motion.div>
                  <span className="text-[10px] font-bold mt-1 relative z-10 tracking-tight">
                    {tab.label}
                  </span>

                  {/* Active Highlight Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDockIndicator"
                      className="absolute inset-0 bg-[#F7CBCA]/50 border border-[#C88A93]/40 rounded-xl shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}