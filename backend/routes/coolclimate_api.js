/* jshint esversion: 6 */
const express = require("express");
const rp = require("request-promise");
const router = express.Router();
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser();

// Using this for app config variables
require("dotenv").config();

/**
 * @param miles: miles driven in a year
 * @param mpg: fuel efficiency of car (miles per gallon)
 * @param fuelType: 0 for gasoline 1 for deisel (I think)
 */
router.get("/", (req, res, next) => {
    // Initialize the variables to pass to the api
    let miles = req.query.miles || 1000;
    let mpg = req.query.mpg || 30;
    let fuelType = req.query.fuelType || 0;

    // options for the request
    let options = {
        method: 'GET',
        url: 'https://apis.berkeley.edu/coolclimate/footprint-sandbox',
        qs:
        {
            input_location_mode: '1',
            input_location: '02215',
            input_income: '1',
            input_size: '0',
            // input_footprint_transportation_miles1: miles,
            input_footprint_transportation_mpg1: mpg,
            input_footprint_transportation_fuel1: fuelType
        },
        headers:
        {
            Host: 'apis.berkeley.edu',
            app_key: process.env.COOLCLIMATE_API_KEY,
            app_id: process.env.COOLCLIMATE_APP_ID,
            accept: 'application/json' // This don't work but I can dream
        }
    };

    // send the promise-based request
    rp(options)
        .then((response) => {
            xmlParser.parseStringPromise(response)
                .then(json => {
                    if (!json.response.result_motor_vehicles_direct || !json.response.result_motor_vehicles_indirect) {
                        let error = new Error('Issue retrieving carbon emission stats');
                        error.status = 503;
                        next(error);
                    } else {
                        console.log('Sent coolclimate info to client');
                        // Emissions are in metric tons of carbon dioxide equivalent (tCO2e)
                        res.send({
                            direct_emissions: json.response.result_motor_vehicles_direct[0],
                            indirect_emissions: json.response.result_motor_vehicles_indirect[0]
                        });
                    }
                })
                .catch(err => {
                    // TODO: More descriptive error
                    console.error(err);
                    res.send(err);
                });
        })
        .catch(err => {
            // TODO: More descriptive error
            console.error(err);
            res.send(err);
        });

});

module.exports = router;
