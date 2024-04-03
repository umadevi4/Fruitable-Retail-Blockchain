const MyContract = artifacts.require("Transactions");

module.exports = function (deployer) {
  deployer.deploy(MyContract);
};
