/* jshint esversion: 6 */
const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const UserData = require('../models/user_data');

router.get("/emissions", (req, res, next) => {
    console.log(`Biking emits ${req.session.biking}`);
    console.log(`Direct emits ${req.session.direct_emissions}`);
    console.log(`Session email: ${req.session.email}`);

    if (req.session.direct_emissions && req.session.direct_emissions > 0) {
        res.send({
            direct: req.session.direct_emissions,
            indirect: req.session.indirect_emissions,
            biking: req.session.biking
        });
        console.log("Sent some emissions");
    } else {
        res.send({
            error: `Nothin in session`
        });
        console.log("No data in session");
    }
});

router.get("/name", (req, res, next) => {
    console.log(`Session name ${req.session.name}`);
    if (req.session.name) {
        res.send({ name: req.session.name });
    } else {
        res.send({ name: 'Anon' });
    }
});

module.exports = router;