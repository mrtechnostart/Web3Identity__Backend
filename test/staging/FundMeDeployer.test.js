const { expect, assert } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { log } = deployments
const MIN_ETH = ethers.utils.parseEther("0.001")
describe("FundMeDeployer", () => {
    let FundMeDeployer, deployer,player
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        player = (await getNamedAccounts()).player
        await deployments.fixture(["all"])
        FundMeDeployer = await ethers.getContract("FundMeDeployer")
    })
    describe("deployFundMe", () => {
        it("Must Deploy FundMe", async () => {
            log("Deploying FundMe With Deployer!")
            await expect(FundMeDeployer.deployFundMe(MIN_ETH)).to.emit(
                FundMeDeployer,
                "FundMe__Deployed"
            )
        })
    })
    describe("deployFundMe__Features", () => {
        beforeEach(async () => {
            await FundMeDeployer.deployFundMe(MIN_ETH)
        })
        it("Must Revert with custom error when re-deploying", async () => {
            await expect(FundMeDeployer.deployFundMe(MIN_ETH)).to.be.revertedWith(
                "AlreadyDeployed__FundMeDeploy"
            )
        })
        it("Must Increase The Number Of Deployers Array", async () => {
            const numberOfDeployers = await FundMeDeployer.getNumberOfDeployers()
            assert(numberOfDeployers > 0)
        })
        it("Must add deployers properly", async () => {
            const deployerAddress = await FundMeDeployer.getDeployers("0")
            assert(deployerAddress == deployer)
        })
        it("Must return proper contract address wrt deployer address", async () => {
            const contractAddress = await FundMeDeployer.getContracts(deployer)
            assert(contractAddress.toString() != "0x0")
        })
    })
    describe("Handling FundMe Contract", () => {
        let FundMe, contractAddress
        beforeEach(async () => {
            await FundMeDeployer.deployFundMe(MIN_ETH)
            contractAddress = (await FundMeDeployer.getContracts(deployer)).toString()
            FundMe = await ethers.getContractAt("FundMe", contractAddress)
            await FundMe.fundContract({value:MIN_ETH})
        })
        describe("fundContract", () => {
            it("Must Fund the contract", async () => {
                await expect(FundMe.fundContract({ value: MIN_ETH })).to.emit(
                    FundMe,
                    "ContractFund"
                )
            })
            it("Must revert in case lesser ETH is given", async () => {
                await expect(
                    FundMe.fundContract({ value: ethers.utils.parseEther("0.00001") })
                ).to.be.revertedWith("NotEnoughETH__FundContract")
            })
        })
        describe("withdrawFund",()=>{
            it("Must Emit TransferSuccessfull in case of Successfull Transfer",async()=>{
                await expect(FundMe.withdrawFund(deployer)).to.emit(FundMe,"TransferSuccessfull")
            })
            it("Must Revert The Transaction With NotOwner",async()=>{
                await expect(FundMe.withdrawFund(player)).to.be.revertedWith("NotOwner__FundWithdraw")
            })
        })
    })
})
