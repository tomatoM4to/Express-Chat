const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

// @desc Get all my notifications
// @route GET /notifications
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user.id })
        .populate("sender", "username")
        .populate("room", "name")
        .sort({ createdAt: -1 });
    
    // Mark as read after viewing
    await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
    
    res.render("notifications", { notifications, user: req.user });
});

module.exports = { getNotifications };
