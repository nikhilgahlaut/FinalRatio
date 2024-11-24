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
    <div className="min-h-screen border-gray-200 dark:bg-gray-900">
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative overflow-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
            <TaskForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={isEditing ? handleUpdateItem : handleAddItem}
              isEditing={isEditing}
              handleCancel={handleCancel}
            />
           {/* <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4" onClick={handleCancel}>Cancel</button> */}
          </div>
        </div>
      )}
      <div className="bg-slate-50 bg-contain min-h-screen">
        <div className='flex flex-row-reverse flex-wrap bg-slate-600'>
          <button onClick={() => setShowForm(true)} className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-4 px-4 rounded-full p-1 mr-2">+Add Task</button>
          <Select
            isMulti
            name="assignedTo"
            options={tasks.map(task => ({ value: task.assignedTo, label: task.assignedTo }))}
            className="basic-multi-select rounded p-3 mr-2 bg-slate-600"
            classNamePrefix="select"
            placeholder="Filter by Assigned To"
            value={filters.assignedTo}
            onChange={handleFilterChange}
          />
          <Select
            isMulti
            name="projectName"
            options={tasks.map(task => ({ value: task.projectName, label: task.projectName }))}
            className="basic-multi-select rounded p-3 mr-2 bg-slate-600"
            classNamePrefix="select"
            placeholder="Filter by Project"
            value={filters.projectName}
            onChange={handleFilterChange}
          />
        </div>
        <h1 className=' font-bold py-2 px-4 text-black'>WORK PAGE</h1>
        <div className='p-4'>
          <h2 className="text-xl font-bold text-black mb-2">Due Today</h2>
          <div className='flex flex-wrap'>
            {dueToday.map((task, index) => (
              <div
                className="bg-white max-w-sm rounded-lg overflow-hidden shadow-lg p-6 border border-gray-200 m-4 cursor-pointer"
                key={index}
                onClick={() => handleCardClick(task)}
              >
                <h2 className="text-gray-900 font-bold text-xl mb-2">{task.taskType}</h2>
                <h3 className="text-gray-700 text-base mb-2">{task.projectName}</h3>
                <div className="text-gray-700 text-sm mb-2">Assigned To: {task.assignedTo}</div>
                <div className="text-gray-700 text-sm mb-2">Status: {task.status}</div>
                {showDetails === task._id && (
                  <div className="mt-4">
                    <p className="text-gray-700 text-sm mb-2">Due Date: {task.dueDate}</p>
                    <p className="text-gray-700 text-sm mb-2">Budget Hours: {task.budgetHours}</p>
                    <p className="text-gray-700 text-sm mb-2">Logged Hours: {task.loggedHours}</p>
                    <p className="text-gray-700 text-sm mb-2">Updated On: {task.updatedOn}</p>
                    <p className="text-gray-700 text-sm mb-2">Status: {task.status}</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4" onClick={() => handleEdit(task)}>Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-black mb-2">Due Tomorrow</h2>
          <div className='flex flex-wrap'>
            {dueTomorrow.map((task, index) => (
              <div
                className="bg-white max-w-sm rounded-lg overflow-hidden shadow-lg p-6 border border-gray-200 m-4 cursor-pointer"
                key={index}
                onClick={() => handleCardClick(task)}
              >
                <h2 className="text-gray-900 font-bold text-xl mb-2">{task.taskType}</h2>
                <h3 className="text-gray-700 text-base mb-2">{task.projectName}</h3>
                <div className="text-gray-700 text-sm mb-2">Assigned To: {task.assignedTo}</div>
                <div className="text-gray-700 text-sm mb-2">Status: {task.status}</div>
                {showDetails === task._id && (
                  <div className="mt-4">
                    <p className="text-gray-700 text-sm mb-2">Due Date: {task.dueDate}</p>
                    <p className="text-gray-700 text-sm mb-2">Budget Hours: {task.budgetHours}</p>
                    <p className="text-gray-700 text-sm mb-2">Logged Hours: {task.loggedHours}</p>
                    <p className="text-gray-700 text-sm mb-2">Updated On: {task.updatedOn}</p>
                    <p className="text-gray-700 text-sm mb-2">Status: {task.status}</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4" onClick={() => handleEdit(task)}>Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-black mb-2">Due Next Week</h2>
          <div className='flex flex-wrap'>
  {dueNextWeek.map((task, index) => (
    <div
      className="bg-gray-100 max-w-lg rounded-lg overflow-hidden shadow-lg p-8 border border-gray-300 m-4 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
      key={index}
      onClick={() => handleCardClick(task)}
    >
      <h2 className="text-gray-900 font-bold text-2xl mb-2 bg-cyan-400 p-2 rounded-lg">{task.taskType}</h2>
      <h3 className="text-gray-800 text-xl mb-2">{task.projectName}</h3>
      <div className="text-gray-700 text-lg mb-2">Assigned To: <span className="font-semibold">{task.assignedTo}</span></div>
      <div className="text-gray-700 text-lg mb-2">Status: <span className="font-semibold">{task.status}</span></div>
      {showDetails === task._id && (
        <div className="mt-4">
          <p className="text-gray-700 text-lg mb-2">Due Date: <span className="font-semibold">{task.dueDate}</span></p>
          <p className="text-gray-700 text-lg mb-2">Budget Hours: <span className="font-semibold">{task.budgetHours}</span></p>
          <p className="text-gray-700 text-lg mb-2">Logged Hours: <span className="font-semibold">{task.loggedHours}</span></p>
          <p className="text-gray-700 text-lg mb-2">Updated On: <span className="font-semibold">{task.updatedOn}</span></p>
          <button className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-800 transition duration-200 mt-4" onClick={() => handleEdit(task)}>Edit</button>
        </div>
      )}
    </div>
  ))}
</div>


          <h2 className="text-xl font-bold text-black mb-2">Due Later</h2>
          <div className='flex flex-wrap'>
            {dueLater.map((task, index) => (
              <div
                className="bg-white max-w-sm rounded-lg overflow-hidden shadow-lg p-6 border border-gray-200 m-4 cursor-pointer"
                key={index}
                onClick={() => handleCardClick(task)}
              >
                <h2 className="text-gray-900 font-bold text-xl mb-2">{task.taskType}</h2>
                <h3 className="text-gray-700 text-base mb-2">{task.projectName}</h3>
                <div className="text-gray-700 text-sm mb-2">Assigned To: {task.assignedTo}</div>
                <div className="text-gray-700 text-sm mb-2">Status: {task.status}</div>
                {showDetails === task._id && (
                  <div className="mt-4">
                    <p className="text-gray-700 text-sm mb-2">Due Date: {task.dueDate}</p>
                    <p className="text-gray-700 text-sm mb-2">Budget Hours: {task.budgetHours}</p>
                    <p className="text-gray-700 text-sm mb-2">Logged Hours: {task.loggedHours}</p>
                    <p className="text-gray-700 text-sm mb-2">Updated On: {task.updatedOn}</p>
                    <p className="text-gray-700 text-sm mb-2">Status: {task.status}</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4" onClick={() => handleEdit(task)}>Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
