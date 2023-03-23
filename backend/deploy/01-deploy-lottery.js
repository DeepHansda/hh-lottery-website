const { network, ethers } = require("hardhat");
const {
  networkConfigs,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper.hardhat.config");
const { verify } = require("../utils/verify");
const FUND_AMOUNT = ethers.utils.parseEther("1")
module.exports = async ({ getNamedAccounts, deployments }) => {
  try {
    const { log, deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock;
    if (chainId == 31337) {
      vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
      vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
      const trasactionResponse = await vrfCoordinatorV2Mock.createSubscription()
      const trasactionReciept = await trasactionResponse.wait();
      subscriptionId = trasactionReciept.events[0].args.subId;

      await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
      vrfCoordinatorV2Address = networkConfigs[chainId]["vrfCoordinatorV2"];
      subscriptionId = networkConfigs[chainId]["subscriptionId"];
    }

    console.log(vrfCoordinatorV2Address)
    const waitBlockConfirmations = developmentChains.includes(network.name)
      ? 1
      : VERIFICATION_BLOCK_CONFIRMATIONS;

    const arguments = [
      vrfCoordinatorV2Address,
      subscriptionId,
      networkConfigs[chainId]["gasLane"],
      networkConfigs[chainId]["keepersUpdateInterval"],
      networkConfigs[chainId]["lotteryEntranceFee"],
      networkConfigs[chainId]["callbackGasLimit"],
    ];

    const lottery = await deploy("Lottery",{
      from: deployer,
      log: true,
      args: arguments,
      waitConfirmations: waitBlockConfirmations,
    });

    if (developmentChains.includes(network.name)) {
      const vrfCoordinatorV2Mock = await ethers.getContract(
        "VRFCoordinatorV2Mock"
      );
      await vrfCoordinatorV2Mock.addConsumer(subscriptionId, lottery.address);
    }

    if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_KEY
    ) {
      await verify(lottery.address, arguments);
    }

    log("Enter lottery with command:");
    const networkName = network.name == "hardhat" ? "localhost" : network.name;
    log(`yarn hardhat run scripts/enterRaffle.js --network ${networkName}`);
    log("----------------------------------------------------");
  } catch (error) {
    console.log(error);
  }
};

module.exports.tags = ["all", "lottery"];
