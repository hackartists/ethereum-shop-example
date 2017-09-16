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

  this.getInfo = function(contract) {
	var web3 = new Web3(new Web3.providers.HttpProvider(this.host));
	var info = contract.Info();

	return {
	  price: info[1].c[0],
	  _id: web3.toAscii(info[0])
	}
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
	var result = contract.new(product.id,product.price,
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
