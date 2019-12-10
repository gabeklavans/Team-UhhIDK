/* jshint esversion: 6 */
const mongoose = require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var UserDataSchema = new Schema ({
	_id: Schema.Types.ObjectId,
	email: String,
    name: String,
    // Stores a list of years mapped to the emssisions for that year
	direct_emissions: Number,
	indirect_emissions: Number 
});

// Compile model from schema
module.exports = mongoose.model('UserDataModel', UserDataSchema);