const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class TaskService {
  async getAllTasks(userId, userRole) {
    if (userRole === 'ADMIN') {
      return await prisma.task.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return await prisma.task.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getTaskById(id, userId, userRole) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (userRole !== 'ADMIN' && task.userId !== userId) {
      throw new AppError('You do not have permission to access this task', 403);
    }

    return task;
  }

  async createTask(title, description, status, userId) {
    return await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        userId
      }
    });
  }

  async updateTask(id, updateData, userId, userRole) {
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (userRole !== 'ADMIN' && task.userId !== userId) {
      throw new AppError('You do not have permission to update this task', 403);
    }

    return await prisma.task.update({
      where: { id },
      data: updateData
    });
  }

  async deleteTask(id, userId, userRole) {
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (userRole !== 'ADMIN' && task.userId !== userId) {
      throw new AppError('You do not have permission to delete this task', 403);
    }

    await prisma.task.delete({
      where: { id }
    });

    return { message: 'Task deleted successfully' };
  }
}

module.exports = new TaskService();
