/* jshint esversion: 6 */
const mongoose = require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var UserDataSchema = new Schema ({
	_id: mongoose.Schema.Types.ObjectId,
	email: String,
    name: String,
    // Stores a list of years mapped to the emssisions for that year
	direct_emissions: {type: Map, of: Number},
	indirect_emissions: {type: Map, of: Number} 
});

// Compile model from schema
module.exports = mongoose.model('UserDataModel', UserDataSchema);