const mongoose = require("mongoose");
const uuidSchema =  mongoose.Schema({ }, { timestamps: true });
const UuidModel = mongoose.model("Uuid", uuidSchema);
module.exports = UuidModel;