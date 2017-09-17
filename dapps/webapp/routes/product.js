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

router.post('/purchase' , function(req,res,next) {
	var data=req.body;

	console.log("PID(purchase) : " + data.pid); 
	Product.remove({product:data.pid}, function(err) {

		if (!err) {
			Inventory.update({ _id:data.pid }, { $set: { owner: data.uid }}, function(err,item){
				if (err) {
					res.json({result:"FAIL"});
					return;
				}

				res.json({result:"OK"});

			});
		}
	});
});

router.get('/category', function(req,res,next) {
    Product.find({}, function(err, items) {
        if (err) {
            res.json({result:"FAIL"});
            return;
        }

        var category = [];

        for (var k=0; k< items.length; k++) {
            var f = function(E) {
                for (var i=0; i < category.length; i++) {
                    if (E.name == items[k].category) {
                        return true;
                    }
                }
                return false
            }
            var filtered = category.filter(f)

            if (filtered.length == 0) {
                category.push({id:category.length, name:items[k].category});
            }

            res.json({result:"OK", category:category});
            return;
        }
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
