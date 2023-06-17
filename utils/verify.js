const { run } = require("hardhat")

async function verify(contractAddress) {
    console.log("Verifying!")
    try {
        await run("verify:verify", {
            address: contractAddress
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    verify,
}
