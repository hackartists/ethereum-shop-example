var Web3 = require('web3');
var Accounts = require('web3-eth-accounts');

var fs=require('fs');
var solc = require('solc');

var host = 'ethereum'
var port = '8545'
var domain = 'http://'+host+':'+port
var contract = "../../contracts/gameshop.sol"
var schema = 'GameShop'
var web3 = new Web3(domain);
var accounts = new Accounts(domain);

var code = fs.readFileSync(contract).toString();
var compiledCode = solc.compile(code);
var byteCode = '0x'+ compiledCode.contracts[':'+schema].bytecode;
var abiDefinition = JSON.parse(compiledCode.contracts[':'+schema].interface);
var Contract = new web3.eth.Contract(abiDefinition);
var stove_address = "0xbaf62c502dc7f911b5048b710ff420945d9ad469"
var ethereum = module.exports;

ethereum.DeployContract = function(address) {
	var deployedContract = Contract.deploy({data: byteCode});
	return deployedContract.address;
};

ethereum.sendExchangeToCash = function(address,amount,pw) {
	console.log(address +" "+ amount+" " + pw);
	web3.personal.unlockAccount(address, pw);
	web3.eth.sendTransaction({from:address, to:stove_address, value:amount})
};

ethereum.sendExchangeToEther = function(address,amount,pw) {
	console.log(address +" "+ amount+" " + pw);
	web3.personal.unlockAccount(stove_address, pw);
	web3.eth.sendTransaction({to:address, from:stove_address, value:amount})
};

ethereum.GetBalance = function(address, callback) {
	var res='';

	web3.eth.getBalance(address)
		.then(callback);
};

ethereum.CreateAccount = function() {
	return web3.eth.accounts.create().address;
}

ethereum.BuyGood = function() {
}

ethereum.GetContract = function() {
	return {bytecode: byteCode, abi: abiDefinition};
}
