const db = require("../models/db.js");
const Events = db.events;
const EventsType = db.events_type;
const { Op } = require('sequelize');


exports.getAllEventsType = async (req, res) => {
    try {
        let eventsType = await EventsType.findAll();
        res.status(200).json(eventsType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
