var myModule = angular.module('stovecoinApp');

myModule.service("EthereumService", function($http) {
  this.host = "http://ethereum:8545";

  this.convToString = function(str) {
	var res = ""
	for ( var i =2; i< str.length; i+=4) {
	  var ch = parseInt(str.charAt(i) + str.charAt(i+1)+ str.charAt(i+2) +str.charAt(i+3) , 16);

	  if (ch == 0){
		break;
	  }

	  res += String.fromCharCode(ch);
	}

	return res;
  };

  this.getBalance = function(user) {
	var web3 = new Web3(new Web3.providers.HttpProvider(this.host));
	var wei = web3.eth.getBalance(user.account).toString(10);
	var eth = web3.fromWei(wei,"ether");
	eth = eth.split(".")[0];

	return eth;
  };

  this.getInfo = function(contract) {
	var web3 = new Web3(new Web3.providers.HttpProvider(this.host));
	var info = contract.Info();

	return {
	  price: info[1].c[0],
	  _id: web3.toAscii(info[0])
	}
  };

  this.purchase = function(contract, product, user) {
	var web3 = new Web3(new Web3.providers.HttpProvider(this.host));
	var val = parseInt(web3.toWei(product.price,"ether"));
	web3.personal.unlockAccount(user.account, "8910");
	contract.Purchase.sendTransaction({from:user.account, value:val});

	var req = {
	  method: 'POST',
	  url: '/product/purchase',
	  data: {
		pid: product.id,
		uid:user.username
	  }
	};

	$http(req).then(function successCallback(response) {
	}, function errorCallback(response) {
	});

  };

  this.getContract = function(abi,txHash) {
	var web3 = new Web3(new Web3.providers.HttpProvider(this.host));
	var tx = web3.eth.getTransactionReceipt(txHash);

	var res;

	if (tx.contractAddress) {
	  res = {result:true, contract:web3.eth.contract(abi).at(tx.contractAddress)};
	} else {
	  res = {result:false}
	}
	return res;
  };

  this.deployContract= function(abi, product, bytecode, account, gas) {
	var web3 = new Web3(new Web3.providers.HttpProvider(this.host));
	var accounts = web3.eth.accounts;
	var contract=web3.eth.contract(abi)
	web3.personal.unlockAccount(account, "8910");
	var price = parseInt(web3.toWei(product.price,"ether"));
	var result = contract.new(product.id,price,
							  {from:account, data:bytecode, gas:3000000},
							  function (err, contract) {
								var req = {
								  method: 'POST',
								  url: '/product/sell',
								  data: {
									pid: product.id,
									price : product.price,
									contract:contract.transactionHash
								  }
								};

								$http(req).then(function successCallback(response) {
								}, function errorCallback(response) {
								});
							  });
  };

});
