const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: [true, "방 이름은 필수입니다."],
        unique: true,
        trim: true,
        minlength: [2, "방 이름은 최소 2자 이상이어야 합니다."],
        maxlength: [20, "방 이름은 최대 20자까지 가능합니다."]
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Room", RoomSchema);
