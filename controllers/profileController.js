const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Room = require("../models/roomModel");
const Notification = require("../models/notificationModel");
const bcrypt = require("bcrypt");
const passwordValidator = require('password-validator');

// Create the same schema as used in loginController
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)
    .is().max(100)
    .has().letters()
    .has().digits()
    .has().not().symbols()
    .has().not().spaces();

// @desc Get my profile (messages + user info)
// @route GET /profile
const getMyProfile = asyncHandler(async (req, res) => {
    const messages = await Message.find({ sender: req.user.id }).populate("room", "name");
    const user = await User.findById(req.user.id);
    res.render("profile", { messages, user: req.user, userInfo: user });
});

// @desc Update password
// @route PUT /profile/password
const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        req.flash("error_msg", "새 비밀번호가 일치하지 않습니다.");
        return res.redirect("/profile");
    }

    if (!passwordSchema.validate(newPassword)) {
        req.flash("error_msg", "비밀번호는 8자 이상, 영문 및 숫자 만 가능합니다.");
        return res.redirect("/profile");
    }

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        req.flash("error_msg", "현재 비밀번호가 올바르지 않습니다.");
        return res.redirect("/profile");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    req.flash("success_msg", "비밀번호가 성공적으로 변경되었습니다.");
    res.redirect("/profile");
});

// @desc Delete account
// @route DELETE /profile
const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // 1. Delete notifications
    await Notification.deleteMany({ $or: [{ recipient: userId }, { sender: userId }] });
    // 2. Delete messages
    await Message.deleteMany({ sender: userId });
    // 3. Handle Rooms (Delete rooms owned by user)
    const rooms = await Room.find({ owner: userId });
    for (const room of rooms) {
        await Message.deleteMany({ room: room._id });
        await room.deleteOne();
    }
    // 4. Delete User
    await User.findByIdAndDelete(userId);

    res.clearCookie("token");
    req.flash("success_msg", "계정이 삭제되었습니다.");
    res.redirect("/");
});

// @desc Update a message
const updateMessage = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const message = await Message.findById(req.params.id);
    if (!message) {
        req.flash("error_msg", "메시지를 찾을 수 없습니다.");
        return res.redirect("/profile");
    }
    if (message.sender.toString() !== req.user.id) {
        req.flash("error_msg", "자신의 메시지만 수정할 수 있습니다.");
        return res.redirect("/profile");
    }
    message.content = content;
    await message.save();
    req.flash("success_msg", "메시지가 수정되었습니다.");
    res.redirect("/profile");
});

// @desc Delete a message
const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);
    if (!message) {
        req.flash("error_msg", "메시지를 찾을 수 없습니다.");
        return res.redirect("/profile");
    }
    if (message.sender.toString() !== req.user.id) {
        req.flash("error_msg", "자신의 메시지만 삭제할 수 있습니다.");
        return res.redirect("/profile");
    }
    await Message.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "메시지가 삭제되었습니다.");
    res.redirect("/profile");
});

module.exports = {
    getMyProfile,
    updatePassword,
    deleteAccount,
    updateMessage,
    deleteMessage
};
