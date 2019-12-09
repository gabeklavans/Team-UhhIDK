/* jshint esversion: 6 */
const express = require("express");
const rp = require("request-promise");
const router = express.Router();

// Using this for app config variables
require("dotenv").config();

router.get("/read", (req, res, next) => {
    let error = new Error('Can\'t do that yet');
    error.status = 501;
    next(error);
});

router.get("/update", (req, res, next) => {
    let error = new Error('Can\'t do that yet');
    error.status = 501;
    next(error);
});

router.get("/read/name", (req, res, next) => {
    console.log(req.session.email);
    if (req.session.name) {
        res.send({name: req.session.name});
    } else {
        res.send({name: 'friend'});
    }
});

module.exports = router;