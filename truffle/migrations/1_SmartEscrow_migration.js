const SmartEscrow = artifacts.require("SmartEscrow");

modules.exports = function(deployer) {
    deployer.deploy(SmartEscrow);
};