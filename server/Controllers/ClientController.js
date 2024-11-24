// const clientModel = require('../Models/ClientModel.js');

// exports.home = (req, res) => {
//     res.send("<h1>Client response</h1>");
// };

// // Fetch all clients
// exports.getAllClient = async (req, res) => {
//     try {
//         const clients = await clientModel.find();
//         res.status(200).json({
//             success: true,
//             data: clients,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// // Add or Update Client
// exports.addClient = async (req, res) => {
//     const { proj_id, proj_name, servicesOptedFor } = req.body;

//     if (!proj_id || !proj_name || !servicesOptedFor) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing required fields: proj_id, proj_name, or servicesOptedFor",
//         });
//     }

//     try {
//         // Check if a client with the given proj_id already exists
//         let client = await clientModel.findOne({ proj_id });

//         if (client) {
//             // Update services if client exists
//             client.servicesOptedFor = servicesOptedFor;
//             await client.save();
//             return res.status(200).json({
//                 success: true,
//                 message: "Client services updated successfully",
//                 data: client,
//             });
//         } else {
//             // Create a new client if it doesn't exist
//             const newClient = new clientModel({ proj_id, proj_name, servicesOptedFor });
//             const result = await newClient.save();
//             return res.status(201).json({
//                 success: true,
//                 message: "Client added successfully",
//                 data: result,
//             });
//         }
//     } catch (error) {
//         console.error(error);

//         if (error.code === 11000) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Duplicate entry",
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

const clientModel = require('../Models/ClientModel.js');

// Home route
exports.home = (req, res) => {
    res.send("<h1>Client response</h1>");
};

// Get all clients
exports.getAllClient = async (req, res) => {
    try {
        const clients = await clientModel.find();
        res.status(200).json({
            success: true,
            data: clients,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Add new client
exports.addClient = async (req, res) => {
    try {
        const newClient = clientModel(req.body);
        const result = await newClient.save();
        return res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate entry',
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Update services for a client
exports.updateClientServices = async (req, res) => {
    try {
        const { proj_id, servicesOptedFor } = req.body;

        const client = await clientModel.findOneAndUpdate(
            { proj_id },
            { servicesOptedFor },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: client,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ClientController.js

// Add an endpoint to fetch services based on proj_id or user_id
exports.getUserServices = async (req, res) => {
    try {
        // Check if req.user is populated correctly
        if (!req.user || !req.user._id) {
            return res.status(400).json({ success: false, message: "User not authenticated" });
        }

        // Fetch the user from the database
        const user = await UserModel.findOne({ _id: req.user._id });

        // If no user is found, return a 404 error
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Ensure proj_id exists before querying services
        if (!user.proj_id) {
            return res.status(400).json({ success: false, message: "User has no associated project" });
        }

        // Fetch the services using proj_id
        const services = await ServiceModel.find({ proj_id: user.proj_id });

        // Return the services
        res.status(200).json({ success: true, services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


