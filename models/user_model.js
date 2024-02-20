const mongoose=require('mongoose');
const validator=require('validator');
const userRole = require('../utills/useRoles');
const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: [validator.isEmail , 'filed must be a valid email address']

    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:[userRole.USER,userRole.ADMIN,userRole.MANAGER],
        default:userRole.USER
        },
    token:{
        type:String,
    },
    avatar:{
        type:String,
        default:'uploads/profile.jpg',
    }
})
module.exports= mongoose.model('User',userSchema);