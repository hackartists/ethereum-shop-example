var express = require('express');
var ethereum = require('../models/ethereum');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { title: 'StoveCoin' });
});

router.get('/contract', function(req, res, next) {
  res.json({result:"OK",data:ethereum.GetContract()});
});

module.exports = router;
