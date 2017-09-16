var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Inventory = require('../models/inventory');
var Ethereum = require('../models/ethereum');

router.post('/sell', function(req, res, next) {
    // only for API
    var data=req.body;
	Inventory.findOne({_id:data.pid}, function(err, item) {
		if (err) {
			console.error(err);
			res.json({result: "FAIL"});
			return
		}
		var product = new Product({
			product: data.pid,
			category: item.category,
			contract: data.contract,
			price: data.price
		});

		Product.findOne({product:data.pid}, function(err, item) {
			if (item==null) {
				product.save(function(err){
					if(err){
						console.error(err);
						res.json({result: "FAIL"});
						return;
					}

					res.json({result:"OK"});
					return
				});
			}
		});
	});
});

router.get('/items', function(req, res, next) {
	console.log(req.query.category)
    Product.find({category:req.query.category}, function(err, items) {
        if(err){
            console.error(err);
            res.json({result: "FAIL"});
            return;
        }
		console.log(items);

        res.json({result:"OK", abi:Ethereum.GetContract().abi, data:items});
    });
});


module.exports = router;
