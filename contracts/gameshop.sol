pragma solidity ^0.4.11;

contract GameShop {
  bytes32 public Pid;
  uint public Price;
  address public Owner;


  function GameShop(bytes32 pid, uint price) {
    Pid=pid;
    Price=price;
    Owner = msg.sender;
  }

  function ChangePrice(uint price) {
    if (Owner == msg.sender) {
      Price = price;
    }
  }

  function Purchase() payable {
    if (msg.value != Price) return;

    Owner.transfer(msg.value);

    //self-destruction
  }

  function Info() constant returns(bytes32,uint) {
    return (Pid,Price);
  }

}
