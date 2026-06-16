const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");
const Message = require("../models/messageModel");

// @desc Get all rooms
// @route GET /rooms
const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find().populate("owner", "username");
    res.render("rooms", { rooms, user: req.user });
});

// @desc Create a room
// @route POST /rooms
const createRoom = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === "") {
        req.flash("error_msg", "방 이름을 입력해 주세요.");
        return res.redirect("/rooms");
    }
    await Room.create({
        name: name.trim(),
        owner: req.user.id
    });
    req.flash("success_msg", "새로운 채팅방이 생성되었습니다.");
    res.redirect("/rooms");
});

// @desc Delete a room
// @route DELETE /rooms/:id
const deleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);
    if (!room) {
        req.flash("error_msg", "존재하지 않는 방입니다.");
        return res.redirect("/rooms");
    }
    if (room.owner.toString() !== req.user.id) {
        req.flash("error_msg", "방 소유자만 삭제할 수 있습니다.");
        return res.redirect("/rooms");
    }
    await Room.findByIdAndDelete(req.params.id);
    await Message.deleteMany({ room: req.params.id });
    req.flash("success_msg", "방이 삭제되었습니다.");
    res.redirect("/rooms");
});

// @desc Join a room
// @route GET /rooms/:id
const joinRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id).populate("owner", "username");
    if (!room) {
        req.flash("error_msg", "존재하지 않는 방입니다.");
        return res.redirect("/rooms");
    }
    const messages = await Message.find({ room: req.params.id }).populate("sender", "username");
    res.render("room", { room, messages, user: req.user });
});

module.exports = {
    getAllRooms,
    createRoom,
    deleteRoom,
    joinRoom
};
