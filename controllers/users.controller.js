const asyncWrapper = require('../middleware/asyncWrapper');
require('dotenv').config();
const httpStatusText = require("../utills/httpStatusText");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const appError = require("../utills/appError");
const User = require('../models/user_model');
const generateJWT = require('../utills/generateJWT');
const getAllUsers = asyncWrapper(async (req, res) => {
    console.log(req.headers);
    const query = req.query;
    const limit = query.limit || 2;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { '__v': false, 'password': false }).limit(limit).skip(skip);

    res.json({ status: httpStatusText.Success, data: { users } });
})
const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password ,role} = req.body;

    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
        const error = appError.create("user already exists", 400, httpStatusText.Fail);
        return next(error);
    }
const avatar= req.file.filename;
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({
        firstName, lastName, email, password: hashedPass,role,avatar:avatar
    });    //generate token
   const token=await generateJWT({email: newUser.email, id: newUser._id,role: newUser.role});
   newUser.token=token;
    await newUser.save();
    res.status(201).json({ status: httpStatusText.Success, data: { user: newUser } });



})

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email,password);
    if (!email && !password) {
        const error = appError.create("email and password are required", 400, httpStatusText.Fail);
    }
    const user = await User.findOne({ email: email });

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (user.password && matchedPassword) {
        const token=await generateJWT({email: user.email, id: user._id,role: user.role});

        return res.status(201).json({ status: httpStatusText.Success, data: { token} });
    }
    else {
        const error = appError.create("email or password is wrong", 400, httpStatusText.Fail);
        return next(error);
    }
})

module.exports = {
    getAllUsers,
    register,
    login
}