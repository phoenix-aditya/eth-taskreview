const createActors = artifacts.require("createActors");

module.exports = function(deployer) {
  deployer.deploy(createActors);
};
