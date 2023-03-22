const { ethers } = require("hardhat");

async function main() {
  try {
    const lottery = await ethers.getContract("Lottery");
    const entranceFee = await lottery.getlotteryEntranceFee();
    const trasactionResponse = await lottery.enterLottery({
      value: entranceFee + 1,
    });
    console.log("Entered!");
  } catch (error) {
    console.log(error);
  }
}

main();
