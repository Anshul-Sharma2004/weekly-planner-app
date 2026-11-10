import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flag, Type, AlignLeft } from 'lucide-react';
import { format } from 'date-fns';

function TaskForm({ onSave, editingTask }) {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [dateTime, setDateTime] = useState(
    editingTask?.dateTime
      ? format(new Date(editingTask.dateTime), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [priority, setPriority] = useState(editingTask?.priority || 'Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dateTime) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      dateTime: new Date(dateTime).toISOString(),
      priority,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {/* Title */}
      <div>
        <label className="text-xs text-[#7A535A] font-bold flex items-center gap-1.5 mb-1.5">
          <Type className="w-3.5 h-3.5 text-[#C88A93]" /> Title *
        </label>
        <input
          type="text"
          required
          placeholder="e.g., Deploy backend to Render"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#FFF8EF] border border-[#C88A93]/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#3A2A2D] placeholder-[#7A535A]/50 focus:outline-none focus:border-[#C88A93] shadow-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs text-[#7A535A] font-bold flex items-center gap-1.5 mb-1.5">
          <AlignLeft className="w-3.5 h-3.5 text-[#C88A93]" /> Description
        </label>
        <textarea
          rows="2"
          placeholder="Add optional notes or acceptance criteria..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#FFF8EF] border border-[#C88A93]/30 rounded-xl px-3.5 py-2 text-xs font-medium text-[#3A2A2D] placeholder-[#7A535A]/50 focus:outline-none focus:border-[#C88A93] shadow-sm resize-none"
        />
      </div>

      {/* Date & Time */}
      <div>
        <label className="text-xs text-[#7A535A] font-bold flex items-center gap-1.5 mb-1.5">
          <Clock className="w-3.5 h-3.5 text-[#C88A93]" /> Date & Time *
        </label>
        <input
          type="datetime-local"
          required
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full bg-[#FFF8EF] border border-[#C88A93]/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#3A2A2D] focus:outline-none focus:border-[#C88A93] shadow-sm"
        />
      </div>

      {/* Priority Selector */}
      <div>
        <label className="text-xs text-[#7A535A] font-bold flex items-center gap-1.5 mb-1.5">
          <Flag className="w-3.5 h-3.5 text-[#C88A93]" /> Priority
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Low', 'Medium', 'High'].map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPriority(p)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                priority === p
                  ? 'bg-[#C88A93] text-[#FFF8EF] border-[#C88A93] shadow-sm'
                  : 'bg-[#F1F7F7] border-[#C88A93]/20 text-[#7A535A] hover:bg-[#F7CBCA]/30'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        type="submit"
        className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#C88A93] to-[#7A535A] text-[#FFF8EF] font-black text-xs tracking-wider shadow-blushGlow hover:opacity-95 transition-opacity"
      >
        {editingTask ? 'Save Task Changes' : 'Confirm & Schedule Task'}
      </motion.button>
    </form>
  );
}

export default function TaskModal({ isOpen, onClose, onSave, editingTask }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-[#FFF8EF] border border-[#C88A93]/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#C88A93]/20">
              <h2 className="text-base font-black text-[#3A2A2D]">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#7A535A] hover:text-[#3A2A2D] hover:bg-[#F7CBCA]/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <TaskForm
              key={editingTask ? editingTask._id : 'new'}
              editingTask={editingTask}
              onSave={onSave}
              onClose={onClose}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}