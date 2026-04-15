import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PENDING'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, formData);
      } else {
        await taskService.create(formData);
      }
      setShowModal(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'PENDING' });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status
    });
    setShowModal(true);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id);
        fetchTasks();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      await taskService.update(task.id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const openModal = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', status: 'PENDING' });
    setShowModal(true);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Manager</h1>
        <div className="user-info">
          <span>Welcome, {user?.name} ({user?.role})</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="tasks-header">
          <h2>My Tasks</h2>
          <button onClick={openModal} className="create-btn">Create Task</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found. Create your first task!</p>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task.id} className={`task-card ${task.status.toLowerCase()}`}>
                <div className="task-info">
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <span className={`status-badge ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                  {task.user && task.user.name && (
                    <span className="task-owner">Owner: {task.user.name}</span>
                  )}
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className="toggle-btn"
                  >
                    {task.status === 'PENDING' ? 'Complete' : 'Undo'}
                  </button>
                  <button onClick={() => handleEditTask(task)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingTask ? 'Edit Task' : 'Create Task'}</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit">{editingTask ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
