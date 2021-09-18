const Gold = artifacts.require("Gold");
const NFTCoin = artifacts.require("NFTCoin");
const NFTToken = artifacts.require("NFTToken");

module.exports = async function (deployer) {
  //也可以传递参数给构造函数 deployer.deploy(A, arg1, arg2, ...);
  await deployer.deploy(Gold);
  await deployer.deploy(NFTCoin);
  await deployer.deploy(NFTToken);
};
