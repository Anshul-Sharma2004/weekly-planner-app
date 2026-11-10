const Task = require('../models/Task');
const { startOfWeek, endOfWeek } = require('date-fns');

const getWeekStart = (date) => {
  return startOfWeek(new Date(date), { weekStartsOn: 1 });
};


exports.createTask = async (req, res) => {
  try {
    const { title, description, dateTime, priority } = req.body;
    if (!title || !dateTime) {
      return res.status(400).json({ success: false, message: 'Title and Date/Time are required' });
    }

    const weekStart = getWeekStart(dateTime);
    const task = await Task.create({
      title,
      description,
      dateTime,
      priority,
      weekStart,
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { search, weekStart } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (weekStart) {
      query.weekStart = new Date(weekStart);
    }

    const tasks = await Task.find(query).sort({ dateTime: 1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getWeeklySummary = async (req, res) => {
  try {
    const summary = await Task.aggregate([
      {
        $group: {
          _id: '$weekStart',
          totalTasks: { $sum: 1 },
          openTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] },
          },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    if (req.body.dateTime) {
      req.body.weekStart = getWeekStart(req.body.dateTime);
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};