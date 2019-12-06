/*jshint esversion: 6 */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');
var path = require('path');

// Using this for app config variables
require('dotenv').config();

/* Express app */
const app = express();

/* MiddleWare */
app.use(favicon('favicon.ico'));
app.use(cors());
app.use(express.json());

// logging URL calls
app.use(function (req, res, next) {
    console.log('Called URL: ' + req.url);
    next();
});

/* Routing */
const nrelRoute = require('./routes/nrel_api');
const googRoute = require('./routes/google_oauth');
const coolRoute = require('./routes/coolclimate_api');

app.use('/nrel', nrelRoute);
app.use('/google_oauth', googRoute);
app.use('/coolclimate', coolRoute);

// Error handling and catch-all route 
// app.use((req, res, next) => {
//     const error = new Error('Not found');
//     error.status = 404;
//     next(error);
// });

// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({
//         error: {
//             status: error.status,
//             message: error.message
//         }
//     });
// });

/* Port number for server */
const port = process.env.PORT || 8420;

/* Connection to MongoDB */
// const uri = process.env.DB_URI;

app.listen(port, () => {
    console.log(`Listening on ${port}`);
    console.log(`Address should be: http://localhost:${port}`);
});