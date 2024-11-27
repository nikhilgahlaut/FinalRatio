import React, { useState, useEffect } from "react";
import ReactSwitch from "react-switch";
import axios from "axios";
import { FiSettings, FiMenu } from "react-icons/fi";
import Cookies from 'js-cookie'; // Import the js-cookie library
import { jwtDecode } from 'jwt-decode'; // Import the jwt-decode library
import "./Home.css";

function Home() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [services, setServices] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeServices, setActiveServices] = useState({});
  const [quarterIndex, setQuarterIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSliderTouched, setIsSliderTouched] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Ensure this is false by default
  const [userId, setUserId] = useState(null); // Assuming userId is fetched or passed here


  // Fetch available services from backend
  const fetchServices = async () => {
    try {
      const response = await axios.get("/services/allservices");
      if (response.data.success) {
        setServices(response.data.data);
      } else {
        console.error("Failed to fetch services");
      }
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  };

  // Fetch user services from backend
  const fetchUserServices = async () => {
    try {
      const response = await axios.get("/client/clientData");
      if (response.data.success) {
        const user = response.data.data.find((client) => client.proj_id === 1); // Replace with dynamic user proj_id
        if (user) {
          setActiveServices(
            user.servicesOptedFor.reduce((acc, service) => {
              acc[service] = true;
              return acc;
            }, {})
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch user services", error);
    }
  };

  // Handle service toggle in the settings modal
  const handleChange = async (checked, serviceName) => {
    setActiveServices((prev) => {
      const updatedServices = { ...prev };
      if (checked) {
        updatedServices[serviceName] = true;
      } else {
        delete updatedServices[serviceName];
      }

      // Save updated services to backend
      saveServicesToBackend(Object.keys(updatedServices));

      return updatedServices;
    });
  };

  // Save updated services to the backendy
  const saveServicesToBackend = async (services) => {
    try {
      const response = await axios.post("/client/updateServices", {
        proj_id: 1, // Replace with dynamic user proj_id
        servicesOptedFor: services,
      });

      if (!response.data.success) {
        console.error("Failed to update services");
      }
    } catch (error) {
      console.error("Error updating services", error);
    }
  };

  // Handle month slider change for progress
  const handleSliderChange = (month, service, value) => {
    setProgressData((prevData) => ({
      ...prevData,
      [month]: {
        ...prevData[month],
        [service]: value,
      },
    }));

    setIsSliderTouched(true); // Mark slider as touched
  };

  const saveProgressData = async () => {
    setIsSaving(true);

    try {
      const response = await axios.post("/client/updateServices", {
        proj_id: 1, // Replace with dynamic proj_id if required
        progressData,
      });

      if (response.data.success) {
        alert("Progress saved!");
        setIsSliderTouched(false); // Reset slider touch state after saving
      } else {
        alert("Failed to save progress. Please try again.");
      }
    } catch (error) {
      console.error("Error saving progress data:", error);
      alert("An error occurred while saving progress.");
    } finally {
      setIsSaving(false);
    }
  };

  // Open/close the settings modal
  const settingFn = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Set current quarter index based on the current month
  useEffect(() => {
    fetchServices();
    fetchUserServices();

    const currentMonth = new Date().getMonth();
    setQuarterIndex(Math.floor(currentMonth / 3));
  }, []);

  const displayedMonths = months.slice(quarterIndex * 3, quarterIndex * 3 + 3);

  const hasActiveServices = Object.keys(activeServices).length > 0;

  const currentMonth = new Date().getMonth();

  const handlePreviousQuarter = () => {
    setQuarterIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextQuarter = () => {
    setQuarterIndex((prev) => Math.min(prev + 1, 3));
  };


  useEffect(() => {
    // Fetch the token from cookies
    const token = Cookies.get("token");
    console.log("Home token:", token);

    if (token) {
      try {
        // Decode the token to get user info
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token Structure:", decodedToken);

        // Extract the userId from the decoded token
        const userIdFromToken = decodedToken.id;
        console.log("Extracted User ID:", userIdFromToken);

        setUserId(userIdFromToken);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.error("No token found in cookies");
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      console.log("No User ID available yet.");
      return;
    }

    const fetchProjects = async () => {
      try {
        const token = Cookies.get("token");
        console.log("Token in fetchProjects:", token);

        if (!token) {
          console.error("No token found");
          return;
        }

        // Make the API call
        const response = await axios.get(`/user/projects/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        const projects = response.data;
        if (projects.length > 0) {
          setProjects(projects);
          console.log("Set projects state:", projects);

          setSelectedProject(projects[0]);
          // console.log("Set selected project:", projects[0]);
        } else {
          console.error("No projects found");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [userId]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-[#fefdfb] dark:bg-gray-900 dark:text-white">
      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sliding Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-100 dark:bg-gray-800 shadow-md transform transition-transform duration-300 z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } w-64`}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Your Projects
          </h2>
          <ul>
            {projects && projects.length > 0 ? (

              projects.map((project, index) => (
                <li
                  key={index} // Using array index as key
                  className={`p-2 mb-2 rounded cursor-pointer ${selectedProject === project ? "bg-green-600 text-black" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  onClick={() => setSelectedProject(project)}
                >
                  {project}
                </li>
              ))
            ) : (
              <li className="text-gray-500 dark:text-gray-400">No Projects Found</li>
            )}
          </ul>

        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#fefdfb] dark:bg-gray-900 dark:text-white relative">
        {/* Menu Button */}
        {!isSidebarOpen && ( // Only show hamburger when sidebar is closed
          <button
            className="absolute top-4 left-4 p-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-full shadow-md z-50 hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={toggleSidebar}
          >
            <FiMenu size={24} />
          </button>
        )}

        <button
          onClick={settingFn}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <FiSettings size={24} />
        </button>

        {/* Settings Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Services</h2>
              <div className="mb-4 text-center">
                {services.length === 0 ? (
                  <div className="text-gray-600 dark:text-gray-400">No Services Available</div>
                ) : (
                  services.map((service) => (
                    <div key={service._id} className="flex justify-between items-center mb-2">
                      <h4 className="text-sm">{service.service_name}</h4>
                      <ReactSwitch
                        checked={activeServices[service.service_name] || false}
                        onChange={(checked) => handleChange(checked, service.service_name)}
                      />
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={settingFn}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* No services message */}
        {!hasActiveServices && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              No Services Opted
            </h2>
            <div className="text-lg text-gray-500 dark:text-gray-400">
              You haven't opted for any services yet. Please select services from the settings.
            </div>
          </div>
        )}

        {/* Services grid */}
        {hasActiveServices && (
          <>
            <div className="flex justify-between items-center w-full max-w-4xl mb-4">
              <button
                onClick={handlePreviousQuarter}
                disabled={quarterIndex === 0}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextQuarter}
                disabled={quarterIndex === 3}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <div className="grid grid-cols-[auto_repeat(3,_1fr)] gap-2 w-full max-w-4xl border border-gray-300 dark:border-gray-700 rounded-lg shadow-md overflow-hidden">
              {/* Month Headers */}
              <div className="bg-gray-200 dark:bg-gray-800 sticky top-0 z-10"></div>
              {displayedMonths.map((month) => (
                <div key={month} className="bg-gray-200 dark:bg-gray-800 text-center font-semibold py-2">
                  {month}
                </div>
              ))}

              {/* Service Rows */}
              {Object.keys(activeServices).map((service) => (
                <React.Fragment key={service}>
                  {/* Service Name */}
                  <div className="bg-gray-300 dark:bg-gray-800 font-semibold py-2 px-4 text-center">
                    {service}
                  </div>

                  {/* Progress Data */}
                  {displayedMonths.map((month) => (
                    <div
                      key={`${service}-${month}`}
                      className="flex items-center justify-center bg-white dark:bg-gray-900 p-2 border border-gray-300 dark:border-gray-700"
                    >
                      <div className="text-center">
                        <span>{progressData[month]?.[service] || 0}%</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={progressData[month]?.[service] || 0}
                          onChange={(e) =>
                            handleSliderChange(month, service, parseInt(e.target.value))
                          }
                          className={`w-full mt-2 ${months.indexOf(month) < currentMonth - 1 || months.indexOf(month) > currentMonth
                            ? "cursor-not-allowed opacity-50"
                            : ""
                            }`}
                          style={{
                            background: `linear-gradient(to right, ${months.indexOf(month) >= currentMonth - 1 &&
                              months.indexOf(month) <= currentMonth
                              ? "green"
                              : "gray"
                              } ${progressData[month]?.[service] || 0}%, #e0e0e0 0%)`,
                          }}
                          disabled={
                            months.indexOf(month) < currentMonth - 1 ||
                            months.indexOf(month) > currentMonth
                          }
                        />
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-end mt-4 w-full max-w-4xl">
              <button
                onClick={saveProgressData}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                disabled={!isSliderTouched || isSaving} // Disable if no slider touched or saving
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
