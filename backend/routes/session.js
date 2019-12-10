/* jshint esversion: 6 */
const express = require("express");
const router = express.Router();
const rp = require("request-promise");

router.get("/emissions", (req, res, next) => { 
    if (req.session.direct_emissions && req.session.indirect_emissions) {
        res.send({
            direct: req.session.direct_emissions,
            indirect: req.session.indirect_emissions
        });
    } else {
        res.send({
            error: `Nothin in there`
        });
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