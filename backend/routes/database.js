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

module.exports = router;