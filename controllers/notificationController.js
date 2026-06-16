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

// @desc Delete a notification
// @route DELETE /notifications/:id
const deleteNotification = asyncHandler(async (req, res) => {
    const notif = await Notification.findById(req.params.id);
    if (!notif) {
        throw new Error("알림을 찾을 수 없습니다.");
    }
    if (notif.recipient.toString() !== req.user.id) {
        throw new Error("자신의 알림만 삭제할 수 있습니다.");
    }
    await Notification.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "알림이 삭제되었습니다.");
    res.redirect("/notifications");
});

module.exports = { getNotifications, deleteNotification };
