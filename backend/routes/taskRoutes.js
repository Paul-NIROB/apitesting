const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.route('/')
  .get(taskController.getAllTasks)
  .post(taskController.taskValidation.create, taskController.createTask);

router.route('/:id')
  .get(taskController.getTaskById)
  .put(taskController.taskValidation.update, taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
