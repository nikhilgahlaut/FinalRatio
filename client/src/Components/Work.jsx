import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    status: '',
    comments: ''
  });
  const [assignedToFilter, setAssignedToFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
      status: '',
      comments: ''
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

  const filteredTasks = tasks.filter(task => {
    return (
      (assignedToFilter === '' || task.assignedTo.toLowerCase().includes(assignedToFilter.toLowerCase())) &&
      (projectFilter === '' || task.projectName.toLowerCase().includes(projectFilter.toLowerCase()))
    );
  });

  return (
    <div>
      {showForm ? (
        <section className='bg-white dark:bg-gray-900 min-h-screen'>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto ">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">ADD TASK</div>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h2>{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
          <TaskForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={isEditing ? handleUpdateItem : handleAddItem}
            isEditing={isEditing}
            showForm={showForm}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 space-y-4 md:space-y-6" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      </div>
      
    </section>
      ) : (
        <div className="bg-sky-950 bg-contain">
          <h1 className='bg-grey-700 font-bold py-2 px-4 text-white font-bold'>Work Page</h1>
          <div className='flex flex-row-reverse ... flex flex-wrap'>
          <button onClick={() => setShowForm(true)} className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full padding p-4 border ">+Add Task</button>
          <input
            type="text"
            className="border border-gray-300 rounded p-3 mr-2"
            placeholder="Filter by Assigned To"
            value={assignedToFilter}
            onChange={(e) => setAssignedToFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Project"
            className="border border-gray-300 rounded p-3 mr-2"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          />
          </div>
          <div className='flex flex-row ... flex flex-wrap'>
          {filteredTasks.map((task, index) => (
            <div className=" bg-gray-700 grid grid-cols-3 gap-3 max-w-sm rounded-lg overflow-hidden shadow-lg p-6 bg-blue border border-gray-200 m-4 filters p-3 " key={index}>
        <div className="">
        <h2 className="text-white mb-4">{task.taskType}</h2>
        <h2 className="text-white mb-3">{task.projectName}</h2>
      <div className="text-white mb-4">{task.loggedHours}</div>
      <div className="text-white mb-4">{task.assignedTo}</div>
      <div className="text-green-600 mb-4 ">{task.status}</div>
      <button className="bg-gray-700 hover:bg-blue-800 text-white font py-1 px-2 rounded-full padding p-1" onClick={() => handleEdit(task)}>Edit</button>
    </div>
</div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Work;