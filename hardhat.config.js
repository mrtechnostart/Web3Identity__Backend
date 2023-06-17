require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY_PRIMARY = process.env.SEPOLIA_PRIVATE_KEY1
const PRIVATE_KEY_SECONDARY = process.env.SEPOLIA_PRIVATE_KEY2

module.exports = {
    solidity: "0.8.18",
    networks: {
        sepolia: {
            /* Get your RPC URL from alchemy */
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY_PRIMARY,PRIVATE_KEY_SECONDARY],
            chainId: 11155111,
            blockConfirmation: 6,
        },
        hardhat: {
            chainId: 31337,
            blockConfirmation: 1,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        currency: "INR",
        outputFile: "gas-report.txt",
        noColors: true,
    },
    mocha:{
        timeout:200000
    }
}