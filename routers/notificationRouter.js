const express = require("express");
const router = express.Router();
const checkLogin = require("../middleware/checkLogin");
const { getNotifications } = require("../controllers/notificationController");

router.use(checkLogin);
router.get("/", getNotifications);

module.exports = router;
