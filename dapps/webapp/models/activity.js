var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activitySchema = new Schema({
	timestamp: Number,
	uid: String,
	action: String,
	stovecash: String,
	ether: String
});

module.exports = mongoose.model('Activity', activitySchema);
