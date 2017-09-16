var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
	password: String,
	account: String,
	stovecoin: Number
});

module.exports = mongoose.model('User', userSchema);
