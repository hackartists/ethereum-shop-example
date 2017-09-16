var express = require('express');
var User =  require('../models/user');
var Ethereum = require('../models/ethereum');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  // POST processing
  var account=Ethereum.CreateAccount();

  var user = new User({
    username:req.body.uid,
    password: req.body.upw,
    account: account,
    stovecoin: 100000
  });

  user.save(function(err){
    if(err){
      console.error(err);
      res.json({result: "FAIL"});
      return;
    }

    Ethereum.GetBalance(account, function(bal) {
      res.json({
        result: "OK",
        value: {
          username:req.body.uid,
          account: account,
          eth: bal,
          stovecoin: 100000
        }
      });
    });
  });
});

router.post('/signin', function(req, res, next) {
  //POST processing
  User.findOne({username:req.body.uid, password:req.body.upw}, function(err, user){
    if(err) return res.status(500).json({error: err});
    if(!user) return res.status(404).json({error: 'book not found'});

    Ethereum.GetBalance(user.account, function(bal) {
      res.json({
        result: "OK",
        value: {
          username: user.username,
          account: user.account,
          stovecoin: user.stovecoin,
          eth: bal
        }
      });
    });
  });
});


module.exports = router;
