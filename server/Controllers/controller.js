const userModel = require('../Models/UserModel.js')
const bcrypt = require('bcrypt')
exports.home = (req, res) => {
    res.send("<h1>Home response</h1>")
}

exports.signup = async (req, res) => {
    try {
        const userInfo = userModel(req.body)
        const result = await userInfo.save()
        console.log(userInfo)
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
};


exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel
            .findOne({ email })
            .select('+password')

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'invalid password' });
        }

        //generating token
        const token = user.jwtToken()
        user.password = undefined;

        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
        }

        res.cookie("token", token, cookieOption)
        res.status(200).json({
            success: true,
            message: 'login success!!',
            token
        })


    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        })
    }

}

exports.authUser = async (req, res) => {
    //making a varibale and store user id from somewhere
    //req.user takes user information using middleWare
    const userId = req.user.id
    try {
        const user = await userModel.findById(userId).select('-password')
        console.log(user);

        return res.status(200).json({
            success: true,
            message: 'authentication succesfull',
            user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

exports.logout = (req, res) => {
    try {
        const cookieOptions = {
            expires: new Date(),
            httpOnly: true
        }
        res.cookie("token", null, cookieOptions)
        return res.status(200).json({
            success: true,
            message: "logged out!!"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateAccess = async (req, res) => {
    const { email, usertype, projectList } = req.body;
    try {
      const user = await userModel.findOneAndUpdate(
        { email },
        { role: usertype, wbs: projectList }, // Update role and projects
        { new: true } // Return the updated document
      );
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  
  

exports.getUsersByStatus = async (req, res) => {
    const { statusType } = req.params;
  
    try {
      let users;
      users = await userModel.find({}, 'name email role wbs');
  
      if (users.length === 0) {
        return res.status(404).send('No users found');
      }
  
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };