// src/TimeTrackingPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimeTrackingPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    taskId: '',
    taskType: '',
    projectName: '',
    assignee: '',
    assignedTo: '',
    dueDate: '',
    budgetHours: 0,
    loggedHours: 0,
    updatedOn: '',
    comments: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/workTrack/getTime', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({
        taskId: '',
        taskType: '',
        projectName: '',
        assignee: '',
        assignedTo: '',
        dueDate: '',
        budgetHours: 0,
        loggedHours: 0,
        updatedOn: '',
        comments: ''
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div>
      <h1>Time Tracking Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="taskId" value={newTask.taskId} onChange={handleInputChange} placeholder="Task ID" required />
        <input type="text" name="taskType" value={newTask.taskType} onChange={handleInputChange} placeholder="Task Type" required />
        <input type="text" name="projectName" value={newTask.projectName} onChange={handleInputChange} placeholder="Project Name" required />
        <input type="text" name="assignee" value={newTask.assignee} onChange={handleInputChange} placeholder="Assignee" required />
        <input type="text" name="assignedTo" value={newTask.assignedTo} onChange={handleInputChange} placeholder="Assigned To" required />
        <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleInputChange} required />
        <input type="number" name="budgetHours" value={newTask.budgetHours} onChange={handleInputChange} placeholder="Budget Hours" required />
        <input type="number" name="loggedHours" value={newTask.loggedHours} onChange={handleInputChange} placeholder="Logged Hours" />
        <input type="date" name="updatedOn" value={newTask.updatedOn} onChange={handleInputChange} required />
        <textarea name="comments" value={newTask.comments} onChange={handleInputChange} placeholder="Comments"></textarea>
        <button type="submit">Add Task</button>
      </form>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.taskId}>
            {task.taskType} - {task.projectName} - {task.assignee} - {task.assignedTo} - {task.dueDate} - {task.budgetHours} - {task.loggedHours} - {task.updatedOn} - {task.comments}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeTrackingPage;
