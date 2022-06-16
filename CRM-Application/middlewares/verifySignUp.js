/**
 * This file will contain the custom middleware for verifying the request body.
 */

const User = require("../models/user.model");
const constants = require("../utils/constants");

module.exports = validateSignUpRequest = async (req, res, next) => {
    // Validate if userName exists.
    if (!req.body.name) {
        return res.status(400).send({
            message: "Failed ! User name is not provided."
        })
    }

    // Validate if userId exists.
    if (!req.body.userId) {
        return res.status(400).send({
            message: "Failed ! User ID  is not provided."
        })
    }

    /**
     * Validate if user is not present.
     */

    const user = await User.findOne({userId: req.body.userId});
    if (user != null) {
        return res.status(400).send({
            message: "Failed ! UserId already exists."
        })
    }

    // Validate if email ID exists.
    if (!req.body.email) {
        return res.status(400).send({
            message: "Failed ! User email is not provided."
        })
    }

    // Validate if password exists.
    if (!req.body.password) {
        return res.status(400).send({
            message: "Failed ! Password  is not provided."
        })
    }

    /**
     * If email is already exists or not.
     */
    const email = await User.findOne({email: req.body.email});
    if (email != null){
        return res.status(400).send({
            message: "Failed ! Email ID already exists."
        })
    }

    // Validate if userType is correct or not.
    const userTypes = [ constants.userType.customer, constants.userType.engineer, constants.userType.admin];
    const userType = req.body.userType;
    if (userType && !userTypes.includes(userType)) {
        return res.status(400).send({
            message: "Failed ! User type  is not correctly provided."
        })
    }
    /**
     * Validate the email is in correct format or not.
     */
    next(); // give the control to the controllers.
}

module.exports = { 
    validateSignUpRequest: validateSignUpRequest
}