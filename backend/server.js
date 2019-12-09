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

// Prevents cors errors
// Enable CORS
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     next();
//  });
app.use(cors({
    origin: true,
    credentials: true,
    preflightContinue: true
}));
app.use(express.json());

// Session middleware
// app.use(session({
//     'secret': 'WordsFail',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false
//     }
// }));

app.use(cookieSession({
    name: 'session',
    secret: 'uh',
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

app.use('/nrel', nrelRoute);
app.use('/google_oauth', googRoute);
app.use('/coolclimate', coolRoute);
app.use('/db', databaseRoute);

app.get('/', (req, res, next) => {
    if (req.session.email) {
        res.send(`Email in session: ${req.session.email}`);
    } else {
        let error = new Error('Not found');
        error.status = 404;
        next(error);
    }
});

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