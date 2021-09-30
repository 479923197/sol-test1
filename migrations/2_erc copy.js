//合约升级
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const Gold = artifacts.require("Gold");
const Diamond = artifacts.require("Diamond");
const NftPlayer = artifacts.require("NftPlayer");
const NftPlayerV2 = artifacts.require("NftPlayer2");

module.exports = async function (deployer) {
  //原始部署，也可以传递参数给构造函数 deployer.deploy(A, arg1, arg2, ...);
  //await deployer.deploy(Gold);
  
  //可升级部署
  await deployProxy(Gold, [], { deployer });
  const DiamondInstance = await deployProxy(Diamond, [], { deployer });
  const NftPlayerinstance = await deployProxy(NftPlayer, [DiamondInstance.address], { deployer });
  //升级
  const upgraded = await upgradeProxy(NftPlayerinstance.address, NftPlayerV2, { deployer });
};
