const mongoose = require("mongoose");
require("dotenv").config();

const MongoDbConnect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (e) {
        console.log("Error connecting to DB", e.stack);
    }
};
module.exports = MongoDbConnect;