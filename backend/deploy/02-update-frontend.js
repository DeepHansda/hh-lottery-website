const { ethers, network } = require("hardhat");
const fs = require("fs");
const {
  frontEndAbiFile,
  frontEndAddressFile,
} = require("../helper.hardhat.config");
module.exports = async ({ getNamedAccounts, deployments }) => {
  try {
    if (process.env.UPDATE_FRONT_END) {
      console.log("Waiting for Frontend......");
      await updateABI().then(()=>console.log("Abi updated"));
      await updateContractAddresses().then(()=>console.log("Address Updated"));
    }
  } catch (error) {
    console.log(error);
  }
};

const updateABI = async () => {
  try {
    const contract = await ethers.getContract("Lottery");
    fs.writeFileSync(
      frontEndAbiFile,
      contract.interface.format(ethers.utils.FormatTypes.json)
    );
  } catch (error) {
    console.log(error);
  }
};

async function updateContractAddresses() {
    const lottery = await ethers.getContract("Lottery")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndAddressFile, "utf8"))
    if (network.config.chainId.toString() in contractAddresses) {
        if (!contractAddresses[network.config.chainId.toString()].includes(lottery.address)) {
            contractAddresses[network.config.chainId.toString()].push(lottery.address)
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = [lottery.address]
    }
    fs.writeFileSync(frontEndAddressFile, JSON.stringify(contractAddresses))
}