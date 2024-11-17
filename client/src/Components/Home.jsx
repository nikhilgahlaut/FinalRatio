import React, { useState, useEffect } from 'react';
import ReactSwitch from 'react-switch';
import axios from 'axios';
import './Home.css';
import { FiSettings } from 'react-icons/fi';

function Home() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const [services, setServices] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeServices, setActiveServices] = useState({});

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/services/allservices');
      if (response.data.success) {
        setServices(response.data.data);
      } else {
        console.error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  };

  useEffect(() => {
    fetchServices();

    // Set current month index to start of the current quarter
    const currentMonth = new Date().getMonth();
    const quarterStart = Math.floor(currentMonth / 3) * 3;
    setCurrentMonthIndex(quarterStart);
  }, []);

  const handleSliderChange = (month, service, value) => {
    setProgressData(prevData => ({
      ...prevData,
      [month]: {
        ...prevData[month],
        [service]: value
      }
    }));
  };

  const handleChange = (checked, serviceName) => {
    setActiveServices(prev => {
      const updatedServices = { ...prev };
      if (checked) {
        // If toggled on, add the service to active services
        updatedServices[serviceName] = true;
      } else {
        // If toggled off, remove the service and its progress data
        delete updatedServices[serviceName];
        setProgressData(prevData => {
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

  const goLeft = () => {
    if (currentMonthIndex > 0) {
      setTransitionDirection('left');
      setCurrentMonthIndex(currentMonthIndex - 3);
    }
  };

  const goRight = () => {
    if (currentMonthIndex < months.length - 3) {
      setTransitionDirection('right');
      setCurrentMonthIndex(currentMonthIndex + 3);
    }
  };

  const displayedMonths = months.slice(currentMonthIndex, currentMonthIndex + 3);
  const currentMonth = new Date().getMonth();

  const hasActiveServices = Object.keys(activeServices).length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-1 bg-white dark:bg-gray-900 dark:text-white relative">
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
            <div className="mb-4" style={{ textAlign: "center" }}>
              {services.length === 0 ? (
                <div className="text-gray-600 dark:text-gray-400">No Services Available</div>
              ) : (
                services.map(service => (
                  <div key={service._id} className="flex justify-center items-center mb-2">
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

      {/* Show the grid only if services are selected */}
      {hasActiveServices && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={goLeft}
            disabled={currentMonthIndex === 0}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            &larr;
          </button>
          <div className="overflow-hidden max-h-[500px] w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 transition-transform duration-500 ${transitionDirection === 'left' ? '-translate-x-full' :
                transitionDirection === 'right' ? 'translate-x-full' : ''
                }`}
              style={{ transform: 'translateX(0)' }}
              onAnimationEnd={() => setTransitionDirection('')}
            >
              <div className="sticky top-0 grid grid-cols-1 auto-cols-fr text-center font-semibold bg-gray-200 dark:bg-gray-800">
                <div className="py-2"></div>
                {services.length === 0 ? (
                  <div className="text-center py-4">No Services Taken</div>
                ) : (
                  services.map((service, index) => (
                    <div key={index} className="py-2 bg-gray-300 dark:bg-gray-700">
                      {service.service_name}
                    </div>
                  ))
                )}
              </div>

              {displayedMonths.map((month, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 auto-cols-fr text-center">
                  <div className="sticky left-0 bg-gray-200 dark:bg-gray-800 font-semibold py-2 px-4">
                    {month}
                  </div>
                  {services.length === 0 ? (
                    <div className="col-span-full py-4 text-center text-gray-500 dark:text-gray-400">No Services Taken</div>
                  ) : (
                    services.map((service, colIndex) => (
                      activeServices[service.service_name] && (
                        <div
                          key={colIndex}
                          className="flex flex-col items-center py-2 px-4 bg-white dark:bg-gray-900 dark:text-green-600 border border-gray-300 dark:border-gray-700"
                        >
                          <span>{progressData[month]?.[service.service_name] || 0}%</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={progressData[month]?.[service.service_name] || 0}
                            onChange={(e) => handleSliderChange(month, service.service_name, parseInt(e.target.value))}
                            className={`w-full mt-2 ${months.indexOf(month) < currentMonth - 1 || months.indexOf(month) > currentMonth ? "cursor-not-allowed opacity-50" : ""}`}
                            style={{
                              background: `linear-gradient(to right, ${months.indexOf(month) >= currentMonth - 1 && months.indexOf(month) <= currentMonth ? "green" : "gray"}
                                ${progressData[month]?.[service.service_name] || 0}%, #e0e0e0 0%)`
                            }}
                            disabled={months.indexOf(month) < currentMonth - 1 || months.indexOf(month) > currentMonth}
                          />
                        </div>
                      )
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={goRight}
            disabled={currentMonthIndex + 3 >= months.length}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
