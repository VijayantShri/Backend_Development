/**
 * Logic to make a POST call to the notification service.
 */

const Client = require("node-rest-client").Client;

const client = new Client();

/**
 * Expose a function which will take the following information
 * 
 * 1. subject
 * 2. content
 * 3. receipientEmails
 * 4. requester
 * 5. ticketId
 * 
 * and then make a POST call 
 */

module.exports = (ticketId, subject, content, emailIds, requester) => {
    /**
     * POST call
     *  - URI
     *  - HTTP Verb : POST
     *  - Request body
     *  - Headers
     */

    // Request body
    const reqBody = {
        subject: subject,
        content: content,
        receipientEmails: emailIds,
        requester: requester,
        ticketId: ticketId
    };

    // Headers
    const headers = {
        "Content-Type": "application/json"
    };

    const args = {
        data: reqBody,
        headers: headers
    };

    const req = client.post("http://localhost:7777/notifServ/api/v1/notifications", args, (data, response) => {
        console.log("Request sent");
        console.log(data);
    });

    // Event Handlers

    // Check the request and response timeout for the request.
    req.on('requestTimeout', function (req) {
        console.log('request has expired');
        req.abort();
    });
    
    req.on('responseTimeout', function (res) {
        console.log('response has expired');
    
    });

    // Check for the error in the request.
    req.on('error', function (err) {
        console.log('request error', err);
    });
}