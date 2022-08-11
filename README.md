# Reentrancy on a Single Function

This branch contain an implementation of the reentrancy attack on a single function.

> ℹ️ The contract ar not deployed, but you can find everything in this branch about Reentrancy Single Function attack <br />
> 🤺 You can find the contract of the attack in the folder [contracts/Attack](./contracts/Attack) <br />
> 🛡 You can find the contract with the [OpenZeppelin Reentrancy Guard](https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard) in the folder [contracts/Defense](./contracts/Defense) <br />
> ⚠️ This repository is just for informational purposes

## Command

```bash
npx hardhat test ./test/Attack.js # To run the Reentrancy Single Function attack

npx hardhat test ./test/Defense.js # To run the Reentrancy Single Function defense
```
