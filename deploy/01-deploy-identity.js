const { verify } = require("../utils/verify")

const { developmentChains } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying FundMeDeployer Now!")
    const FundMeDeployer = await deploy("FundMeDeployer", {
        from: deployer,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("Deploying FundMe Now!")
    await deploy("FundMe",{
        from:deployer,
        log:true,
        args:[deployer,ethers.utils.parseEther("0.001")],
        waitConfirmations: network.config.blockConfirmations || 1
    })

    if (!developmentChains.includes(network.name)) {
        log("Now Verifying!")
        await verify(FundMeDeployer.address)
    }
}

module.exports.tags = ["all", "FundMeDeployer"]