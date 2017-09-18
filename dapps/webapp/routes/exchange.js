var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Inventory = require('../models/inventory');
var Ethereum = require('../models/ethereum');
var Activity = require('../models/activity');
var User = require('../models/user');

router.post('/to_cash', function(req, res, next) {
    var uid = req.body.uid;
    var amount = parseInt(req.body.amount);
    var pw = req.body.upw;

    User.findOne({username:uid}, function(err,item) {
        if (err) {
            res.json({result:"FAIL"});
            return;
        }

        item.stovecoin = item.stovecoin + amount;
        console.log("Stovecoin : " + item.stovecoin);
        item.save(function(err) {});

        var timeNow = Date.now();
        var activity = new Activity({
            timestamp: timeNow,
            uid: uid,
            action: "ex_to_cash",
            stovecash: amount,
            ether: amount
        });

        activity.save(function(err,doc){});

        res.json({result:"OK", data:item});
    });
});

router.post('/to_ether', function(req, res, next) {
    var uid = req.body.uid;
    var amount = parseInt(req.body.amount);
    var pw = req.body.upw;

    User.findOne({username:uid}, function(err,item) {
        if (err) {
            res.json({result:"FAIL"});
            return;
        }
        item.stovecoin = item.stovecoin - amount;
        item.save(function(err) {});

        var timeNow = Date.now();
        var activity = new Activity({
            timestamp: timeNow,
            uid: uid,
            action: "ex_to_ether",
            stovecash: amount,
            ether: amount
        });

        activity.save(function(err,doc){});

        res.json({result:"OK", data:item});
    });
});

module.exports = router;
