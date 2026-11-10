import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import {
  BarChart3,
  PieChart as PieIcon,
  Flame,
//   CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { fetchWeeklySummary, fetchTasks } from '../api/taskApi';
import AnimatedCounter from '../components/AnimatedCounter';

export default function StatsPage() {
  const [summary, setSummary] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const [sumRes, taskRes] = await Promise.all([
          fetchWeeklySummary(),
          fetchTasks(),
        ]);
        if (isMounted) {
          setSummary(sumRes.data.data || []);
          setTasks(taskRes.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Data mapping for Weekly Bar Chart
  const barChartData = summary.map((week) => {
    const start = new Date(week._id);
    return {
      name: format(start, 'dd MMM'),
      Open: week.openTasks,
      Completed: week.completedTasks,
    };
  });

  // 2. Priority breakdown mapping
  const priorityCounts = tasks.reduce(
    (acc, task) => {
      const p = task.priority || 'Medium';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );

  const pieChartData = [
    { name: 'High', value: priorityCounts.High, color: '#C88A93' },
    { name: 'Medium', value: priorityCounts.Medium, color: '#F7CBCA' },
    { name: 'Low', value: priorityCounts.Low, color: '#B0D7D8' },
  ].filter((item) => item.value > 0);

  // Key KPI Figures
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const openTasks = totalTasks - completedTasks;
  const highPriorityTasks = priorityCounts.High;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#3A2A2D] tracking-tight">
          Performance Analytics
        </h1>
        <p className="text-xs font-semibold text-[#7A535A] mt-0.5">
          Real-time sprint metrics & distribution
        </p>
      </div>

      {/* 4 Quick Stat Metric Badges */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#FFF8EF] border border-[#C88A93]/25 shadow-softGlass">
          <div className="flex items-center justify-between text-[#7A535A] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completion</span>
            <Flame className="w-3.5 h-3.5 text-[#C88A93]" />
          </div>
          <div className="text-xl font-black text-[#3A2A2D]">
            <AnimatedCounter value={completionRate} />%
          </div>
          <span className="text-[10px] font-medium text-[#5D6B6B]">{completedTasks}/{totalTasks} done</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FFF8EF] border border-[#C88A93]/25 shadow-softGlass">
          <div className="flex items-center justify-between text-[#7A535A] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Backlog</span>
            <Clock className="w-3.5 h-3.5 text-[#7A535A]" />
          </div>
          <div className="text-xl font-black text-[#3A2A2D]">
            <AnimatedCounter value={openTasks} />
          </div>
          <span className="text-[10px] font-medium text-[#5D6B6B]">Pending tasks</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FFF8EF] border border-[#C88A93]/25 shadow-softGlass">
          <div className="flex items-center justify-between text-[#7A535A] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Urgent Load</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#C88A93]" />
          </div>
          <div className="text-xl font-black text-[#3A2A2D]">
            <AnimatedCounter value={highPriorityTasks} />
          </div>
          <span className="text-[10px] font-medium text-[#5D6B6B]">High priority</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FFF8EF] border border-[#C88A93]/25 shadow-softGlass">
          <div className="flex items-center justify-between text-[#7A535A] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Sprints</span>
            <Calendar className="w-3.5 h-3.5 text-[#5D6B6B]" />
          </div>
          <div className="text-xl font-black text-[#3A2A2D]">
            <AnimatedCounter value={summary.length} />
          </div>
          <span className="text-[10px] font-medium text-[#5D6B6B]">Active weeks</span>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#7A535A] text-xs">
          Calculating data insights...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-[#C88A93]/25 bg-[#F1F7F7]/30">
          <p className="text-sm font-bold text-[#3A2A2D]">No task data found</p>
          <p className="text-xs text-[#7A535A] mt-0.5">Add tasks to see real chart projections</p>
        </div>
      ) : (
        <>
          {/* Chart 1: Grouped Weekly Bar Chart */}
          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#C88A93]/25 shadow-softGlass">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-[#3A2A2D] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#C88A93]" />
                Weekly Output Ratio
              </span>
              <span className="text-[10px] font-bold text-[#7A535A]">Open vs Closed</span>
            </div>

            <div className="w-full h-44 text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#7A535A"
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: '#DDD3D3' }}
                  />
                  <YAxis
                    stroke="#7A535A"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF8EF',
                      borderRadius: '12px',
                      border: '1px solid rgba(200, 138, 147, 0.4)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#3A2A2D',
                    }}
                  />
                  <Bar dataKey="Open" fill="#C88A93" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Completed" fill="#B0D7D8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Priority Donut Chart */}
          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#C88A93]/25 shadow-softGlass">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-[#3A2A2D] flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-[#7A535A]" />
                Priority Distribution
              </span>
              <span className="text-[10px] font-bold text-[#7A535A]">
                {totalTasks} Total Tasks
              </span>
            </div>

            <div className="w-full h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={54}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF8EF',
                      borderRadius: '12px',
                      border: '1px solid rgba(200, 138, 147, 0.4)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#3A2A2D',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-[10px] font-bold text-[#3A2A2D] ml-1">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Velocity Cards List */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-[#7A535A] uppercase tracking-wider px-1">
              Sprint Velocity Breakdown
            </span>
            {summary.map((week) => {
              const start = new Date(week._id);
              const rate = week.totalTasks > 0 ? Math.round((week.completedTasks / week.totalTasks) * 100) : 0;
              return (
                <div
                  key={week._id}
                  className="p-3 rounded-2xl bg-[#FFF8EF] border border-[#C88A93]/20 flex items-center justify-between shadow-sm"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#3A2A2D]">
                      Week {format(start, 'w')} ({format(start, 'dd MMM')})
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-[#7A535A]">
                      <span>{week.openTasks} Open</span>
                      <span>•</span>
                      <span className="text-[#5D6B6B]">{week.completedTasks} Done</span>
                    </div>
                  </div>
                  <div className="text-xs font-black text-[#3A2A2D] bg-[#F1F7F7] px-2.5 py-1 rounded-xl border border-[#B0D7D8]/80">
                    {rate}%
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}