import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isThisWeek } from 'date-fns';
import { ChevronDown, Calendar, CheckCircle2, Clock } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import TaskItem from './TaskItem';

export default function WeeklyCard({ weekData, tasks = [], onToggleStatus, onEdit, onDelete }) {
  const startDate = new Date(weekData._id);
  const endDate = addDays(startDate, 6);
  const isCurrent = isThisWeek(startDate, { weekStartsOn: 1 });
  const [isExpanded, setIsExpanded] = useState(isCurrent);

  const weekTasks = tasks.filter(
    (task) => new Date(task.weekStart).toDateString() === startDate.toDateString()
  );

  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isCurrent
          ? 'bg-[#FFF8EF] border-[#C88A93] shadow-softGlass'
          : 'bg-[#FFF8EF]/80 border-[#C88A93]/20 hover:border-[#C88A93]/40'
      }`}
    >
      {/* Header Container */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer select-none flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isCurrent
                ? 'bg-[#F7CBCA]/50 border-[#C88A93]/40 text-[#7A535A]'
                : 'bg-[#F1F7F7] border-[#D5E5E5] text-[#5D6B6B]'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#3A2A2D] tracking-tight truncate">
                {format(startDate, 'dd MMM')} – {format(endDate, 'dd MMM')}
              </h3>
              {isCurrent && (
                <span className="px-2 py-0.5 rounded-full bg-[#B0D7D8]/40 border border-[#B0D7D8] text-[#3A2A2D] text-[10px] font-bold tracking-wide">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-[#7A535A] mt-0.5 font-medium">
              Week {format(startDate, 'w')} • {weekData.totalTasks} Tasks
            </p>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F7CBCA]/40 border border-[#C88A93]/30 text-[#7A535A] text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <AnimatedCounter value={weekData.openTasks} />
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#B0D7D8]/30 border border-[#B0D7D8]/80 text-[#3A2A2D] text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5D6B6B]" />
            <AnimatedCounter value={weekData.completedTasks} />
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#7A535A] p-1"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Expandable Task Accordion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="px-4 pb-4 pt-1 border-t border-[#C88A93]/15 bg-[#F1F7F7]/30"
          >
            {weekTasks.length === 0 ? (
              <p className="text-xs text-center text-[#7A535A] py-3 font-medium">
                No tasks inside this sprint.
              </p>
            ) : (
              <div className="space-y-2 mt-2">
                {weekTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggleStatus={() => onToggleStatus(task)}
                    onEdit={() => onEdit(task)}
                    onDelete={() => onDelete(task._id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}