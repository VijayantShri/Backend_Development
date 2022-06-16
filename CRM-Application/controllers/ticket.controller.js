/**
 * Create a ticket
 *  v1 - Anyone should be able to create the ticket.
 */

const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const constants = require("../utils/constants");
const objectConverter = require("../utils/objectConverter");

exports.createTicket = async (req, res) => {
    // logic to create the ticket
    const ticketObj = {
        title: req.body.title,
        ticketPriority: req.body.ticketPriority,
        description: req.body.description
    };
    // If any engineer is present or not.
    const engineer = await User.findOne({
        userType: constants.userType.engineer,
        userStatus: constants.userStatus.approved
    });
    if (engineer) {
        ticketObj.assignee = engineer.userId;
    }

    try {
        const ticket = await Ticket.create(ticketObj);
        /**
         * Ticket is created now.
         * 1. We should update the customer and engineer documnent.
         */
        /**
         * Find out the customer.
         */
        if (ticket) {
            const user = await User.findOne({
                userId: req.userId
            });
            user.ticketsCreated.push(ticket._id);
            await user.save();
            
            /**
             * Update engineer.
             */
            engineer.ticketAssigned.push(ticket._id);
            await engineer.save();

            res.status(201).send(objectConverter.ticketResponse(ticket));
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            message: "Some internal error occurred while creating ticket"
        })
    }
};

/** 
 * API to fetch all the documents
 * 
 * Todo:
 * Allow user to filter based on status.
 */

exports.getAllTickets = async (req, res) => {
    
    const user = await User.findOne({userId: req.userId});
    if (user.ticketsCreated==null || user.ticketsCreated.length == 0) {
        return res.status(200).send({
            message: "No tickets created by you !!!"
        });
    } 
    // I need to get all the ticket ids from ticket model.

    /**const tickets = [];
    var count = 0;
    user.ticketsCreated.forEach(async t => {
        ticketSaved = await Ticket.findOne({_id: t});
        console.log(ticketSaved);
        tickets.push(ticketSaved);
        count++;
        if (count >= user.ticketsCreated.length) {
            res.status(200).send(objectConverter.ticketListResponse(tickets));
        }
    });*/
    const queryObj = {
        _id: {$in: user.ticketsCreated}
    };
    if (req.query.status) {queryObj.status = req.query.status}
    const tickets = await  Ticket.find(queryObj)

    res.status(200).send(objectConverter.ticketListResponse(tickets));
}

/**
 * Controller to fetch the ticket based on ID.
 */

exports.getOneTicket = async (req, res) => {
    // const user = await User.findOne({userId: req.userId});
    // if (user.ticketsCreated==null || user.ticketsCreated.length==0) {
    //     res.status(200).send({
    //         message: "No ticket created by you!"
    //     })
    // }
    const ticket = await Ticket.findOne({_id: req.params.id});
    res.status(200).send(objectConverter.ticketResponse(ticket));
}

/**
 * Write the controller to update the ticket.
 * 
 * TODO
 * Move all the validations to middlewares.
 */

exports.updateTicket = async (req, res) => {
    // Check if the ticket exists.
    const ticket = await Ticket.findOne({
        _id: req.params.id
    }); 
    if (ticket == null) {
        return res.status(200).send({
            message: "Ticket doesn't exists."
        });
    }

    // Only ticket requester be allowed to update the ticket.
    const user = await User.findOne({
        _id: req.userId
    });

    if (!user.ticketsCreated.includes(req.params.id)) {
        return res.status(403).send({
            message: "Only owner of the ticket is allowed to update"
        });
    }
    // Update the attribute of the saved ticket.
    ticket.title = req.body.title != undefined ? req.body.title: ticket.title;
    ticket.description = req.body.description != undefined ? req.body.description: req.body.description;
    ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority: req.body.ticketPriority;
    ticket.status = req.body.status != undefined ? req.body.status: req.body.status;
     
    // Save the change ticket.
    const updatedTicket = await ticket.save();
    // Return the updated ticket.
    return res.status(200).send(objectConverter.ticketResponse(ticket));
}