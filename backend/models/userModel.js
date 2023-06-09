const mongoose = require("mongoose");
const userModelSchema = mongoose.Schema({
    google_oauth_sub: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("User", userModelSchema);