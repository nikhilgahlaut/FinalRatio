const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const userModel = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true, 
        
    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength:[8,'minimum 8 charachter required']
    },
    role:{
        type:String,
        enum: ['app_admin', 'proj_owner','proj_client','staff','undefined'], // Define user roles
        default: 'undefined',
    },
    wbs:{
        type:[String]
    }

},{
    timestamps:true
})

//encrypting password before saving

userModel.pre('save',async function (next) {
    if(!this.isModified('password')){
        return next;
    }
    this.password = await bcrypt.hash(this.password,10)
    return next;
})

//using a meathod to generate jwtTokens
userModel.methods = {
    jwtToken() {
        return JWT.sign(
            { id: this._id,email:this.email,username:this.name,role:this.role},
            process.env.SECRET,
            { expiresIn: '24h' })
    }
}

module.exports = new mongoose.model('userData',userModel)