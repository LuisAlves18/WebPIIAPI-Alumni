const express = require('express');
let router = express.Router();
const eventsController = require('../controllers/events-controller.js');
const authController = require('../controllers/auth-controller.js');
const { events } = require('../models/db.js');
// middleware for all routes related with events
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(authController.verifyUserRole, authController.checkIsUserOrAdmin,eventsController.findAll)
    .post(authController.verifyToken, authController.isAdmin, eventsController.createEvent)

router.route('/:eventID/enrollments')
    .post(authController.verifyToken, authController.isLoggedUser, eventsController.enrollUser)
    .get(authController.verifyToken, authController.isAdmin, eventsController.getEventEnrollments)
    .delete(authController.verifyToken, authController.isLoggedUser, eventsController.cancelEnrollment)
    .put(authController.verifyToken, authController.isLoggedUser, eventsController.payEnrollment)

router.route('/:eventID/points')
    .put(authController.verifyToken, authController.isAdmin, eventsController.givePoints)

router.route('/:eventID([0-9]*$)')
    .delete(authController.verifyToken, authController.isAdmin, eventsController.deleteEvent)
    .get(authController.verifyLoginUser, eventsController.findOneEvent)
    .put(authController.verifyToken, authController.isAdmin, eventsController.updateOneEvent)




//send a predefined error message for invalid routes on EVENTS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'EVENTS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;
