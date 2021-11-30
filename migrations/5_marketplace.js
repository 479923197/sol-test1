//合约升级
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const Marketplace = artifacts.require("Marketplace");
const Diamond = require("../build/contracts/Diamond.json");
const NftHero = require("../build/contracts/NftHero.json");

module.exports = async function (deployer, network) {
  const DiamondAddrss = Diamond['networks'][deployer.network_id]['address'];
  const NftHeroAddrss = NftHero['networks'][deployer.network_id]['address'];

  const MarketplaceInstance = await deployProxy(Marketplace, [DiamondAddrss, NftHeroAddrss], { deployer });
  console.log("MarketplaceInstance deployed, address:" + MarketplaceInstance.address);
};
