//合约升级
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const NftHeroV2 = artifacts.require("NftHeroV2");

module.exports = async function (deployer, network) {
  /*const oldContractAddr = "0x991A24323E3936E5648e26Af80Ad2f14e61D41BD";
  //升级
  const upgraded = await upgradeProxy(oldContractAddr, NftHeroV2, { deployer });
  console.log("NftHeroV2 deployed");
  */
};
