/**
 * Define the routes for the User resource.
 */
const userControllers = require("../controllers/user.controller");
const { authJwt } = require("../middlewares");
module.exports = (app) => {
    /**
    * GET 127.0.0.1:8081/crm/api/v1/users/
    */
    app.get("/crm/api/v1/users/", [authJwt.verifyToken, authJwt.isAdmin], userControllers.findAllUsers);
    /**
     * GET 127.0.0.1:8081/crm/api/v1/users/{Id}
     */
    app.get("/crm/api/v1/users/:userId", [authJwt.verifyToken], userControllers.findUserById)
    /**
     * PUT 127.0.0.1:8081/crm/api/v1/users/{userId}
     */
    app.put("/crm/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], userControllers.updateUser);
}