const jwt = require("jsonwebtoken");
require("dotenv").config();
const urlAuthenticationMiddleware = (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if(authorization && authorization.startsWith("Bearer")) {
            const jwToken = authorization.split(" ")[1];
            const data = jwt.verify(jwToken, process.env.JWT_SECRET);
            req.body.google_oauth_sub = data.google_oauth_sub;
            next();
        }
        else {
            next();
        }
    }
    catch(e) {
        throw Error ("Invalid Bearer Token");
    }
}
module.exports = urlAuthenticationMiddleware;