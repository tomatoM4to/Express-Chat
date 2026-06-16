const jwt = require("jsonwebtoken");
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const checkLogin = async (req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/");
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = { id: decoded.id, username: decoded.username };
        next();
    } catch (err) {
        req.flash("error_msg", "로그인이 필요합니다.");
        return res.redirect("/");
    }
};

module.exports = checkLogin;