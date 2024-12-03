const MonthlyProgress = require('../Models/progressModel');

// Controller to save or update monthly progress data
const saveOrUpdateMonthlyProgress = async (req, res) => {
  const { proj_id, serviceId, year, month, progress } = req.body;

  try {
    // Upsert progress data for the specific project, service, year, and month
    const updatedProgress = await MonthlyProgress.findOneAndUpdate(
      { proj_id, serviceId, year, month }, // Query
      { progress, updatedOn: new Date() }, // Update data
      { upsert: true, new: true } // Create if not exists, return updated document
    );

    res.status(200).json({
      success: true,
      message: 'Monthly progress data saved/updated successfully.',
      data: updatedProgress,
    });
  } catch (error) {
    console.error('Error saving monthly progress data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save/update monthly progress data.',
    });
  }
};

// Controller to get monthly progress data
const getMonthlyProgress = async (req, res) => {
    const { proj_id, serviceId } = req.params;
  
    if (!proj_id || !serviceId) {
      return res.status(400).json({
        success: false,
        message: 'proj_id and serviceId are required fields.',
      });
    }
  
    try {
      const query = { proj_id, serviceId };
  
      const progressData = await MonthlyProgress.find(query);
  
      if (!progressData || progressData.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No progress data found for the given criteria.',
        });
      }
  
      res.status(200).json({
        success: true,
        data: progressData,
      });
    } catch (error) {
      console.error('Error fetching monthly progress data:', error.message);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  };
  
  

module.exports = { saveOrUpdateMonthlyProgress,getMonthlyProgress };
