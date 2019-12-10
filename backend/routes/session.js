/* jshint esversion: 6 */
const express = require("express");
const router = express.Router();
const rp = require("request-promise");

router.get("/emissions", (req, res, next) => { 
    console.log(`Name: ${req.session.name}, Direct: ${req.session.direct_emissions}`);
    if (req.session.direct_emissions && req.session.direct_emissions > 0) {
        res.send({
            direct: req.session.direct_emissions,
            indirect: req.session.indirect_emissions
        });
        console.log("Sent some emissions");
    } else {
        res.send({
            error: `Nothin in there`
        });
        console.log("No emissions in session");
    }
});

router.get("/name", (req, res, next) => {
    if (req.session.name) {
        res.send({ name: req.session.name });
    } else {
        res.send({ name: 'Anon' });
    }
});

module.exports = router;