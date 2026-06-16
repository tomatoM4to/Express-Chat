const express = require("express");
const router = express.Router();
const checkLogin = require("../middleware/checkLogin");
const { getNotifications, deleteNotification } = require("../controllers/notificationController");

router.use(checkLogin);
router.get("/", getNotifications);
router.delete("/:id", deleteNotification);

module.exports = router;
