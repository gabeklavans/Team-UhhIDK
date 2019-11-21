/*jshint esversion: 6 */
const express = require("express");
const router = express.Router();
const rp = require("request-promise");

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
                // Access token and refresh token was successfully retrieved

                // TODO: handle token NOT being returned
                let accessToken = response.access_token;
                let refreshToken = response.refresh_token;

                let options = {
                    method: 'GET',
                    url: 'https://people.googleapis.com/v1/people/me',
                    qs: { personFields: 'names,emailAddresses' },
                    headers:
                    {
                        Host: 'people.googleapis.com',
                        Authorization: `Bearer ${accessToken}`
                    },
                    json: true
                };

                rp(options)
                    .then(response => {
                        // retrieved profile info
                        let ret = {
                            name: response.names[0].displayNameLastFirst,
                            email: response.emailAddresses[0].value
                        };
                        res.json(ret);
                    })
                    .catch(err => {
                        console.error(err);
                    });

                // res.redirect(process.env.FRONT_END_URL);
            })
            .catch(err => {
                //console.error(err);
                res.send(err);
            });
    } else {
        // if this is called without access code,
        // start the authentication process
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
        //`https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}`;
        res.redirect(url);
    }
});

module.exports = router;