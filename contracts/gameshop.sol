pragma solidity ^0.4.11;

contract GameShop {
  bytes32 public Pid;
  uint256 public Price;
  address private Owner;


  function GameShop(bytes32 pid, uint256 price) {
    Pid=pid;
    Price=price;
    Owner = msg.sender;
  }

  function ChangePrice(uint256 price) {
    if (Owner == msg.sender) {
      Price = price;
    }
  }

  function Purchase() payable {
    if (msg.value != Price) return;

    Owner.send(msg.value);

    //self-destruction
  }

  function Info() constant returns(bytes32,uint256) {
    return (Pid,Price);
  }

}
