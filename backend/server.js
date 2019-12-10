/* jshint esversion: 6 */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');
const session = require('express-session');
const cookieSession = require('cookie-session')

// Using this for app config variables
require('dotenv').config();

/* Express app */
const app = express();

/* MiddleWare */

// Fun favicon that no one will see :'(
app.use(favicon('favicon.ico'));

// Prevents cors errors and allows cookies to flow
app.use(cors({
    origin: true,
    credentials: true,
    preflightContinue: true
}));
app.use(express.json());

// Session middleware

// This uses express-sessions but we don't have an external store so its kinda werid
// app.use(session({
//     'secret': 'WordsFail',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false
//     }
// }));

/**
 * This supposedly doesn't need an external store
 * It's probably not good practice (hence why express-session is more used)
 * but I'm here for a good one not a long one
 * ...
 * Wait that expression doesn't really work here...
 * Hehe EXPRESSion. Nice. 
 */
app.use(cookieSession({
    name: 'session',
    secret: 'WordsFail',
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// logging URL calls
app.use(function (req, res, next) {
    console.log('Called URL: ' + req.url);
    next();
});

/* Routing */
const nrelRoute = require('./routes/nrel_api');
const googRoute = require('./routes/google_oauth');
const coolRoute = require('./routes/coolclimate_api');
const databaseRoute = require('./routes/database');
const googCalendarRoute = require('./routes/goog_calendar_api');
const sessionRoute = require('./routes/session');

app.use('/nrel', nrelRoute);
app.use('/google_oauth', googRoute);
app.use('/coolclimate', coolRoute);
app.use('/calendar', googCalendarRoute);
app.use('/db', databaseRoute);
app.use('/session', sessionRoute);

// app.post('/', (req, res, next) => {
//     Object.keys(req.query).forEach(q => {
//         console.log(req.query[q]);
//     });
// });

// Error handling and catch-all route 
// app.use((req, res, next) => {
//     const error = new Error('Not found');
//     error.status = 404;
//     next(error);
// });

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            status: error.status,
            message: error.message
        }
    });
});

/* =================================================== */
/* Connection to Database */

// Set up mongoose connection 
var mongoDB = process.env.MONGO_ATLAS_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true });

// Get the default connection
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Reference: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

/* =================================================== */

/* Port number for server */
const port = process.env.PORT || 8420;

/* Spin up server */
app.listen(port, () => {
    console.log(`Listening on ${port}`);
    console.log(`Address should be: http://localhost:${port}`);
});