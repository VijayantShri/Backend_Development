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

const createdTicketBody = {
    _id: "staffs2324",
    title: "Test",
    ticketPriority: 4,
    description: "Test",
    status: "OPEN",
    reporter: 1,
    assignee: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
};

const savedUserObj = {
    userType: "CUSTOMER",
    password: "323fser4353",
    name: "Test",
    userId: 1,
    email: "test@gmail.com",
    ticketCreated: [],
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
        const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(savedUserObj));
        /**
         * Mock the ticket creation also
         */
        const ticketSpy = jest.spyOn(Ticket, "create").mockImplementation(
            (ticketRequestBody) => Promise.resolve(createdTicketBody));
        /**
         * Mock the email client
         */
        // const clientSpy = jest.spyOn(client, 'post').mockImplementation(
        //     (url, args, cb) => cb('Test', null));

        await ticketController.createTicket(req, res);

        /**
         * Validations
         */
        expect(userSpy).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
        // expect(clientSpy).toHaveBeenCalled();
        // expect(res.status).toHaveBeenCalledWith(201);
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
});