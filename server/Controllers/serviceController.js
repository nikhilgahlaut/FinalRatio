const serviceModel = require('../Models/ServiceModel.js')

exports.home = (req, res) => {
    res.send("<h1>service response</h1>")
}

exports.getAll = async(req,res)=>{
    try {

        const services = await serviceModel.find();
        res.status(200).json({
            success:true,
            data:services
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.serviceAdd = async (req,res)=>{
    try {
        const newService = serviceModel(req.body)
        const result = await newService.save()
        console.log(newService)
        return res.status(201).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error);
        
        if (error.code === 11000) {
            console.log(error);

            return res.status(400).json({
                success: false,
                message: 'duplicate entry'
            })
        }
        
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}