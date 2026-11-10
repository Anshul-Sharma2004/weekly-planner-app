import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { fetchWeeklySummary, fetchTasks, createTask, updateTask, deleteTask } from '../api/taskApi';
import WeeklyCard from '../components/WeeklyCard';
import TaskModal from '../components/TaskModal';
import WeekStrip from '../components/WeekStrip';
import { Plus, Sparkles, CheckCircle2, Flame, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [summaryRes, tasksRes] = await Promise.all([
        fetchWeeklySummary(),
        fetchTasks(),
      ]);
      setWeeklySummary(summaryRes.data.data || []);
      setTasks(tasksRes.data.data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      try {
        const [summaryRes, tasksRes] = await Promise.all([
          fetchWeeklySummary(),
          fetchTasks(),
        ]);
        if (isMounted) {
          setWeeklySummary(summaryRes.data.data || []);
          setTasks(tasksRes.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F7CBCA', '#C88A93', '#B0D7D8', '#7A535A'],
    });
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      await loadData();
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
      await updateTask(task._id, { status: newStatus });
      if (newStatus === 'Completed') {
        triggerCelebration();
      }
      await loadData();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between pt-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F7CBCA]/40 border border-[#C88A93]/30 text-[10px] text-[#7A535A] font-bold tracking-wide">
            <Sparkles className="w-3 h-3 text-[#C88A93]" /> Sprint Focus
          </div>
          <h1 className="text-2xl font-black text-[#3A2A2D] tracking-tight mt-0.5">
            Weekly Studio
          </h1>
        </div>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#C88A93] to-[#7A535A] text-[#FFF8EF] font-bold text-xs shadow-blushGlow hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </motion.button>
      </header>

      <WeekStrip tasks={tasks} />

      <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#C88A93]/25 shadow-softGlass relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F7CBCA]/40 border border-[#C88A93]/30 flex items-center justify-center text-[#7A535A]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#7A535A] uppercase tracking-wider">
                Sprint Velocity
              </span>
              <p className="text-xs font-bold text-[#3A2A2D]">
                {completedTasks}/{totalTasks} Closed {highPriorityCount > 0 && `• ${highPriorityCount} Urgent`}
              </p>
            </div>
          </div>
          <span className="text-xl font-black text-[#3A2A2D]">{completionPercent}%</span>
        </div>

        <div className="w-full h-2 bg-[#DDD3D3]/40 rounded-full overflow-hidden p-0.5 border border-[#C88A93]/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#B0D7D8] via-[#F7CBCA] to-[#C88A93] rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 px-0.5">
        <h2 className="text-xs font-bold text-[#7A535A] uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#C88A93]" />
          Weekly Sprints ({weeklySummary.length})
        </h2>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#7A535A]/60 text-xs">
          Loading your sprints...
        </div>
      ) : weeklySummary.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-[#C88A93]/25 bg-[#F1F7F7]/30">
          <CheckCircle2 className="w-8 h-8 mx-auto text-[#C88A93] mb-2" />
          <p className="text-sm font-bold text-[#3A2A2D]">No tasks scheduled yet</p>
          <p className="text-xs text-[#7A535A] mt-0.5">Tap Add Task to create your first item</p>
        </div>
      ) : (
        <div className="space-y-3">
          {weeklySummary.map((week) => (
            <WeeklyCard
              key={week._id}
              weekData={week}
              tasks={tasks}
              onToggleStatus={handleToggleStatus}
              onEdit={(task) => {
                setEditingTask(task);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </div>
  );
}