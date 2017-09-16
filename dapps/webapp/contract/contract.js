var Web3 = require('web3');
var fs=require('fs');
var solc = require('solc');

var host = "ethereum"
var port = "8545"
var contract = "../../contracts/hello_world.sol"
var web3 = new Web3('http://ethereum:8545');

var code = fs.readFileSync(contract).toString();
var compiledCode = solc.compile(code);
var byteCode = '0x'+ compiledCode.contracts[':Voting'].bytecode;
var abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
console.log("abiDefinition was made.");

var VotingContract = web3.eth.contract(abiDefinition);
//var result = web3.eth.sign(web3.eth.accounts[0],"08252143"); // second argument is web3.sha3("xyz")
//console.log(result);
var deployedContract = VotingContract.new(['a','b'],{data: byteCode, from: web3.eth.accounts[0], gas: 4700000});
//console.log(deploytedContract.address);
contractInstance = VotingContract.at(deployedContract.address);

