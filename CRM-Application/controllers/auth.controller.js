const bcrypt = require("bcryptjs");
const constants = require("../utils/constants");
const User = require("../models/user.model");
const config = require("../configs/auth.config");
const jwt = require("jsonwebtoken");
/**
 * Controller for signup/regitration
 */

exports.signup = async (req, res) => {
    // How user registration will going to happen.
    if (!req.body.userStatus) {
        if (!req.body.userType || req.body.userType == constants.userType.customer) {
            userStatus = constants.userStatus.approved;
        } else {
            userStatus = constants.userStatus.pending;
        }
    }

    const userObjToBeStoredInDB = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        password: bcrypt.hashSync(req.body.password, 8),     // hashSync -> password, password.length
        userStatus: userStatus
    }
    /**
     * Insert this new user to the DB. Returns promise. Means use await. To use await use async function.
     */
    try {
        const userCreated = await User.create(userObjToBeStoredInDB);
        console.log("User created:", userCreated);

        const userCreatedResponse = {
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userType: userCreated.userType,
            userStatus: userCreated.userStatus,
            createdAt: userCreated.createdAt,
            updatedAt: userCreated.updatedAt
        }

        res.status(200).send(userCreatedResponse);
    } catch(err) {
        console.error("Error while creating new user", err.message);
        res.status(500).send({
            message: "some internal error while inserting new user."
        })
    }

}

/**
 * Controller for signin/login
 */

exports.signin = async (req, res) => {
    // Search the user if it exists.
    try{
        var user = await User.findOne({userId: req.body.userId});
    } catch (err) {
        console.log("Erro in searching user: ", err.message)
    }
    if (user==null) {
        return res.status(400).send({
            message: "Failed! User id dosn't exists."
        })
    }
    /**
     * Check if the user is approved or not.
     */
    if (user.userStatus != constants.userStatus.approved){
        return res.status(200).send({
            message: "Can't allow the login as the user is still not approved."
        })
    }
    // User is existing, then we do password matching.
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid){
        return res.status(401).send({
            message: "Invalid password"
        })
    }
    
    /** Successfully login */
    // Generate the access webtoken.
    const token = jwt.sign({id: user.userId}, config.secretKey,  {
        expiresIn: 600
    });
    const responseData = {
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        userStatus: user.userStatus,
        accessToken: token
    };
    res.status(200).send(responseData);
};