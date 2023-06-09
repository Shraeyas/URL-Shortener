const mongoose = require("mongoose");
const urlSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    url: {
        type: String,
        required: true
    },
    encoded_id: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});
const ShortUrlModel = mongoose.model("ShortUrls", urlSchema);
module.exports = ShortUrlModel;