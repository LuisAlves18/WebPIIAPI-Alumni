const express = require('express');
let router = express.Router();
const companiesController = require('../controllers/companies-controller.js');
const authController = require('../controllers/auth-controller.js');


router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(authController.verifyToken,authController.isAdmin,companiesController.getCompanies)
    .post(authController.verifyToken, authController.isAdmin, companiesController.createCompany)

router.route('/:companyID')
    .get(authController.verifyToken, authController.isAdmin, companiesController.getOneCompany)
    .delete(authController.verifyToken, authController.isAdmin, companiesController.deleteCompany)
    .put(authController.verifyToken,authController.isAdmin,companiesController.updateCompany)

//send a predefined error message for invalid routes on companies
router.all('*', function (req, res) {
    res.status(404).json({ message: 'COMPANIES: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;
