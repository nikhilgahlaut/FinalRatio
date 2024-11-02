const TrackingModel = require('../Models/timetrackModel.js')

exports.home = (req, res) => {
    res.send("<h1>Progress response</h1>")
}

// get method for the time-tracking 
exports.getAlltime =  async(req, res) => {
    try {
      const tasks = await TrackingModel.find();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // POST method to create a new task
  exports.postAlltime = async(req, res) => {

    const task = TrackingModel(req.body)
   /* const task = new TrackingModel({
      taskId: req.body.taskId,
      taskType: req.body.taskType,
      projectName: req.body.projectName,
      assignee: req.body.assignee,
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
      budgetHours: req.body.budgetHours,
      loggedHours: req.body.loggedHours,
      updatedOn: req.body.updatedOn,
      comments: req.body.comments
    });
  */
    try {
      const newTask = await task.save();
      res.status(201).json(newTask);
    } catch (error){ 
        console.log(error)
        if(error.code === 11000){ // this is the status code for duplication record in mongoDB
            return res.status(400).json({message: "Duplication record "}) 
        } 
        else
        {    
      res.status(400).json({ message: error.message });
        }
    }
  };
  
  
  
  
  