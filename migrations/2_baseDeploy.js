//合约升级
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const RandPool = artifacts.require("HeroPool");
const Gold = artifacts.require("Gold");
const Diamond = artifacts.require("Diamond");

module.exports = async function (deployer) {
  //原始部署，也可以传递参数给构造函数 deployer.deploy(A, arg1, arg2, ...);
  //await deployer.deploy(Gold);
  await deployer.deploy(RandPool);
  
  //可升级部署
  await deployProxy(Gold, [], { deployer });
  console.log("Gold deployed");

  await deployProxy(Diamond, [], { deployer });
  console.log("Diamond deployed");
};
