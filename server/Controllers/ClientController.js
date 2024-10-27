const clientModel = require('../Models/ClientModel.js')

exports.home = (req, res) => {
    res.send("<h1>Client response</h1>")
}

exports.getAllClient = async(req,res)=>{
    try {

        const client = await clientModel.find();
        res.status(200).json({
            success:true,
            data:client
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.addClient = async (req,res)=>{
    try {
        const newClient = clientModel(req.body)
        const result = await newClient.save()
        console.log(newClient)
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