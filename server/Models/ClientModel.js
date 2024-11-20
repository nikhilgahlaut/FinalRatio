const mongoose = require('mongoose')

const clientModel = new mongoose.Schema({
    proj_id:{
        require:true,
        type: Number,
        unique:true,
    },
    proj_name:{
        require:true,
        type:String,
    },
    servicesOptedFor:{
        required:true,
        type:[String], 
        default: [] ,
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },

})


module.exports = new mongoose.model('clientModel',clientModel)
