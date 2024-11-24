import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './timetracking.css';
import TaskForm from './work-form';

const Work = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    taskType: '',
    projectName: '',
    assignee: '',
    assignedTo: '',
    dueDate: '',
    budgetHours: '',
    loggedHours: '',
    updatedOn: '',
    status: ''
  });
  const [filters, setFilters] = useState({
    assignedTo: [],
    projectName: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [selectedTask, setSelectedTask] = React.useState(null);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/workTrack/getTime');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddItem = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/workTrack/addTime', formData);
      setTasks([...tasks, response.data]);
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateItem = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/workTrack/updateTime/${currentTaskId}`, formData);
      setTasks(tasks.map(task => (task._id === currentTaskId ? response.data : task)));
      resetForm();
      setIsEditing(false);
      setCurrentTaskId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      taskType: '',
      projectName: '',
      assignee: '',
      assignedTo: '',
      dueDate: '',
      budgetHours: '',
      loggedHours: '',
      updatedOn: '',
      status: ''
    });
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleEdit = (task) => {
    setFormData(task);
    setIsEditing(true);
    setCurrentTaskId(task._id);
    setShowForm(true);
  };

  const handleFilterChange = (selectedOptions, actionMeta) => {
    setFilters({ ...filters, [actionMeta.name]: selectedOptions });
  };

  const filteredTasks = tasks.filter(task => {
    const assignedToFilter = filters.assignedTo.map(option => option.value.toLowerCase());
    const projectNameFilter = filters.projectName.map(option => option.value.toLowerCase());

    return (
      (assignedToFilter.length === 0 || assignedToFilter.some(filter => task.assignedTo.toLowerCase().includes(filter))) &&
      (projectNameFilter.length === 0 || projectNameFilter.some(filter => task.projectName.toLowerCase().includes(filter)))
    );
  });

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
    setCurrentTaskId(null);
    setShowForm(false);
  };

  const handleCardClick = (task) => {
    setShowDetails(task._id === showDetails ? null : task._id);
  };

  const categorizeTasks = (tasks) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const dueToday = [];
    const dueTomorrow = [];
    const dueNextWeek = [];
    const dueLater = [];

    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      if (dueDate.toDateString() === today.toDateString()) {
        dueToday.push(task);
      } else if (dueDate.toDateString() === tomorrow.toDateString()) {
        dueTomorrow.push(task);
      } else if (dueDate <= nextWeek) {
        dueNextWeek.push(task);
      } else {
        dueLater.push(task);
      }
    });

    return { dueToday, dueTomorrow, dueNextWeek, dueLater };
  };

  const { dueToday, dueTomorrow, dueNextWeek, dueLater } = categorizeTasks(filteredTasks);

  return (
    <div className="min-h-screen bg-gray-100">
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative overflow-auto max-h-[90vh]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {isEditing ? 'Edit Task' : 'Add New Task'}
            </h2>
            <TaskForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={isEditing ? handleUpdateItem : handleAddItem}
              isEditing={isEditing}
              handleCancel={handleCancel}
            />
          </div>
        </div>
      )}
      {selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedTask(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{selectedTask.taskType}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-medium">Project:</span> {selectedTask.projectName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Assigned To:</span> {selectedTask.assignedTo}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Due Date:</span> {selectedTask.dueDate}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Status:</span> {selectedTask.status}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Budget Hours:</span> {selectedTask.budgetHours}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Logged Hours:</span> {selectedTask.loggedHours}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Updated On:</span> {selectedTask.updatedOn}
              </p>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-6"
              onClick={() => {
                handleEdit(selectedTask);
                setSelectedTask(null);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      )}
      <div className="bg-gray-50 min-h-screen">
        <div className="flex flex-wrap items-center justify-between p-4 bg-white shadow-md">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            + Add Task
          </button>
          <div className="flex flex-wrap space-x-2">
            <Select
              isMulti
              name="assignedTo"
              options={tasks.map((task) => ({
                value: task.assignedTo,
                label: task.assignedTo,
              }))}
              className="basic-multi-select w-48 rounded-lg"
              classNamePrefix="select"
              placeholder="Filter by Assigned To"
              value={filters.assignedTo}
              onChange={handleFilterChange}
            />
            <Select
              isMulti
              name="projectName"
              options={tasks.map((task) => ({
                value: task.projectName,
                label: task.projectName,
              }))}
              className="basic-multi-select w-48 rounded-lg"
              classNamePrefix="select"
              placeholder="Filter by Project"
              value={filters.projectName}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Work Page</h1>
          {[
            { title: 'Due Today', tasks: dueToday },
            { title: 'Due Tomorrow', tasks: dueTomorrow },
            { title: 'Due Next Week', tasks: dueNextWeek },
            { title: 'Due Later', tasks: dueLater },
          ].map(({ title, tasks }, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task, index) => (
                  <div
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer"
                    key={index}
                    onClick={() => setSelectedTask(task)}
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">
                      {task.taskType}
                    </h3>
                    <p className="text-gray-800 text-sm mb-1">
                      <span className="font-medium">Project:</span> {task.projectName}
                    </p>
                    <p className="text-gray-800 text-sm mb-1">
                      <span className="font-medium">Assigned To:</span> {task.assignedTo}
                    </p>
                    <p className="text-gray-800 text-sm">
                      <span className="font-medium">Status:</span> {task.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Work;
