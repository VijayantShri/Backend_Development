const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const User = require("../models/user.model");
const contants = require("../utils/constants");
/**
 * Authentication 
 *      - If the token is passed is valid or not.
 * 
 * 1. If no token is passed in the request header - Not Allowed
 * 2. If the token is passed: Authenticated
 *      if correct allow, else reject
 */

verifyToken = (req, res, next) => {
    /**Read the token from header. */
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    // If token is provided then verify it.
    jwt.verify(token, config.secretKey, (err, decoded) => {
         if (err) {
             return res.status(401).send({
                 message: "Unauthorized!"
             });
         }
        //  I will try to read the userId from the decoded token and store it in req object.
        req.userId = decoded.id;
        next();
    });
}

isAdmin = async (req, res, next) => {
    // Fetch user from the DB using the userId.
    const user = await User.findOne({userId: req.userId});

    // Check what is the userType.
    if (user && user.userType == contants.userType.admin) {
        next();
    } else {
        res.status(403).send({
            message: "Requires ADMIN role."
        });
    }
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
}

module.exports = authJwt;