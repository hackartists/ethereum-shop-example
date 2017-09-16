var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
	product: String,
	category: String,
	contract: String,
	price: Number
});

module.exports = mongoose.model('Product', productSchema);
