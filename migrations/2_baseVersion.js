//合约升级
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Gold = artifacts.require("Gold");
const Diamond = artifacts.require("Diamond");
const NftHero = artifacts.require("NftHero");
const NftHeroProxy = artifacts.require("NftHeroProxy");

module.exports = async function (deployer) {
  //原始部署，也可以传递参数给构造函数 deployer.deploy(A, arg1, arg2, ...);
  //await deployer.deploy(Gold);
  
  //可升级部署
  await deployProxy(Gold, [], { deployer });
  console.log("Gold deployed");
  const DiamondInstance = await deployProxy(Diamond, [], { deployer });
  console.log("Diamond deployed");
  const NftHeroinstance = await deployProxy(NftHero, [DiamondInstance.address], { deployer });
  console.log("NftHero deployed, owner:" + NftHeroinstance.owner());

  //部署代理
  const NftHeroProxyInst = await deployProxy(NftHeroProxy, [], { deployer });
  console.log("NftHeroProxy deployed, owner:" + NftHeroProxyInst.owner());
  await NftHeroProxyInst.upgradeTo(NftHeroinstance.address);
  console.log("NftHeroProxy started");
};
