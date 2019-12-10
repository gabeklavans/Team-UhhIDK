/* jshint esversion: 6 */
const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const mongoose = require("mongoose");
const UserData = require('../models/user_data');

// Using this for app config variables
require('dotenv').config();

const { google } = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

// Using this for app config variables
require("dotenv").config();

// generate a url that asks permissions for Google Calendar scope
const scopes = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar',
    'https://mail.google.com/'
];

router.get("/", (req, res) => {
    if (req.query.code) {
        // if the access code is returned,
        // grab the user's data and initialize the session
        let code = req.query.code;

        // exchange code for tokens
        let options = {
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
            qs:
            {
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URL,
                grant_type: 'authorization_code'
            },
            headers:
            {
                Host: 'oauth2.googleapis.com'
            },
            json: true
        };

        // send request
        rp(options)
            .then(response => {
                // If access token was not returned
                if (!response.access_token) {
                    let error = new Error('Issue retrieving access token. Try signing in again or contacting Gabe at gabeklav@bu.edu');
                    error.status = 500;
                    next(error);
                } else {// Access token and refresh token was successfully retrieved

                    req.session.accessToken = response.access_token;
                    req.session.refresh_token = response.refresh_token;

                    let options = {
                        method: 'GET',
                        url: 'https://people.googleapis.com/v1/people/me',
                        qs: { personFields: 'names,emailAddresses' },
                        headers:
                        {
                            Host: 'people.googleapis.com',
                            Authorization: `Bearer ${req.session.accessToken}`
                        },
                        json: true
                    };

                    rp(options)
                        .then(response => {
                            // retrieved profile info
                            let name = response.names[0].displayNameLastFirst;
                            let email = response.emailAddresses[0].value;

                            // store through to DB
                            // First check if user is in DB already or not
                            UserData.findOne({ 'email': email }).exec()
                                .then(doc => {
                                    if (doc) {
                                        console.log(`User ${doc.name} already in DB. Storing info to session.`);
                                        req.session.name = doc.name;
                                        req.session.email = doc.email;
                                        req.session.direct_emissions = doc.direct_emissions;
                                        req.session.indirect_emissions = doc.indirect_emissions;
                                        console.log(`Emissions from db: ${doc.direct_emissions}`);
                                        res.redirect(process.env.FRONT_END_URL);
                                    } else {
                                        // Store the name email and 0 values for emissions in session
                                        req.session.name = name;
                                        req.session.email = email;
                                        req.session.direct_emissions = 0;
                                        req.session.indirect_emissions = 0;
                                        console.log(`User not found. Sending data to DB.`);
                                        let data = new UserData({
                                            _id: new mongoose.Types.ObjectId(),
                                            email: email,
                                            name: name,
                                            direct_emissions: 0,
                                            indirect_emissions: 0
                                        });
                                        // Be sure to redirect the page in each case AFTER sessions are updated
                                        data.save().then(result => {
                                            console.log(`Data saved in DB`);
                                            res.redirect(process.env.FRONT_END_URL);
                                        }).catch(err => {
                                            console.error(err);
                                            res.redirect(process.env.FRONT_END_URL);
                                        });
                                    }

                                })
                                .catch(err => console.error(err));
                        })
                        .catch(err => {
                            // TODO: More descriptive error
                            console.error(err);
                            //res.send(err);
                        });
                }
            })
            .catch(err => {
                // TODO: More descriptive error
                console.error(err);
                //res.send(err);
            });
    } else {
        // if this is called without access code,
        // start the authentication process
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
        res.redirect(url);
    }
});

module.exports = router;