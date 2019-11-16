/*jshint esversion: 6 */
const express = require("express");
const rp = require("request-promise");
const router = express.Router();

// Using this for app config variables
require("dotenv").config();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling GET req to nrel api"
    });
});

router.get("/:address", (req, res) => {
    var address = req.params.address;
    // Send a request to the NREL API with the user input as the address parameter
    var options = {
        // Options object for the request
        method: "GET",
        url: "https://developer.nrel.gov/api/utility_rates/v3.json",
        qs: {
            // API key is stored in the .env file in the backend folder under the name NREL_API_KEY
            api_key: process.env.NREL_API_KEY,
            address: address
        },
        headers: {
            Host: "developer.nrel.gov"
        },
        json: true // sepcify to Request that output is JSON
    };
    rp(options)
        .then((body) => {
            if (body.errors.length > 0) {
                // if the api returns any errors, only send all the errors separated by spaces
                let msg = "";
                body.errors.forEach(err => {
                    msg += err + " ";
                });
                res.json(msg);
            } else {
                // if it's a valid response, send the utility name
                res.status(200).json(body.outputs.utility_name);
            }
        })
        .catch(err =>{
            console.error(err);
        });
});

module.exports = router;
