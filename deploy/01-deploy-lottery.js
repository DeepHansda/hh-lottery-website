const {network} = require('hardhat')
module.exports = async({getNamedAccounts,deployments})=>{
    try{

        const {log,deploy}=deployments;
        const {deployer} = await getNamedAccounts();
        const chainId = network.config.chainId
    }
    catch(error){
        console.log(error)
    }
}