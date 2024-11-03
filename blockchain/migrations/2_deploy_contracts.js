// blockchain/migrations/2_deploy_evidence_chain.js
const Court = artifacts.require("Court");

module.exports = function(deployer) {
  deployer.deploy(Court);
};