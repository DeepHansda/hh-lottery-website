require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    goerli:{
      url:"",
      accounts:[],
      chainId:"",      
    },
    
  },
  solidity: "0.8.18",
};
