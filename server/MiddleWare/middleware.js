const signUpDataValidate = (req,res,next)=>{
    const {name,confirmPassword,password,email} = req.body

    if(!name ||!password || !email|| !confirmPassword){
        return res.status(400).json({
            success:false,
            message:"all fields are required!!"
        })
    }
    else if (confirmPassword != password) {
        return res.status(400).json({
            success: false,
            message: "password dosent match"
        })
    }
    next();
}

const loginDataValidate = (req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"every field is required"
        })
    }
    next();
}

const jwt = require('jsonwebtoken')

const jwtAuth = (req,res,next)=>{

    const token = (req.cookies && req.cookies.token)

    if(!token){
        return res.status(400).json({
            success:false,
            message:'Not Authorized!!'
        })
    }
    
    //if tokens exists
    try {
        const payload = jwt.verify(token,process.env.SECRET)
        console.log(payload);

        req.user = payload
        
    } catch (e) {
        res.status(400).json({
            success:false,
            message:e.message
        })
    }

    next();
}
module.exports = {signUpDataValidate,loginDataValidate,jwtAuth}

