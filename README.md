# Stove Coin
---
This guide has been made only for Mac OS X.

## Preliminaries
  - Install Node.js and global package
``` shell
brew install node
npm install -g solc nodemon
```

  - Install MongoDB

``` shell
brew install mongodb
```

  - Install Ethereum

``` shell
brew install geth
```

  - Make aliases
  
``` shell
echo "127.0.0.1 mongodb ethereum" >> /etc/hosts
export DATA_DIR=$HOME/chain
```
  
## Setting up Ethereum for private
  - Fistly, you should add accounts. You remark addresses of generated accounts ant they will be facilitated to write genesis file in next step.
    - The first account will be rewared from ethereum where mining; the account is miner.
  
``` shell
geth --identity "Stovecoin" --rpc --rpcport "8545" -- rpccorsdomain "*" --datadir "$DATA_DIR" --port "30303" --nodiscover --rpcapi "db,eth,net,personal,web3" --rpcaddr "127.0.0.1" --networkid 1999 account new
```

  - Write genesis file for initial block setting.
    - `{account address}` has to be replaced with the actual addresses resulted in the above step.
    - The key contents of belows is `alloc` making balances.
  
``` json
{
    "config":{ },
    "nonce": "0x0000000000000042",
	"timestamp": "0x00",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData": "0x00",
	"gasLimit": "0x8000000",
	"difficulty": "0x400",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x3333333333333333333333333333333333333333",
	"alloc": {
		"{account address}" :
		{
			"balance" : "99999999999999"
		}
	}
}

```

  - Apply the file into the initial block before starting the Ethereum.
  
  ```shell
  geth --identity "Stovecoin" --rpc --rpcport "8545" -- rpccorsdomain "*" --datadir "$DATA_DIR" --port "30303" --nodiscover --rpcapi "db,eth,net,personal,web3" -- rpcaddr "127.0.0.1" --networkid 1999 init custom_genesis.json
  ```
  
  - Starting Ethereum
  
  ```shell
  geth --identity "Stovecoin" --rpc --rpcport "8545" -- rpccorsdomain "*" --datadir "$DATA_DIR" --port "30303" --nodiscover --rpcapi "db,eth,net,personal,web3" -- rpcaddr "127.0.0.1" --networkid 1999
  ```

## D-App configuration
### Starting D-App
  - D-App has been written by Node.js. Therefore, you can run and manage with `npm`. For starting the D-App, you should install all of related package, firstly. Next, you can execute `run.sh` script.
    - This script is based on nodemon, which monitor Node.js sourcecodes and restarting the D-App when changing one of them.
    - Instead of `nodemon`, you can simply run it with `node bin/www`

``` shell
cd dapps/webapp
npm install
./run.sh
```

  - Open `localhost:3000` in the web browser.

### Mapping Ethereum account to D-App user
  - Sign up a user on the D-App.
  - Connect into MongoDB and modify user's document.
  
  ```json
{
    "_id" : ObjectId("59a7662b11697a439b10be17"),
    "username" : "user1",
    "password" : "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    "account" : "{account address}",
    "stovecoin" : 181998,
    "__v" : 0
}
  ```

## Queations
### Reset all of blocks
  - For reseting the blocks, you could eliminate the chain data of Ethereum and then re-applying the genesis file.
  
  ```shell
  rm -rf $DATA_DIR/geth/chaindata $DATA_DIR/geth/lightchaindata
  geth --identity "Stovecoin" --rpc --rpcport "8545" --rpccorsdomain "*" --datadir "$DATA_DIR" --port "30303" --nodiscover --rpcapi "db,eth,net,web3" --networkid 1999 init custom_genesis.json
  ```
