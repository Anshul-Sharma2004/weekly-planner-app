import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, X, Loader2, Filter } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { fetchTasks, updateTask, deleteTask } from '../api/taskApi';
import useDebounce from '../hooks/useDebounce';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'In Progress' | 'Completed'
  const [priorityFilter, setPriorityFilter] = useState('All'); // 'All' | 'High' | 'Medium' | 'Low'
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 250);

  const loadSearchResults = useCallback(async (searchTerm) => {
    setLoading(true);
    try {
      const res = await fetchTasks({ search: searchTerm });
      setAllTasks(res.data.data || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const execute = async () => {
      setLoading(true);
      try {
        const res = await fetchTasks({ search: debouncedQuery });
        if (isMounted) setAllTasks(res.data.data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    execute();
    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Client-side instant filter on top of debounced backend search
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const matchesStatus =
        statusFilter === 'All' ? true : task.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'All' ? true : task.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [allTasks, statusFilter, priorityFilter]);

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
      await updateTask(task._id, { status: newStatus });
      await loadSearchResults(debouncedQuery);
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      await loadSearchResults(debouncedQuery);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      await loadSearchResults(debouncedQuery);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[#3A2A2D] tracking-tight">
          Search & Filters
        </h1>
        <p className="text-xs font-semibold text-[#7A535A] mt-0.5">
          Locate tasks across titles, descriptions, & priorities
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#7A535A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search tasks..."
          className="w-full bg-[#FFF8EF] border border-[#C88A93]/30 rounded-2xl pl-10 pr-10 py-3 text-xs text-[#3A2A2D] font-bold placeholder-[#7A535A]/50 focus:outline-none focus:border-[#C88A93] shadow-softGlass transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A535A] hover:text-[#3A2A2D]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Chips Bar (Status & Priority) */}
      <div className="space-y-2">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {['All', 'In Progress', 'Completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                statusFilter === s
                  ? 'bg-[#3A2A2D] text-[#FFF8EF] shadow-sm'
                  : 'bg-[#FFF8EF] border border-[#C88A93]/20 text-[#7A535A] hover:bg-[#F7CBCA]/30'
              }`}
            >
              {s === 'All' ? 'All Status' : s}
            </button>
          ))}
        </div>

        {/* Priority Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {['All', 'High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                priorityFilter === p
                  ? 'bg-[#C88A93] text-[#FFF8EF] shadow-sm'
                  : 'bg-[#F1F7F7] border border-[#D5E5E5] text-[#5D6B6B] hover:bg-[#DDD3D3]/40'
              }`}
            >
              {p === 'All' ? 'Any Priority' : `${p} Priority`}
            </button>
          ))}
        </div>
      </div>

      {/* Meta Counter Summary Badge */}
      <div className="flex items-center justify-between text-xs font-bold text-[#7A535A] px-1 pt-1">
        <span className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#C88A93]" />
          {query ? `Keyword "${query}"` : 'Filter Results'}
        </span>
        <span className="bg-[#FFF8EF] border border-[#C88A93]/30 px-2 py-0.5 rounded-lg text-[10px] text-[#3A2A2D]">
          {filteredTasks.length} matched
        </span>
      </div>

      {/* Results List View */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#7A535A] text-xs gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#C88A93]" /> Querying tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-14 px-4 rounded-2xl border-2 border-dashed border-[#C88A93]/25 bg-[#F1F7F7]/30">
          <p className="text-sm font-bold text-[#3A2A2D]">No tasks match this filter</p>
          <p className="text-xs text-[#7A535A] mt-1">Try tweaking your keyword or resetting filter chips</p>
          {(query || statusFilter !== 'All' || priorityFilter !== 'All') && (
            <button
              onClick={() => {
                setQuery('');
                setStatusFilter('All');
                setPriorityFilter('All');
              }}
              className="mt-3 px-3 py-1.5 rounded-xl bg-[#F7CBCA]/50 border border-[#C88A93]/40 text-xs font-bold text-[#7A535A]"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5 pb-6">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggleStatus={() => handleToggleStatus(task)}
                onEdit={() => {
                  setEditingTask(task);
                  setIsModalOpen(true);
                }}
                onDelete={() => handleDeleteTask(task._id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Modal */}
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