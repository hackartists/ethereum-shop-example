var express = require('express');
var router = express.Router();
var Inventory =  require('../models/inventory');

router.post('/register', function(req, res, next) {
    // only for API
    var data=req.body;
    var inventory = new Inventory({
        name: data.name,
        image: data.image,
        owner: data.uid,
        category: data.category
    });

    inventory.save(function(err){
        if(err){
            console.error(err);
            res.json({result: "FAIL"});
            return;
        }

        res.json({result:"OK"});
    });
});

router.get('/items', function (req, res, next) {
    console.log(req.query.uid);
    Inventory.find({owner:req.query.uid}, function(err, items){
        if(err){
            console.error(err);
            res.json({result: "FAIL"});
            return;
        }

        res.json({result:"OK", data:items});
    });
});

router.get('/item', function (req, res, next) {
	console.log(req.query.inven_id);
    Inventory.findOne({_id:req.query.inven_id}, function(err, item){
        if(err){
            console.error(err);
            res.json({result: "FAIL"});
            return;
        }

        res.json({result:"OK", data:item});
    });
});

module.exports = router;
