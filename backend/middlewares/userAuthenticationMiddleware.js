const jwt = require("jsonwebtoken");
require("dotenv").config();
const userAuthenticationMiddleware = (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if(authorization && authorization.startsWith("Bearer")) {
            const jwToken = authorization.split(" ")[1];
            const data = jwt.verify(jwToken, process.env.JWT_SECRET);
            req.body.google_oauth_sub = data.google_oauth_sub;
            next()
        }
        else {
            throw Error("Invalid Token");
        }
    }
    catch(e) {
        throw Error("Bearer Token invalid or missing");
    }
}
module.exports = userAuthenticationMiddleware;