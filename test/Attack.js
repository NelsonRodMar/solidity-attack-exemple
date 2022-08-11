const {expect} = require("chai");

describe("Attack", function () {

    // Deploy the contract
    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();
        provider = ethers.provider;

        const VictimContract = await ethers.getContractFactory("contracts/Attack/VictimContract.sol:VictimContract");
        victimContract = await VictimContract.deploy();

        const AttackerContract = await ethers.getContractFactory("contracts/Attack/AttackerContract.sol:AttackerContract");
        attackerContract = await AttackerContract.connect(attacker).deploy(victimContract.address);
    });

    describe("Attack :", function attack() {
        it("Attack perform with success", async function () {
            const DEPOSIT_OWNER = 1000;
            const DEPOSIT_ATTACKER = 10;

            let balanceOfDeployerStart = await victimContract.balanceOf(deployer.address);
            let balanceOfAttackerStart = await victimContract.balanceOf(attacker.address);
            let balanceOfContractStart = await victimContract.totalStacked();
            let balancerAttackerWallet = await ethers.provider.getBalance(attacker.address)

            console.log('\t', "👛 Balance of Attacker wallet : ", ethers.utils.formatEther(balancerAttackerWallet));
            console.log('\t', "👛 Balance of Deployer : ", ethers.utils.formatEther(balanceOfDeployerStart));
            console.log('\t', "👛 Balance of Attacker : ", ethers.utils.formatEther(balanceOfAttackerStart));
            console.log('\t', "🏦 Value on VictimContract : ", ethers.utils.formatEther(balanceOfContractStart));


            console.log('\n', '\t', "📤 We send the value to the contract.... ", "\n");
            // Normal deposit
            await victimContract.connect(deployer).stack({value: ethers.utils.parseEther(DEPOSIT_OWNER.toString())});
            // Deposit via AttackerContract.sol
            await attackerContract.connect(attacker).deposit({value: ethers.utils.parseEther(DEPOSIT_ATTACKER.toString())});

            let balanceOfDeployer = await victimContract.balanceOf(deployer.address);
            let balanceOfAttackerContract = await victimContract.balanceOf(attackerContract.address);
            let balanceOfContract = await victimContract.totalStacked();

            expect(balanceOfDeployer).to.equal(ethers.utils.parseEther(DEPOSIT_OWNER.toString()));
            console.log('\t', "👛 Balance of Deployer : ", ethers.utils.formatEther(balanceOfDeployer));
            expect(balanceOfAttackerContract).to.equal(ethers.utils.parseEther(DEPOSIT_ATTACKER.toString()));
            console.log('\t', "👛 Balance of AttackerContract : ", ethers.utils.formatEther(balanceOfAttackerContract));
            expect(balanceOfContract).to.equal(ethers.utils.parseEther((DEPOSIT_OWNER + DEPOSIT_ATTACKER).toString()));
            console.log('\t', "🏦 Value on VictimContract : ", ethers.utils.formatEther(balanceOfContract));


            console.log('\n', '\t', "🤺 We attack the VictimContract.... ", "\n");

            await attackerContract.connect(attacker).attack();
            balanceOfAttackerContract = await attackerContract.totalBalances();
            expect(balanceOfAttackerContract).to.equal(ethers.utils.parseEther((DEPOSIT_OWNER + DEPOSIT_ATTACKER).toString()));
            console.log('\t', "🏦 Value on AttackerContract : ", ethers.utils.formatEther(balanceOfAttackerContract));

            let balanceOfDeployerEnd = await victimContract.balanceOf(deployer.address);
            let balanceOfAttackerContractEnd = await victimContract.balanceOf(attackerContract.address);
            let balanceOfContractEnd = await victimContract.totalStacked();

            expect(balanceOfDeployerEnd).to.equal(ethers.utils.parseEther(DEPOSIT_OWNER.toString()));
            console.log('\t', "👛 Balance of Deployer : ", ethers.utils.formatEther(balanceOfDeployer));
            expect(balanceOfAttackerContractEnd).to.equal(ethers.utils.parseEther((DEPOSIT_ATTACKER - DEPOSIT_ATTACKER).toString()));
            console.log('\t', "👛 Balance of Attacker Contract : ", ethers.utils.formatEther(balanceOfAttackerContract));
            expect(balanceOfContractEnd).to.equal(ethers.utils.parseEther("0"));
            console.log('\t', "🏦 Value on VictimContract : ", ethers.utils.formatEther(balanceOfContract));

            console.log('\n', '\t', "🤑 We collect the fund.... ", "\n");

            await attackerContract.connect(attacker).collectFunds();
            balancerAttackerWallet = await ethers.provider.getBalance(attacker.address)
            console.log('\t', "👛 Balance of Attacker wallet : ", ethers.utils.formatEther(balancerAttackerWallet));
        });
    });
});
