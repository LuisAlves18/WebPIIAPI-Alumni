const db = require("../models/db.js");
const Events = db.events;
const { Op } = require('sequelize');

// Display list of all events
exports.findAll = (req, res) => {
    let {id_event_type, name, price } = req.query;

    let condition = null;

    if (name) {
        if (condition == null) {
            condition = {
                name: { [Op.like]: `%${name}%` }
            }
        } else {
            condition['name'] = {[Op.like]: `%${name}%`} ;
        }
    }
    
    if (id_event_type) {
        if (condition == null) {
            condition = {
                id_event_type: id_event_type
            }
        } else {
            condition["id_event_type"] = id_event_type;
        }
        
    }

    if (price) {
        if (condition == null) {
            if (price == 0) {
                condition = {
                    price: price
                }
            } else if (price == 1) {
                condition = {
                    price: {[Op.gte]: price}
                }
            }
            
        } else {
            if (price == 0) {
                condition['price'] = price;
            } else if (price == 1) {
                condition['price'] = 
                     {[Op.gte]: price};
            }
           
        }
    }
    
    Events.findAll({ where: condition})
        .then(data => {
            //console.log('data', data.length)
            if (data.length == 0) {
                res.status(404).json({
                    message: "Could not find events for that search!"
                });
            } else {
                res.status(200).json(data);
            }
           
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving events."
            });
        });
};

// Handle event create on POST
exports.createEvent = (req, res) => {
    // validate request body data
    if (!req.body) {
        res.status(400).json({ message: "Request body can not be empty!" });
        return;
    } else if (!req.body.id_event_type) {
        res.status(400).json({ message: "Event Type must be defined." });
        return;
    } else if (!req.body.name) {
        res.status(400).json({ message: "Event name can not be empty!" });
        return;
    } else if (!req.body.description) {
        res.status(400).json({ message: "Event description can not be empty!" });
        return;
    } else if (!req.body.photo) {
        res.status(400).json({ message: "Event photo can not be empty!" });
        return;
    } else if (!req.body.date_time_event) {
        res.status(400).json({ message: "Event date can not be null!" });
        return;
    } else if (!req.body.date_limit) {
        res.status(400).json({ message: "Event date limit can not be null!" });
        return;
    }
    // Save Event in the database
    Events.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New event created.", location: "/events/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the event."
                });
        });
};

// Remove one event
exports.deleteEvent = (req, res) => {

    Events.destroy({ where: { id: req.params.eventID } })
        .then(num => {
            if (num == 1) {
                res.status(200).json({
                    message: `Event with id ${req.params.eventID} was successfully deleted!`
                });
            } else {
                res.status(404).json({
                    message: `Not found event with id=${req.params.eventID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error deleting event with id=${req.params.eventID}.`
            });
        });
};

// List all not closed events
exports.findNotClosed = (req, res) => {
    Events.findAll({ where : { closed : false}})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Event with id ${req.params.eventID}.`
            });
        });
};

// List just one event
exports.findOneEvent = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Events.findByPk(req.params.eventID)
        .then(data => {
            console.log('data',data)
            if (data === null)
                res.status(404).json({
                    message: `Not found event with id ${req.params.eventID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving event with id ${req.params.eventID}.`
            });
        });
};