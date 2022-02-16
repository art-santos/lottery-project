// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    address public winner;

    modifier restricted(){
       require(msg.sender == manager);
       _;
   }

    function generateRandomness() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))) % players.length;
    }

    function setManager () public {
        manager = msg.sender;
    }

   function setPlayers () public payable {
       require(msg.value > 0.01 ether);
       players.push(msg.sender);
   }

   function getPlayers() public view returns (address[]) {
        return players;
    }

   function setWinner () public restricted {
       uint random = generateRandomness();
       winner = players[random];
       winner.transfer(address(this).balance);
       players = new address[](0);
   }

}