var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inventorySchema = new Schema({
    iid: String,
    name: String,
	image: String,
    owner: String,
	category: String
});

module.exports = mongoose.model('Inventory', inventorySchema);
