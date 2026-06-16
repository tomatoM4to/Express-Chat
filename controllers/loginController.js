const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordValidator = require('password-validator');
require('dotenv').config();

// Create a schema
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)            // Minimum length 8
    .is().max(100)          // Maximum length 100
    .has().letters()        // Must have letters
    .has().digits()         // Must have digits
    .has().not().symbols()  // No symbols
    .has().not().spaces();  // No spaces

const jwtSecret = process.env.JWT_SECRET

const getLogin = (req, res) => {
    res.render("home");
}

const getRegister = (req, res) => {
    res.render("register");
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, password, password2 } = req.body

    if (password !== password2) {
        throw new Error("비밀번호가 일치하지 않습니다.");
    }

    if (!passwordSchema.validate(password)) {
        throw new Error("비밀번호는 8자 이상, 영문 및 숫자 만 가능합니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        username,
        password: hashedPassword
    });
    req.flash("success_msg", "회원가입이 완료되었습니다.");
    res.redirect("/");
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("일치하는 사용자가 없습니다.");
    }

    const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/rooms");
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
