const taskService = require('../services/taskService');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

const taskValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['PENDING', 'COMPLETED']).withMessage('Status must be PENDING or COMPLETED'),
    validate
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['PENDING', 'COMPLETED']).withMessage('Status must be PENDING or COMPLETED'),
    validate
  ]
};

const getAllTasks = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const tasks = await taskService.getAllTasks(id, role);
    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;
    const task = await taskService.getTaskById(parseInt(id), userId, role);
    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const { id: userId } = req.user;
    const task = await taskService.createTask(title, description, status, userId);
    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const { id: userId, role } = req.user;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    const task = await taskService.updateTask(parseInt(id), updateData, userId, role);
    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;
    await taskService.deleteTask(parseInt(id), userId, role);
    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  taskValidation
};
