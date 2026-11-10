const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getWeeklySummary,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

router.route('/tasks')
  .post(createTask)
  .get(getTasks);

router.get('/tasks/weekly-summary', getWeeklySummary);

router.route('/tasks/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;