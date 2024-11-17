import React, { useState, useEffect } from "react";
import ReactSwitch from "react-switch";
import axios from "axios";
import "./Home.css";
import { FiSettings } from "react-icons/fi";

function Home() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [services, setServices] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeServices, setActiveServices] = useState({});
  const [quarterIndex, setQuarterIndex] = useState(0);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/services/allservices");
      if (response.data.success) {
        setServices(response.data.data);
      } else {
        console.error("Failed to fetch services");
      }
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  };

  useEffect(() => {
    fetchServices();

    // Set current quarter index based on current month
    const currentMonth = new Date().getMonth();
    setQuarterIndex(Math.floor(currentMonth / 3));
  }, []);

  const handleSliderChange = (month, service, value) => {
    setProgressData((prevData) => ({
      ...prevData,
      [month]: {
        ...prevData[month],
        [service]: value,
      },
    }));
  };

  const handleChange = (checked, serviceName) => {
    setActiveServices((prev) => {
      const updatedServices = { ...prev };
      if (checked) {
        updatedServices[serviceName] = true;
      } else {
        delete updatedServices[serviceName];
        setProgressData((prevData) => {
          const updatedProgressData = { ...prevData };
          for (const month in updatedProgressData) {
            if (updatedProgressData[month][serviceName]) {
              delete updatedProgressData[month][serviceName];
            }
          }
          return updatedProgressData;
        });
      }
      return updatedServices;
    });
  };

  const settingFn = () => {
    setIsModalOpen(!isModalOpen);
  };

  const displayedMonths = months.slice(quarterIndex * 3, quarterIndex * 3 + 3);

  const hasActiveServices = Object.keys(activeServices).length > 0;

  const currentMonth = new Date().getMonth();

  const handlePreviousQuarter = () => {
    setQuarterIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextQuarter = () => {
    setQuarterIndex((prev) => Math.min(prev + 1, 3));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900 dark:text-white relative">
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

      {/* Display "No Services Opted" message if no service is active */}
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

      {/* Grid Section */}
      {hasActiveServices && (
        <>
          <div className="flex justify-between items-center w-full max-w-4xl mb-4">
            <button
              onClick={handlePreviousQuarter}
              disabled={quarterIndex === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Previous Quarter
            </button>
            <button
              onClick={handleNextQuarter}
              disabled={quarterIndex === 3}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Next Quarter
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
              <>
                {/* Service Name */}
                <div
                  key={service}
                  className="bg-gray-300 dark:bg-gray-800 font-semibold py-2 px-4 text-center"
                >
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
                        className= {`w-full mt-2 ${months.indexOf(month) < currentMonth - 1 || months.indexOf(month) > currentMonth ? "cursor-not-allowed opacity-50" : ""}`}
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
              </>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
