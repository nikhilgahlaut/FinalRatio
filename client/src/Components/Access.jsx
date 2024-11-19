import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Select from 'react-select';

function Access() {
  const [key, setKey] = useState('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [usersUndefined, setUsersUndefined] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [usersDefined, setUsersDefined] = useState([]);
  const [isLoading2, setIsLoading2] = useState(true); // For loading state
  const [error2, setError2] = useState(null); // For error state

  // const [users, setUsers] = useState([
  //   { name: 'John Doe', email: 'john.doe@example.com' },
  //   { name: 'Test User', email: 'test.user@example.com' },
  //   { name: 'Another User Doe', email: 'another.user@example.com' },
  // ]);
  const projects = [
    { value: 'Project A', label: 'Project A' },
    { value: 'Project B', label: 'Project B' },
    { value: 'Project C', label: 'Project C' },
  ];

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('user/access/undefined'); // Adjust the endpoint as needed
        setUsersUndefined(response.data);
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
    const fetchUsers = async () => {
      try {
        setIsLoading2(true);
        const response = await axios.get('user/access/defined'); // Adjust the endpoint as needed
        setUsersDefined(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError2('Failed to fetch users. Please try again.');
      } finally {
        setIsLoading2(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = usersUndefined.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (user) => {
    setSelectedUser(user);
    setSelectedUserType(''); // Reset user type selection when opening the modal
    setSelectedProjects([]); // Reset selected projects when opening the modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleReject = () => {
    setUsers(users.filter(user => user !== selectedUser));
    closeModal();
  };

  const handleProjectChange = (selectedOptions) => {
    setSelectedProjects(selectedOptions || []);
  };

  const removeProject = (project) => {
    setSelectedProjects(selectedProjects.filter(p => p.value !== project.value));
  };

  return (
    <div id="controlled-tab-example" className="mb-3">
      <div className="flex border-b">
        <button
          className={`p-4 ${key === 'New' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => setKey('New')}
        >
          New Access
        </button>
        <button
          className={`p-4 ${key === 'Existing' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => setKey('Existing')}
        >
          Existing Access
        </button>
      </div>
      <div className="p-4">
        {key === 'New' && (
          <div>
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
              <input
                type="text"
                id="searchBox"
                className="w-full p-2 mb-4 border rounded"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <ul className="list-none list-inside space-y-2">
                {filteredUsers.map((user, index) => (
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
        )}
        {key === 'Existing' && <div>Tab content for Existing Access</div>}
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
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
              <select
                id="userType"
                className="w-full p-2 border rounded"
                value={selectedUserType}
                onChange={e => setSelectedUserType(e.target.value)}
              >
                <option value="">Select User Type</option>
                <option value="Staff">Staff</option>
                <option value="Project Client">Project Client</option>
                <option value="Project Owner">Project Owner</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="projects" className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
              <Select
                id="projects"
                isMulti
                options={projects}
                value={selectedProjects}
                onChange={handleProjectChange}
                className="w-full"
              />
            </div>
            {/* {selectedProjects.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Selected Projects</label>
                <div className="flex flex-wrap">
                  {selectedProjects.map((project, index) => (
                    <div key={index} className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 mr-2 mb-2">
                      <span className="mr-2">{project.label}</span>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => removeProject(project)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Access;