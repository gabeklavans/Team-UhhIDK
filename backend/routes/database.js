/* jshint esversion: 6 */
const express = require("express");
const rp = require("request-promise");
const router = express.Router();
const mongoose = require('mongoose');
const UserData = require('../models/user_data');

/**
 * These routes are mostly for testing and reference purposes
 */

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

router.get("/read/", (req, res, next) => {
    UserData.findOne({ 'email': req.session.email }).exec()
        .then(doc => {
            if (doc) {
                req.session.direct_emissions = doc.direct_emissions;
                req.session.indirect_emissions = doc.indirect_emissions;
                req.session.biking = doc.biking_saves;
                res.send({
                    direct: doc.direct_emissions,
                    indirect: doc.indirect_emissions,
                    biking: doc.biking_saves
                });
            } else {
                res.send({
                    error: `Nothin in DB`
                });
                console.log("No data in DB");
            }
        })
        .catch(err => console.error(err));
});

router.get("/read/all", (req, res, next) => {
    UserData.find().exec()
        .then(doc => {
            if (doc) {
                // console.log(doc);
                res.send(doc);
            } else {
                console.log(`User not found`);
                res.send({ msg: `User ${req.session.email} not found` });
            }

        })
        .catch(err => console.error(err));
});

router.patch("/update/", (req, res, next) => {
    // Loop through every item in queries and add them to the update list
    let updateOperations = {};
    Object.keys(req.query).forEach(op => {
        updateOperations[op] = req.query[op];
    });
    // Update values found in update operatoins
    UserData.update({ email: req.session.email }, { $set: updateOperations }).exec()
        .then(result => {
            console.log(result);
            res.send(result);
        })
        .catch(err => console.error(err));
});

router.delete("/delete/:email", (req, res, next) => {
    UserData.findOneAndDelete({ email: req.params.email }).exec()
        .then(result => {
            // console.log(result);
            res.send(result);
        })
        .catch(err => console.error(err));
});

module.exports = router;