pragma solidity ^0.4.0;
contract Market {
    address buyer;
    mapping (address => uint) balances;
    function Marker() {
        buyer = msg.sender;
    }
    function purchase(address seller, uint amount) {
        if (balances[msg.sender] < amount) return;
        if (msg.sender != buyer) return;
        balances[seller] += amount;
        balances[buyer] -= amount;
    }

    function queryBalance(address addr) constant returns (uint balance) {
        return balances[addr];
    }
}
