/*jshint esversion: 6 */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Using this for app config variables
require('dotenv').config();

/* Express app */
const app = express();

/* MiddleWare */
app.use(cors());
app.use(express.json());

/* Routing */
const nrelRoutes = require('./routes/nrel_api');

app.use('/nrel', nrelRoutes);

// Error handling and catch-all route 
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            status: error.status,
            message: error.message
        }
    });
});

/* Port number for server */
const port = process.env.PORT || 3001;

/* Connection to MongoDB */
// const uri = process.env.DB_URI;

// // View engine
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);




app.listen(port, () => {
    console.log(`Listening on ${port}`);
    console.log(`Address should be: http://localhost:${port}`);
});