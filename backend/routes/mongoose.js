// Import the mongoose module 
var mongoose = require('mongoose');

// Set up mongoose connection 
var mongoDB = 'mongodb+srv://aihuenguyen:Wz5EaEiFcsOx6sle@cs411appdata-yjfy2.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true});

// Get the default connection
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema
var Schema = mongoose.Schema;

var UserDataSchema = new Schema ({
	_id: Schema.Types.ObjectId,
	email: String,
	name: String,
	direct_emissions: Number,
	indirect_emissions: Number 
});

// Compile model from schema
var UserDataModel = mongoose.model('UserDataModel', UserDataSchema);

// Create a new entry:
UserDataModel.create({email: 'users_email', name: 'users_name', direct_emissions: 0, indirect_emissions: 0}, function (err, user) {
	if (err) return handleError(err);
})

// Look up a user by email: 
UserDataModel.findOne({'email':'users_email'}, 'email name direct_emissions indirect_emissions', function (err, user) {
	if (err) return handleError(err);
})

// Update a user's email: 
UserDataModel.findOne({'email':'users_email'}, function (err, user) {
	if (err) return handleError(err);
	user.email = 'new_email';
	user.save();
})

// Update a user's name: 
UserDataModel.findOne({'email':'users_email'}, function (err, user) {
	if (err) return handleError(err);
	user.name = 'new_name';
	user.save();
})

// Update a user's direct emissions: 
UserDataModel.findOne({'email':'users_email'}, function (err, user) {
	if (err) return handleError(err);
	user.direct_emissions = 0;
	user.save();
})

// Update a user's indirect emissions: 
UserDataModel.findOne({'email':'users_email'}, function (err, user) {
	if (err) return handleError(err);
	user.indirect_emissions = 0;
	user.save();
})

// Reference: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

