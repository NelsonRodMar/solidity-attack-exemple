// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

/**
 * @title Victim Contract
 * @author @NelsonRodMar.lens
 * @notice A simple stacking contract with a reentrancy attack on a single function
 */

contract VictimContract is ReentrancyGuard {
    mapping(address => uint) private _balances;

    constructor() public {}

    function stack() external payable {
        _balances[msg.sender] += msg.value;
    }

    function withdraw() external nonReentrant {
        require(_balances[msg.sender] > 0, "Nothing to withdraw");
        uint256 _amount = _balances[msg.sender];
        (bool sent, bytes memory data) = msg.sender.call{value : _amount}("");
        require(sent, "Failed to send Ether");
        _balances[msg.sender] = 0;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function totalStacked() public view returns (uint256) {
        return address(this).balance;
    }
}
