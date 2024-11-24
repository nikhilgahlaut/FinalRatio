import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

function Access() {
  const [key, setKey] = useState('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isFetchingProjects, setIsFetchingProjects] = useState(false); // Loading state for projects
  

  // const projects = [
  //   { value: 'Project A', label: 'Project A' },
  //   { value: 'Project B', label: 'Project B' },
  //   { value: 'Project C', label: 'Project C' },
  // ];

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/user/access/getUsers'); // Adjust the endpoint
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsFetchingProjects(true);
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
        setIsFetchingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const definedUsers = users.filter(
    (user) => user.role !== 'undefined' && user.role !== 'app_admin'
  );
  const undefinedUsers = users.filter((user) => user.role === 'undefined');

  const filteredUsersDefined = definedUsers.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsersUndefined = undefinedUsers.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openModal = (user) => {
    console.log('Opening modal for user:', user); // Debugging log
    setSelectedUser(user);
    setSelectedUserType(user.role || ''); // Prepopulate role
    setSelectedProjects(
      user.wbs 
        ? user.wbs.map((project) => ({ value: project, label: project })) 
        : []
    );
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedUserType('');
    setSelectedProjects([]);
  };

  const handleProjectChange = (selectedOptions) => {
    setSelectedProjects(selectedOptions || []);
  };

  const handleUpdateAccess = async () => {
    if (!selectedUserType) {
      alert('Please select a user type.');
      return;
    }

    try {
      console.log('Selected projects:', selectedProjects.map((project) => project.value));
      const updatedUser = {
        email: selectedUser.email,
        usertype: selectedUserType,
        projectList: selectedProjects.map((project) => project.value),
      };

      const response = await axios.post('/user/updateAccess', updatedUser);

      setUsers(
        users.map((user) =>
          user.email === selectedUser.email
            ? { ...user, role: response.data.role, projects: response.data.projects }
            : user
        )
      );

      alert('Access updated successfully.');
      closeModal();
    } catch (err) {
      console.error('Error updating access:', err);
      alert('Failed to update access. Please try again.');
    }
  };

  return (
    <div id="controlled-tab-example" className="mb-3">
      <div className="flex border-b">
        <button
          className={`p-4 ${key === 'New' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => {
            setKey('New');
            setSearchQuery('');
          }}
        >
          New Access
        </button>
        <button
          className={`p-4 ${key === 'Existing' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => {
            setKey('Existing');
            setSearchQuery('');
          }}
        >
          Existing Access
        </button>
      </div>
      <div className="p-4">
        {isLoading ? (
          // Loading Spinner
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : key === 'New' ? (
          // New Access Tab
          <div>
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
              <input
                type="text"
                id="searchBox"
                className="w-full p-2 mb-4 border rounded"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <ul className="list-none list-inside space-y-2">
                {filteredUsersUndefined.map((user, index) => (
                  <li
                    key={index}
                    className="text-gray-700 hover:bg-gray-100 p-2 rounded cursor-pointer"
                    onClick={() => openModal(user)}
                  >
                    <span className="block text-lg font-bold">{user.name}</span>
                    <span className="block text-sm text-gray-500">{user.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          // Existing Access Tab
          <div>
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
              <input
                type="text"
                id="searchBox"
                className="w-full p-2 mb-4 border rounded"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <ul className="list-none list-inside space-y-2">
                {filteredUsersDefined.map((user, index) => (
                  <li
                    key={index}
                    className="text-gray-700 hover:bg-gray-100 p-2 rounded cursor-pointer"
                    onClick={() => openModal(user)}
                  >
                    <span className="block text-lg font-bold">{user.name}</span>
                    <span className="block text-sm text-gray-500">{user.email}</span>
                    <span className="block text-sm text-gray-400">{user.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>


      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p className="mb-2"><strong>Name:</strong> {selectedUser.name}</p>
            <p className="mb-4"><strong>Email:</strong> {selectedUser.email}</p>
            <div className="mb-4">
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                User Type
              </label>
              <select
                id="userType"
                className="w-full p-2 border rounded"
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
              >
                <option value="">Select User Type</option>
                <option value="staff">Staff</option>
                <option value="proj_client">Project Client</option>
                <option value="proj_owner">Project Owner</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="projects" className="block text-sm font-medium text-gray-700 mb-2">
                Projects
              </label>
              <Select
                id="projects"
                isMulti
                options={projects}
                value={selectedProjects}
                onChange={handleProjectChange}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateAccess}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Access;
