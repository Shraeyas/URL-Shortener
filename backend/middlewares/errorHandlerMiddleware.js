require("dotenv").config();
const errorHandlerMiddleware = (e, req, res, next) => {
    let statusCode = res.statusCode | 500;
    res.status(statusCode).json({
        success: false,
        error: e.message,
        stack: process.env.ENV == "DEV"? e.stack:null
    });
}
module.exports = errorHandlerMiddleware;