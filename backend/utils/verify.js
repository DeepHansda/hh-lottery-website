const { run } = require("hardhat");

const verify = async (contractAddress, arguments) => {
  console.log("Verifying...........");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: arguments,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verify };
