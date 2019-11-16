const express = require("express");
const router = express.Router();

const {google} = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

// Using this for app config variables
require("dotenv").config();

// generate a url that asks permissions for Google Calendar scope
const scopes = ["https://www.googleapis.com/auth/calendar", "https://mail.google.com/"];

router.get("/", (req, res) => {
    if (req.query.code) {
        // if the access code is returned,
        // grab the user's data and initialize the session
        let code = req.query.code
        // exchange code for tokens
        console.log(code);
        res.send(`It worked, code is ${code}`);
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