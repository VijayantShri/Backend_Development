/**
 * Controller for the notification request.
 */

const Notification = require("../models/notification.model");

/**
 * Accept a new notification request and return the tracking id.
 */

exports.acceptNotificationRequest = async (req, res) => {
    // Request body.
    const notificationObj = {
        subject: req.body.subject,
        content: req.body.content,
        recepientEmails: req.body.recepientEmails,
        requester: req.body.requester,
        ticketId: req.body.ticketId
    }

    try {
        const notification = await Notification.create(notificationObj);
        res.status(201).send({
            requestedId: notification.ticketId,
            status: "Accepted Request - It's in progress."
        });
    } catch (err) {
        console.log("Error will accept a notification request");
        res.status(500).send({
             message: "Error will accept a notification request"
        })
    }
}

/**
 * Check the notification status ( if email is sent or not ) using the tracking id.
 */

