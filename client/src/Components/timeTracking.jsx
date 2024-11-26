import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from 'axios';

// TaskCard Component
const TaskCard = ({ task, onEdit }) => {
  const progressPercentage = (task.loggedHours / task.budgetHours) * 100;
  const cappedProgressPercentage = Math.min(progressPercentage, 100);
  const isOverBudget = task.loggedHours > task.budgetHours;
  const barColor =
    task.status === "Completed"
      ? "bg-green-500"
      : isOverBudget
        ? "bg-red-500"
        : "bg-blue-500";
  //console.log("creating task")

  return (
    <div className="bg-white shadow rounded p-4 relative">
      <h3 className="text-lg font-semibold">{task.taskType}</h3>
      <p className="text-sm text-gray-600">{task.projectName}</p>
      <p className="text-sm">
        <strong>Assigned to:</strong> {task.assignedTo}
      </p>
      <p className="text-sm">
        <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
      </p>

      {/* Progress Bar */}
      <div className="mt-4 relative">
        <div className="relative h-4 bg-gray-200 rounded overflow-hidden">
          <div
            className={`absolute h-full ${barColor}`}
            style={{ width: `${cappedProgressPercentage}%` }}
          ></div>
        </div>
        {isOverBudget && (
          <div
            className="absolute top-0 h-full flex items-center"
            style={{
              left: `${(task.budgetHours / task.loggedHours) * 100}%`,
            }}
          >
            <div className="w-0.5 h-full bg-white opacity-70"></div>
          </div>
        )}
      </div>

      {/* Hours Display */}
      <p className="text-sm text-center mt-1 text-gray-700">
        {task.loggedHours}/{task.budgetHours} hours
      </p>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(task)}
        className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded text-sm"
      >
        Edit
      </button>
    </div>
  );
};

// TaskList Component
const TaskList = ({ title, tasks, onEdit }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

// EditModal Component
const EditModal = ({ task, onClose, onSave }) => {
  const [loggedHours, setloggedHours] = useState(task.loggedHours);
  const [status, setStatus] = useState(task.status);
  const [selectedTaskId, setSelectedTaskId] = useState(task._id);

  const statusOptions = [
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  const handleSave = async () => {

    const dto  = {
      loggedHours : loggedHours,
      status : status
    };

    const response = await axios.put(`/workTrack/updateTime/${selectedTaskId}`, dto);

    onSave({ ...task, loggedHours, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">Edit Task</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Hours Logged</label>
          <input
            type="number"
            //value={loggedHours}
            //onChange={(e) => setloggedHours(Number(e.target.value))}
            value={loggedHours === 0 ? "" : loggedHours} // Prevent 0 from showing when input is cleared
            onChange={(e) => setloggedHours(e.target.value === "" ? 0 : Number(e.target.value))} // Handle empty string
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Status</label>
          <Select
            options={statusOptions}
            value={statusOptions.find((option) => option.value === status)}
            onChange={(selectedOption) => setStatus(selectedOption.value)}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// CreateTaskModal Component
const CreateTaskModal = ({ onClose, onCreate }) => {
  const [taskType, setTaskType] = useState("");
  const [projectName, setProjectName] = useState(null);
  const [assignedTo, setAssignedTo] = useState(null);
  const [budgetHours, setBudgetHours] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  // const users = [
  //     { value: "John Doe", label: "John Doe" },
  //     { value: "Jane Smith", label: "Jane Smith" },
  //     { value: "Alice Brown", label: "Alice Brown" },
  //   ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // setIsLoading(true);
        const response = await axios.get('/user/access/getUsers'); // Adjust the endpoint
        const formatedUsers = response.data.map((user) => ({
          value: user.name,
          label: user.name,
        }));

        ////console.log(formatedUsers); // Logs the formatted data correctly
        setUsers(formatedUsers); // Updates the state


      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again.');
      } finally {
        // setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  //console.log("users: ", users);

  // const projects = [
  //   { value: "Website Redesign", label: "Website Redesign" },
  //   { value: "Admin Panel", label: "Admin Panel" },
  //   { value: "Mobile App", label: "Mobile App" },
  //   { value: "Marketing Site", label: "Marketing Site" },
  // ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        //setIsFetchingProjects(true);
        const response = await axios.get('/client/clientData');
        const formattedProjects = response.data.data.map((project) => ({
          value: project.proj_name,
          label: project.proj_name,
        }));
        setProjects(formattedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects. Please try again.');
      } finally {
        //setIsFetchingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!taskType || !projectName || !assignedTo || !budgetHours || !dueDate) {
      alert("Please fill all the fields.");
      return;
    }
    const newTask = {
      taskType,
      projectName: projectName.label,
      assignedTo: assignedTo.label,
      budgetHours,
      loggedHours: 0,
      status: "Not Started",
      dueDate,
    };
    console.log(newTask);
    const response = await axios.post('/workTrack/addTime', newTask);
    //console.log(response);
    onCreate(newTask);

    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">Create New Task</h2>

        {/* Task Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Task Name</label>
          <input
            type="text"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Project Name Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Project Name</label>
          <Select
            options={projects}
            value={projectName}
            onChange={setProjectName}
            placeholder="Select Project"
            className="w-full"
          />
        </div>

        {/* Assigned To Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Assigned To</label>
          <Select
            options={users}
            value={assignedTo}
            onChange={setAssignedTo}
            placeholder="Select User"
            className="w-full"
          />
        </div>

        {/* Budget Hours */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Budget Hours</label>
          <input
            type="number"
            value={budgetHours === 0 ? "" : budgetHours} // Prevent 0 from showing when input is cleared
            onChange={(e) => setBudgetHours(e.target.value === "" ? 0 : Number(e.target.value))} // Handle empty string
            placeholder="Enter Hours"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const fetchTasksData = async () => {
  const response = await axios.get('/workTrack/getTime'); // replace with actual API URL
  ////console.log(response)
  const data = await response.data;
  return data;
};

// Main App Component
const App = () => {
  // const [tasks, setTasks] = useState([
  //   { id: 1, taskName: "Fix login bug", projectName: "Website Redesign", assignedTo: "John Doe", budgetHours: 5, loggedHours: 3, status: "In Progress", dueDate: "2024-11-30" },
  //   { id: 2, taskName: "Develop Dashboard", projectName: "Admin Panel", assignedTo: "Jane Smith", budgetHours: 10, loggedHours: 2, status: "Not Started", dueDate: "2024-12-02" },
  //   { id: 3, taskName: "Write API Documentation", projectName: "Website Redesign", assignedTo: "John Doe", budgetHours: 8, loggedHours: 4, status: "In Progress", dueDate: "2024-12-01" },
  //   { id: 4, taskName: "Refactor Codebase", projectName: "Mobile App", assignedTo: "Alice Brown", budgetHours: 15, loggedHours: 15, status: "Completed", dueDate: "2024-11-29" },
  //   { id: 5, taskName: "Create Landing Page", projectName: "Marketing Site", assignedTo: "Jane Smith", budgetHours: 6, loggedHours: 6, status: "Completed", dueDate: "2024-11-28" },
  // ]);


  const [editingTask, setEditingTask] = useState(null);
  const [creatingTask, setCreatingTask] = useState(false);
  const [developerFilter, setDeveloperFilter] = useState([]);
  const [projectFilter, setProjectFilter] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      const tasksData = await fetchTasksData();
      ////console.log("fetched data from DB")
      //console.log(tasksData)
      setTasks(tasksData);
      //setFilteredTasks(tasksData); // Initially set filtered tasks to all tasks
    };

    loadTasks();
  }, []);


  const developerOptions = [...new Set(tasks.map((task) => task.assignedTo))].map(
    (developer) => ({ value: developer, label: developer })
  );
  const projectOptions = [...new Set(tasks.map((task) => task.projectName))].map(
    (project) => ({ value: project, label: project })
  );

  const filteredTasks = tasks.filter((task) => {
    const developerMatch =
      developerFilter.length === 0 ||
      developerFilter.some((filter) => filter.value === task.assignedTo);
    const projectMatch =
      projectFilter.length === 0 ||
      projectFilter.some((filter) => filter.value === task.projectName);
    return developerMatch && projectMatch;
  });

  const handleSaveTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const handleCreateTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toDoTasks = filteredTasks
    .filter((task) => task.status === "Not Started")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const inProgressTasks = filteredTasks
    .filter((task) => task.status === "In Progress")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const completedTasks = filteredTasks
    .filter((task) => task.status === "Completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="max-w-6xl mx-auto p-4">

      {/* Filters */}
      <div className="flex justify-end mb-6 space-x-4">
        <Select
          isMulti
          options={developerOptions}
          value={developerFilter}
          onChange={setDeveloperFilter} // fix here
          placeholder="Filter by Developer"
          className="w-60"
        />
        <Select
          isMulti
          options={projectOptions}
          value={projectFilter}
          onChange={setProjectFilter} // fix here
          placeholder="Filter by Project"
          className="w-60"
        />
        <button
          onClick={() => setCreatingTask(true)}
          className="bg-green-500 text-white p-3 rounded-full"
        >
          Create New Task
        </button>
      </div>

      {/* Task Categories */}
      <TaskList title="To-Do" tasks={toDoTasks} onEdit={(task) => setEditingTask(task)} />
      <TaskList title="In Progress" tasks={inProgressTasks} onEdit={(task) => setEditingTask(task)} />
      <TaskList title="Completed" tasks={completedTasks} onEdit={(task) => setEditingTask(task)} />

      {/* Edit Modal */}
      {editingTask && (
        <EditModal task={editingTask} onClose={() => setEditingTask(null)} onSave={handleSaveTask} />
      )}

      {/* Create Task Modal */}
      {creatingTask && (
        <CreateTaskModal onClose={() => setCreatingTask(false)} onCreate={handleCreateTask} />
      )}
    </div>
  );
};

export default App;
