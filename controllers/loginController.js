const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET

const getLogin = (req, res) => {
    res.render("home");
}

const getRegister = (req, res) => {
    res.render("register");
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, password, password2 } = req.body
    if (password === password2) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword
        });
        res.status(201).json({
            message: "Register successful",
            user
        });
    }
    else {
        res.send("Register Failed");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({
            message: "일치하는 사용자가 없습니다."
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            message: "일치하는 사용자가 없습니다."
        });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret);
    res.cookie("token", token, {
        httpOnly: true
    });
    res.redirect("/contacts");
});

const logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
}

module.exports = {
    getLogin,
    getRegister,
    registerUser,
    loginUser,
    logout
};