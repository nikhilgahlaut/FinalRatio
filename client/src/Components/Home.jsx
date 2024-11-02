import React, { useState, useEffect } from 'react';
import './Home.css';
import { FiSettings } from 'react-icons/fi';
function Home() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const [services] = useState(["Service A", "Service B", "Service C"]);
  const [progressData, setProgressData] = useState({});
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState('');
  const settingFn = () => {
    // Settings action
  };
  // Determine the current month and set the current quarter index
  useEffect(() => {
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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900 dark:text-white relative">
      <button
        onClick={settingFn}
        className="absolute top-4 right-4 p-2 rounded-full text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        <FiSettings size={24} />
      </button>
      <div className="flex items-center justify-center space-x-4 mb-72">
        <button
          onClick={goLeft}
          disabled={currentMonthIndex === 0}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          &larr;
        </button>
        <div className={`overflow-hidden max-h-[500px] w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md`}>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 transition-transform duration-500 ${
              transitionDirection === 'left' ? '-translate-x-full' :
              transitionDirection === 'right'?'translate-x-full':''
            }`}
            style={{ transform: 'translateX(0)' }}
            onAnimationEnd={() => setTransitionDirection('')}
          >
            <div className="sticky top-0 grid grid-cols-1 auto-cols-fr text-center font-semibold bg-gray-200 dark:bg-gray-800">
              <div className="py-2"></div>
              {services.map((service, index) => (
                <div key={index} className="py-2 bg-gray-300 dark:bg-gray-700">
                  {service}
                </div>
              ))}
            </div>
            {displayedMonths.map((month, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-1 auto-cols-fr text-center">
                <div className="sticky left-0 bg-gray-200 dark:bg-gray-800 font-semibold py-2 px-4">
                  {month}
                </div>
                {services.map((service, colIndex) => (
                  <div
                    key={colIndex}
                    className="flex flex-col items-center py-2 px-4 bg-white dark:bg-gray-900 dark:text-green-600 border border-gray-300 dark:border-gray-700"
                  >
                    <span>{progressData[month]?.[service] || 0}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={progressData[month]?.[service] || 0}
                      onChange={(e) => handleSliderChange(month, service, parseInt(e.target.value))}
                      className={`w-full mt-2 ${months.indexOf(month) < currentMonth - 1 || months.indexOf(month) > currentMonth ? "cursor-not-allowed opacity-50" : ""}`}
                      style={{
                        background: `linear-gradient(to right, ${months.indexOf(month) >= currentMonth - 1 && months.indexOf(month) <= currentMonth ? "green" : "gray"}
                        ${progressData[month]?.[service] || 0}%, #e0e0e0 0%)`
                      }}
                      disabled={months.indexOf(month) < currentMonth - 1 || months.indexOf(month) > currentMonth}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={goRight}
          disabled={currentMonthIndex >= months.length - 3}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
export default Home;