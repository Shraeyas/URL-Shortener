const UuidModel = require("../models/uuidModel");
require("dotenv").config();
const Snowflake = require("./Snowflake");
const generateUUID = async () => {
    if (process.env.UUID_GENERATOR === "SNOWFLAKE") {
        let snowflake = new Snowflake();
        return snowflake.nextId();
    }
    else {
        let uuid = await UuidModel.create({});
        return uuid._id;
    }
}
module.exports = { generateUUID };