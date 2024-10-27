const Project = require('../Models/progressModel.js');

exports.home = (req, res) => {
    res.send("<h1>Progress response</h1>")
}

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        console.log(projects);
        
        res.status(200).json({
            success:true,
            data:projects});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
};


// Create or update project with initial progress data
exports.createProject = async (req, res) => {
    const { proj_id, serviceId, data } = req.body;

    try {
        // Find the project by proj_id and serviceId
        let project = await Project.findOne({ proj_id, serviceId });

        if (project) {
            // If project exists, update its data
            for (const [month, progressData] of Object.entries(data)) {
                project.data[month] = {
                    progress: progressData.progress,
                    updatedOn: new Date()
                };
            }
            await project.save();
            res.json({ message: 'Project updated with progress data', project });
        } else {
            // If project does not exist, create a new one
            const newData = {};
            for (const [month, progressData] of Object.entries(data)) {
                newData[month] = {
                    progress: progressData.progress,
                    updatedOn: new Date()
                };
            }

            project = new Project({
                proj_id,
                serviceId,
                data: newData
            });

            await project.save();
            res.status(201).json({ message: 'Project created with progress data', project });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating or updating project', error });
    }
};


// Get a project by proj_id and serviceId
exports.getProject = async (req, res) => {
    const { proj_id, serviceId } = req.params;

    try {
        const project = await Project.findOne({ proj_id, serviceId });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
};

// Update progress for a specific month
exports.updateProgress = async (req, res) => {
    const { proj_id, serviceId, month } = req.params;
    const { progress } = req.body;

    try {
        const project = await Project.findOne({ proj_id, serviceId });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update progress and updatedOn for the specified month
        project.data[month] = {
            progress,
            updatedOn: new Date()
        };

        await project.save();
        res.json({ message: 'Progress updated', project });
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error });
    }
};

