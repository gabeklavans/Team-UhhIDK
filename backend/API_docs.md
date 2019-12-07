## Variable stuff is in **{braces}**

| Function                                                          | Url                                                                               | Usage                                                                                         |
| :--------                                                         | :-------------                                                                    | -------------:                                                                                |
| Base NREL url                                                     | http://localhost:8420/nrel                                                        | Just returns a test message                                                                        |
| Get local elctric company from NREL                               | http://localhost:8420/nrel/{address}                                              | Address is space-separated street address                                       |
| Sign in with Google OAuth 2.0                                     | http://localhost:8420/google_oauth                                                | Redirects the page to the Google sign in and starts a session for user upon successful authentication    |
| Get carbon emissions from single car in a year using CoolClimate  | http://localhost:8420/coolclimate?miles={miles/year}&mpg={mpg}&fuelType={type}    | Each parameter is optional (there are defaults). Fuel type is 0 for gasoline and 1 for diesel |
| Get user information from database                                | http://localhost:8420/db/read                                                     | Will eventually allow specifying which piece of information to read |
| Update existing user information in database                      | http://localhost:8420/db/update                                                   | Will eventually allow specifying which piece of information to change |

### *All errors should be returned in the response as a JSON object named "error"*

<!-- TODO: add default values -->