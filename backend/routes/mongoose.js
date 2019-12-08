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

// Reference: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

