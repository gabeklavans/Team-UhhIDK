/* jshint esversion: 6 */
const express = require("express");
const rp = require("request-promise");
const router = express.Router();
const mongoose = require('mongoose');
const UserData = require('../models/user_data');

// Using this for app config variables
require("dotenv").config();

router.post("/create", (req, res, next) => {
    // First check if the user exists already
    UserData.findOne({ 'email': req.query.email })
        .exec()
        .then(doc => {
            if (doc) {
                // Tell them it exists
                console.log(`User already exists`);
                res.send({ msg: `User already exists` });
            } else {
                // Create new user
                let data = new UserData({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.query.email,
                    name: req.query.name,
                    // Stores a list of years mapped to the emssisions for that year
                    direct_emissions: 0,
                    indirect_emissions: 0
                });
                data.save().then(result => {
                    console.log(result);
                    res.send({ msg: result });
                }).catch(err => console.error(err));
            }
        })
        .catch(err => {
            console.error(err);
        });
});

router.get("/read/:email", (req, res, next) => { 
    UserData.findOne({ 'email': req.params.email }).exec()
        .then(doc => {
            if (doc) {
                console.log(doc);
                res.send(doc);
            } else {
                console.log(`User not found`);
                res.send({msg: `User ${req.query.email} not found`});
            }

        })
        .catch(err => console.error(err));
});

router.patch("/update/:email", (req, res, next) => {
    // Loop through every item in queries and add them to the update list
    let updateOperations = {};
    Object.keys(req.query).forEach(op => {
        updateOperations[op] = req.query[op];
    });
    // Update values found in update operatoins
    UserData.update({ email: req.params.email}, { $set: updateOperations}).exec()
        .then(result => {
            console.log(result);
            res.send(result);
        })
        .catch(err => console.error(err));
});

router.get("/read/name", (req, res, next) => {
    console.log(req.session.email);
    if (req.session.name) {
        res.send({ name: req.session.name });
    } else {
        res.send({ name: 'friend' });
    }
});

module.exports = router;