/* jshint esversion: 6 */
const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const moment = require("moment");

// Using this for app config variables
require('dotenv').config();

router.get("/", (req, res, next) => {
    let options = {
        method: 'GET',
        url: `https://www.googleapis.com/calendar/v3/calendars/${req.session.email}/events`,
        qs: {
            timeMin: new Date(),
            singleEvents: true,
            orderBy: "startTime"
        },
        headers:
        {
            Authorization: `Bearer ${req.session.accessToken}`
        },
        json: true
    };

    /**
    * Get calendar event list in ascending order from current time
    */
    rp(options)
        .then(response => {
            // Get the first event with a location
            let location;
            let index = -1;
            while (!location) {
                index++;
                location = response.items[index].location;
            }

            let calInfo = {
                title: response.items[index].summary,
                location: location,
                startTime: response.items[index].start.dateTime
            };

            let options = {
                method: 'GET',
                url: 'http://api.traveltimeapp.com/v4/geocoding/search',
                qs:
                {
                    query: calInfo.location,
                    'within.country': 'US'
                },
                headers:
                {
                    'Accept-Language': 'en',
                    'X-Api-Key': '6590a3498b2e785fe2e91cf88f70f1c5',
                    'X-Application-Id': 'f210c7c7'
                },
                json: true
            };

            /**
             * Search for the location of the event we picked using TravelTime API
             */
            rp(options)
                .then(response => {
                    // This location is in the format required
                    // for the route-finding API
                    let toLocation = {
                        "id": String(calInfo.location),
                        "coords": {
                            "lng": response.features[0].geometry.coordinates[0],
                            "lat": response.features[0].geometry.coordinates[1]
                        }
                    };

                    let curDate = new Date();
                    curDate.toISOString();
                    let options = {
                        method: 'POST',
                        url: 'http://api.traveltimeapp.com/v4/routes',
                        headers:
                        {
                            'X-Api-Key': process.env.TRAVELTIME_API_KEY,
                            'X-Application-Id': process.env.TRAVELTIME_APP_ID,
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body:
                        {
                            "locations":
                                [toLocation,
                                    // Home is hardcoded to be my dorm :) Myles Standish
                                    // 610 Beacon St
                                    {
                                        "id": "Home",
                                        "coords": { "lat": 42.347724, "lng": -71.08526 }
                                    }],
                            "departure_searches":
                                [{
                                    "id": "Departure search",
                                    "departure_location_id": "Home",
                                    "arrival_location_ids": [toLocation.id],
                                    "transportation": { "type": "walking" },
                                    "departure_time": curDate,
                                    "properties": ["travel_time"]
                                }]
                        },
                        json: true
                    };

                    rp(options)
                        .then(response => {
                            // Get that travel time in seconds
                            let travelTime;

                            if (response.results[0].unreachable[0]) {
                                travelTime = -1;
                            } else {
                                travelTime = response.results[0].locations[0].properties[0].travel_time;
                            }

                            // Now send back a NICE spicy JSON object :D
                            let startDate = new Date(calInfo.startTime);
                            console.log(`Travel time in minutes: ${travelTime/60}`);

                            res.send({
                                title: calInfo.title,
                                location: calInfo.location,
                                leaveTime: moment(calInfo.startTime).subtract(travelTime, 'seconds').format("h:mm A on dddd, M/D"),
                                startTime: moment(calInfo.startTime).subtract(5, 'hours')
                            });
                        })
                        .catch(err => {
                            console.error(`Travel time error: ${err.message}`);
                        });

                })
                .catch(err => {
                    console.error(`Location search error: ${err.message}`);
                });

        })
        .catch(err => {
            // If the token is expired, display this error page.
            req.session = null;
            res.send(
                "<h2>Credentials expired. Please Sign in again.</h2>\n<button type=\"submit\" onclick=\"location.href='http://localhost:3000';\" class=\"btn btn-primary\" style=\"padding-left: 60px; padding-right: 60px; \" >Reutrn to home page</button>"
            );
        });
});

module.exports = router;