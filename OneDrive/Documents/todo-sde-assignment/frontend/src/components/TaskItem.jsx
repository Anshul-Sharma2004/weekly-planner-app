import { motion, useMotionValue, useTransform } from 'framer-motion';
import { format } from 'date-fns';
import { Trash2, Edit3, CheckCircle2, Circle } from 'lucide-react';

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

  const priorityStyles = {
    High: 'bg-[#F7CBCA] text-[#7A535A] border-[#C88A93]',
    Medium: 'bg-[#F1F7F7] text-[#5D6B6B] border-[#B0D7D8]',
    Low: 'bg-[#DDD3D3]/40 text-[#7A535A] border-[#DDD3D3]',
  };

  const isCompleted = task.status === 'Completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="relative rounded-xl overflow-hidden"
    >
      {/* Swipe Delete Background */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-[#C88A93] flex items-center justify-end px-5 text-[#FFF8EF] font-bold text-xs rounded-xl"
      >
        <span className="flex items-center gap-1">
          <Trash2 className="w-4 h-4" /> Delete
        </span>
      </motion.div>

      {/* Swipeable Task Foreground */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(e, { offset }) => {
          if (offset.x < -70) {
            onDelete();
          }
        }}
        className={`relative z-10 p-3.5 rounded-xl bg-[#FFF8EF] border border-[#C88A93]/20 flex items-center justify-between shadow-sm transition-all ${
          isCompleted ? 'opacity-60 bg-[#DDD3D3]/30' : 'hover:border-[#C88A93]/50'
        }`}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={onToggleStatus}
            className="mt-0.5 text-[#C88A93] hover:text-[#7A535A] transition-colors"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-[#7A535A]" />
            ) : (
              <Circle className="w-5 h-5 text-[#C88A93]/60 hover:text-[#C88A93]" />
            )}
          </motion.button>

          <div className="min-w-0 flex-1">
            <h4
              className={`text-xs font-bold truncate ${
                isCompleted ? 'line-through text-[#7A535A]' : 'text-[#3A2A2D]'
              }`}
            >
              {task.title}
            </h4>
            {task.description && (
              <p className="text-[11px] text-[#5D6B6B] truncate mt-0.5">{task.description}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] text-[#7A535A] font-medium">
                {format(new Date(task.dateTime), 'dd MMM, hh:mm a')}
              </span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${
                  priorityStyles[task.priority] || priorityStyles.Medium
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onEdit}
          className="p-1.5 rounded-lg text-[#7A535A] hover:text-[#3A2A2D] hover:bg-[#F7CBCA]/30 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}