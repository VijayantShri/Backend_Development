/**
 * This will contain the route for the ticket of notification request.
 */

const notificationController = require("../controllers/notification.controller");

module.exports = (app) => {

    app.post("/notifServ/api/v1/notifications", notificationController.acceptNotificationRequest)
}