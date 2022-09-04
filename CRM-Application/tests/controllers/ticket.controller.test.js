 /**
  * This file is used to right the test code for the ticket controller.
  */

const ticketController = require("../../controllers/ticket.controller");
const {mockRequest, mockResponse} = require("../interceptor");
const User = require("../../models/user.model");
const Ticket = require("../../models/ticket.model");
const client = require("../../utils/NotificationServiceClient").client;

const ticketRequestBody = {
    title: "Test",
    ticketPriority: 4,
    description: "Test"
};

const updateRequestBody = {
    title: "Test",
    ticketPriority: 4,
    description: "Test",
    status: "CLOSED ",
    reporter: 1,
    assignee: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    _id: "staffs2324"
};

const createdTicketBody = {
    _id: "staffs2324",
    title: "Test",
    ticketPriority: 4,
    description: "Test",
    status: "OPEN",
    reporter: 1,
    assignee: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    save: jest.fn().mockReturnValue(Promise.resolve(updateRequestBody))     // Mock save method
};

const savedUserObj = {
    userType: "ADMIN",
    password: "323fser4353",
    name: "Test",
    userId: 1,
    email: "test@gmail.com",
    ticketsCreated: [],
    ticketAssigned: [],
    save: jest.fn()     // Mock save method
};

/**
 * Test the create ticket functionality.
 */

describe("Testing create ticket feature", () => {
    it("unit test the ability to successfully create a new ticket", async () => {
        /**
         * External entities we depen on:
         * 1. req, res
         */
        const req = mockRequest();
        const res = mockResponse();

        /**
         * If I have to call the create ticket method,
         * this req, needs to have the body object.
         */
        req.body = ticketRequestBody;
        req.userId = 1;     // My request is ready.

        /**
         * Mocking and spying User findOne method.
         *  It will return the saveUsedObj
         */
        const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(
            Promise.resolve(savedUserObj)); 
        /**
         * Mock the ticket creation also
         */
        const ticketSpy = jest.spyOn(Ticket, "create").mockImplementation(
            (ticketRequestBody) => Promise.resolve(createdTicketBody));
        /**
         * Mock the email client
         */

        const clientSpy = jest.spyOn(client, 'post').mockImplementation(
            (url, args, cb) => cb('Test', null));

        /**
         * Execution of the ticket 
         */
        await ticketController.createTicket(req, res);

        /**
         * Validations
         */
        expect(userSpy).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
        expect(clientSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Test",
                ticketPriority: 4,
                description: "Test",
                status: "OPEN",  
                assignee: 1
            })
        );
    });

    it("Not able to create a ticket!", async () => {

        const req = mockRequest();
        const res = mockResponse();
        
        req.body = ticketRequestBody;
        req.userId = 1;

        const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(
            Promise.resolve(savedUserObj));
        
        // This should return an error.
        const ticketSpy = jest.spyOn(Ticket, "create").mockImplementation(
            cb => cb(new Error("Error while creating"), null));
        
        await ticketController.createTicket(req, res);

        /**
         * Validation
         */
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message: "Some internal error occurred while creating ticket"
        });
    });
});

describe("Testing update ticket feature", () => {
    /**
     * Write a test for the happy flow for updating an existing ticket.
     */

    it("testing that the user ticket is successfully updated.", async () => {

        const req = mockRequest();
        const res = mockResponse();

        req.params = {
            userId: 1
        };
        req.body = updateRequestBody;

        // Mocking the other stuff

        const ticketSpy = jest.spyOn(Ticket, "findOne").mockReturnValue(
            Promise.resolve(createdTicketBody));
        const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(
            Promise.resolve(savedUserObj));
        
        /**
         * Execute the code
         */
        await  ticketController.updateTicket(req, res);

        /**
         * Validation part
         */
        expect(ticketSpy).toHaveBeenCalled();
        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

});