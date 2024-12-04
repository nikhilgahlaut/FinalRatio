const MonthlyProgress = require('../Models/progressModel');

// Controller for handling progress
const saveProgress = async (req, res) => {
  const { proj_id, serviceId, year, month, progress } = req.body;

  try {
    // Check if a record exists for the given proj_id, serviceId, year, and month
    const existingRecord = await MonthlyProgress.findOne({ proj_id, serviceId, year, month });

    if (existingRecord) {
      // Update existing record
      existingRecord.progress = progress;
      existingRecord.updatedOn = new Date();
      await existingRecord.save();

      return res.status(200).json({
        message: 'Progress updated successfully',
        data: existingRecord,
      });
    }

    // Create a new record
    const newProgress = new MonthlyProgress({ proj_id, serviceId, year, month, progress });
    await newProgress.save();

    return res.status(201).json({
      message: 'Progress saved successfully',
      data: newProgress,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error saving progress',
      error: error.message,
    });
  }
};

const fetchProgress = async (req, res) => {
  const { proj_id, serviceId } = req.query;

  try {
    // Fetch all records for the given proj_id and serviceId
    const progressData = await MonthlyProgress.find({ proj_id, serviceId });

    if (!progressData.length) {
      return res.status(200).json({
        message: 'No progress data found for the given project and service ID',
        data: progressData,
      });
    }

    return res.status(200).json({
      message: 'Progress data fetched successfully',
      data: progressData,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching progress data',
      error: error.message,
    });
  }
};

module.exports = {
  saveProgress,
  fetchProgress,
};
