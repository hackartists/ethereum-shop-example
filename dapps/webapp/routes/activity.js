var express = require('express');
var router = express.Router();
var Product =  require('../models/product');
var Inventory = require('../models/inventory');
var Ethereum = require('../models/ethereum');
var Activity = require('../models/activity');

router.get('/', function(req, res, next) {
    var uid = req.query.uid;

    Activity.find({uid:uid}, function(err,items) {
        if (err) {
            res.json({result:"FAIL"});
            return;
        }

        res.json({result:"OK", data:items});
    });
});

module.exports = router;
