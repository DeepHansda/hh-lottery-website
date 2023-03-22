require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */

const rpc_url = process.env.RPC_URL;
const wallet_key = process.env.PRIVATE_KEY;
const etherscan_key = process.env.ETHERSCAN_KEY;
const coinmarketcap = process.env.COINMARKETCAP;
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    sepolia: {
      url: rpc_url,
      accounts: [wallet_key],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: etherscan_key,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    player: {
      default: 1,
    },
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: coinmarketcap,
    currency: "INR",
    noColors: true,
    outputFile: "gas-report.txt",
  },
  solidity: "0.8.18",
};
