const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "아이디는 필수 입력 항목입니다."],
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9_]+$/, "아이디는 영문, 숫자, 언더바(_)만 사용할 수 있습니다."],
        minlength: [3, "아이디는 최소 3자 이상이어야 합니다."],
        maxlength: [15, "아이디는 최대 15자까지 가능합니다."]
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", UserSchema);