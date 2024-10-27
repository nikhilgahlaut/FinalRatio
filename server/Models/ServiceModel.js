const mongoose = require("mongoose");

const serviceModel = new mongoose.Schema({
    service_id:{
        type: Number, 
        unique: true, 
        // default: async () => await getNextSequenceValue('userId') 
    },
    service_name:{
        type:String
    }
},{
    timestamps:true
})

module.exports = new mongoose.model('ServiceOffered',serviceModel)