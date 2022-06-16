/**
 * This file will have all the logic to manipulate the User account.
 */

const User = require("../models/user.model");
const objectConverter = require("../utils/objectConverter");
 /**
  * Fetch the list of all users.
  *     - Only Admin is allowed to call this method.
  *     - Admin should be able to filter based on:
  *         1. Name
  *         2. UserType
  *         3. UserStatus
  */

exports.findAllUsers = async (req, res) => {
    // Read the data from the query params

    const nameReq = req.query.name;
    const userTypeReq = req.query.userType;
    const userStatusReq = req.query.userStatus;

    const mongoQueryObj = {};
    if (nameReq) mongoQueryObj.name = nameReq
    if (userTypeReq) mongoQueryObj.userType = userTypeReq
    if (userStatusReq) mongoQueryObj.userStatus = userStatusReq
    
    try{
        const users = await User.find(mongoQueryObj);
        const responseData = objectConverter.userResponse(users);
        
        return res.status(200).send(responseData);
    } catch(err) {
        console.log(err.message);
        res.status(500).send({
            message: "Internal error while fetching all users."
        })
    }
}

/**
  * Fetch user based on userId.
  */

exports.findUserById = async (req, res) => {
    const userIdReq = req.params.userId;   // reading from the request params.
    const user = await User.find({userId: userIdReq});
    if (user) {
        const responseData = objectConverter.userResponse(user);
        res.status(200).send(responseData);
    } else {
        res.status(200).send({
            message: "User with id " + userIdReq + " dosen't exists."
        });
    }
}

 /**
  * Update the user - status, userType.
  *     -only Admin should be allowed to do this. 
  * ADMIN -> name, userStatus, userType
  */

exports.updateUser = (req, res) => {
    // One of the ways of updating.
    try {
        const userIdReq = req.params.userId;

        const user = User.findOneAndUpdate({
            userId: userIdReq
        },
        {
            name: req.body.name,
            userStatus: req.body.userStatus,
            userType: req.body.userType
        }).exec();

        if (user) {
            res.status(200).send({
                message: "User record successfully updated."
            });
        } else {
            res.status(200).send({
                message: "There is no user with " + req.params.userId
            });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            message: "Internal server error while updating"
        });
    }

}