//合约升级
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const NftHero = artifacts.require("NftHero");
const NftHeroProxy = artifacts.require("NftHeroProxy");
const Stake = artifacts.require("Stake");

const Gold = require("../build/contracts/Gold.json");
const Diamond = require("../build/contracts/Diamond.json");
const HeroPool = require("../build/contracts/HeroPool.json");


module.exports = async function (deployer, network, accounts) 
{
  const DiamondAddrss = Diamond['networks'][deployer.network_id]['address'];
  const GoldAddrss = Gold['networks'][deployer.network_id]['address'];
  const HeroPoolAddrss = HeroPool['networks'][deployer.network_id]['address'];
  const NftHeroinstance = await deployProxy(NftHero, [DiamondAddrss, HeroPoolAddrss], { deployer });
  console.log("NftHero deployed, owner:" + NftHeroinstance.owner());

  //部署代理
  const NftHeroProxyInst = await deployProxy(NftHeroProxy, [], { deployer });
  console.log("NftHeroProxy deployed, owner:" + NftHeroProxyInst.owner());
  await NftHeroProxyInst.upgradeTo(NftHeroinstance.address);
  console.log("NftHeroProxy started");

  await deployProxy(Stake, [GoldAddrss, NftHeroinstance.address], { deployer });
  console.log("stake started");
};
