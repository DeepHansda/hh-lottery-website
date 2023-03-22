const { network } = require("hardhat");
const BASE_FEE = "250000000000000000"; // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9; // link per gas, is this the gas lane? // 0.000000001 LINK per gas
module.exports = async ({ getNamedAccounts, deployments }) => {
  try {
    const { log, deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if (chainId == 31337) {
      log("Local Network Detected! Deploying Mocks....");
      await deploy("VRFCoordinatorV2Mock", {
        from: deployer,
        log: true,
        args: [BASE_FEE, GAS_PRICE_LINK],
      }).then(() => {
        log("Mocks Deployed!");
        log("----------------------------------------------------------");
        log(
          "You are deploying to a local network, you'll need a local network running to interact"
        );
        log(
          "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        );
        log("----------------------------------------------------------");
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.tags = ["all","mock"]