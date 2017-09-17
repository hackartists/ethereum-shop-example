var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Inventory = require('../models/inventory');
var Ethereum = require('../models/ethereum');
var Activity = require('../models/activity');
var User = require('../models/user');

router.post('/to_cash', function(req, res, next) {
    var uid = req.body.uid;
    var amount = req.body.amount

    User.findOne({username:uid}, function(err,item) {
        if (err) {
            res.json({result:"FAIL"});
            return;
        }

        item.stovecoin = item.stovecoin + amount;

        item.save(function(err) {});

        var account = item.account;
        Ethereum.sendExchangeToCash(account,amount);

        res.json({result:"OK", data:items});
    });
});

router.post('/to_ether', function(req, res, next) {
    var uid = req.body.uid;
    var amount = req.body.amount

    User.findOne({username:uid}, function(err,item) {
        if (err) {
            res.json({result:"FAIL"});
            return;
        }
        item.stovecoin = item.stovecoin - amount;

        item.save(function(err) {});

        var account = item.account;
        Ethereum.sendExchangeToEther(account,amount);

        res.json({result:"OK", data:items});
    });
});

module.exports = router;
