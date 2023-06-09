const mongoose = require("mongoose");
const analyticsSchema = mongoose.Schema({
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
    },
    short_url: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});
const analyticsModel = mongoose.model("analytics", analyticsSchema);
module.exports = analyticsModel;