const express = require("express");
const router = express.Router();
const checkLogin = require("../middleware/checkLogin");
const {
    getAllRooms,
    createRoom,
    deleteRoom,
    joinRoom
} = require("../controllers/roomController");

router.use(checkLogin);

router.route("/")
    .get(getAllRooms)
    .post(createRoom);

router.route("/:id")
    .get(joinRoom)
    .delete(deleteRoom);

module.exports = router;
