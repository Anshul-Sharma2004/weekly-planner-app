import { useMemo } from 'react';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';

export default function WeekStrip({ tasks = [] }) {
  const { weekDays, weekStart, weekEnd } = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = addDays(start, 6);

    const days = Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(start, i);
      const dayTasks = tasks.filter((t) => isSameDay(new Date(t.dateTime), date));
      const completed = dayTasks.filter((t) => t.status === 'Completed').length;
      const total = dayTasks.length;

      return {
        date,
        dayName: format(date, 'EEE'),
        dayNum: format(date, 'd'),
        total,
        completed,
        isToday: isSameDay(date, today),
      };
    });

    return { weekDays: days, weekStart: start, weekEnd: end };
  }, [tasks]);

  return (
    <div className="bg-[#FFF8EF] border border-[#C88A93]/25 rounded-2xl p-3 shadow-softGlass">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-bold text-[#7A535A] uppercase tracking-wider">
          Weekly Sprint Cadence
        </span>
        <span className="text-[10px] font-semibold text-[#5D6B6B]">
          {format(weekStart, 'dd MMM')} – {format(weekEnd, 'dd MMM')}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {weekDays.map((d, idx) => {
          const hasTasks = d.total > 0;
          const allDone = hasTasks && d.completed === d.total;

          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className={`py-2 rounded-xl flex flex-col items-center justify-between border transition-all ${
                d.isToday
                  ? 'bg-[#F7CBCA]/50 border-[#C88A93] shadow-sm'
                  : 'bg-[#F1F7F7]/60 border-[#D5E5E5]/60'
              }`}
            >
              <span className="text-[9px] font-bold text-[#7A535A]">{d.dayName}</span>
              <span className={`text-xs font-black my-0.5 ${d.isToday ? 'text-[#3A2A2D]' : 'text-[#5D6B6B]'}`}>
                {d.dayNum}
              </span>

              <div className="h-2 flex items-center justify-center">
                {hasTasks ? (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      allDone ? 'bg-[#5D6B6B]' : 'bg-[#C88A93]'
                    }`}
                  />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-slate-300/60" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}