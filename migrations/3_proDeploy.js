//合约升级
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const NftHero = artifacts.require("NftHero");
const NftHeroProxy = artifacts.require("NftHeroProxy");

const Diamond = require("../build/contracts/Diamond.json");
const HeroPool = require("../build/contracts/HeroPool.json");


module.exports = async function (deployer, network, accounts) 
{
  const DiamondAddrss = Diamond['networks'][deployer.network_id]['address'];
  const HeroPoolAddrss = HeroPool['networks'][deployer.network_id]['address'];
  const NftHeroinstance = await deployProxy(NftHero, [DiamondAddrss, HeroPoolAddrss], { deployer });
  console.log("NftHero deployed, owner:" + NftHeroinstance.owner());

  //部署代理
  const NftHeroProxyInst = await deployProxy(NftHeroProxy, [], { deployer });
  console.log("NftHeroProxy deployed, owner:" + NftHeroProxyInst.owner());
  await NftHeroProxyInst.upgradeTo(NftHeroinstance.address);
  console.log("NftHeroProxy started");
};
