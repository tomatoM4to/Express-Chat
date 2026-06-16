const express = require("express");
const router = express.Router();
const checkLogin = require("../middleware/checkLogin");
const {
    getMyProfile,
    updatePassword,
    deleteAccount,
    updateMessage,
    deleteMessage
} = require("../controllers/profileController");

router.use(checkLogin);

router.route("/")
    .get(getMyProfile)
    .delete(deleteAccount);

router.put("/password", updatePassword);
router.put("/message/:id", updateMessage);
router.delete("/message/:id", deleteMessage);

module.exports = router;
