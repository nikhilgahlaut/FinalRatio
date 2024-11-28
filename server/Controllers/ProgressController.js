const Progress = require('../Models/progressModel'); // Import your Progress model

// Fetch progress data for a specific project
const getProgressData = async (req, res) => {
    const { proj_id } = req.params;

    try {
        const progress = await Progress.find({ proj_id });
        if (!progress || progress.length === 0) { 
            return res.status(404).json({ success: false, message: 'No progress data found for this project.' });
        }

        res.status(200).json({ success: true, data: progress });
    } catch (error) {
        console.error('Error fetching progress data:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// Save or update progress data
const saveProgressData = async (req, res) => {
    const { proj_id, progressData } = req.body;

    try {
        // Loop through progressData to update or create records
        for (const [serviceId, monthlyData] of Object.entries(progressData)) {
            const update = {};
            for (const [month, { progress }] of Object.entries(monthlyData)) {
                update[`data.${month}.progress`] = progress;
                update[`data.${month}.updatedOn`] = new Date();
            }

            await Progress.updateOne(
                { proj_id, serviceId },
                { $set: update },
                { upsert: true } // Create a new document if it doesn't exist
            );
        }

        res.status(200).json({ success: true, message: 'Progress data saved successfully.' });
    } catch (error) {
        console.error('Error saving progress data:', error);
        res.status(500).json({ success: false, message: 'Failed to save progress data.' });
    }
};

module.exports = {
    getProgressData,
    saveProgressData,
};
