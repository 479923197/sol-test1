import Web3 from "web3";
import Frame from "./frame.js";
import Config from "./config.js";

const App = {

  //开卡
  createCardCall: function() {
    /*
    let param = {
      from: Frame.account,
      to: Frame.nft']._address,
      data: Frame.nft.methods.createCard().encodeABI() 
    };
    param.gas = await Frame.web3.eth.estimateGas(param);
    
    await Frame.web3.eth.sendTransaction(param, function(err, transactionHash) {
      if (!err)
        console.log(transactionHash);
    });*/
    Frame.send('nft', 'createCard', []);
  },

  //获取我的所有卡片
  getCards: function() {
    Frame.call("nft", "getMyCards", [Frame.account], function(result){
      let html = "";
      for (let i=0; i< result[0].length; i++) {
        let token = Web3.utils.toHex(result[0][i]);
        html += `<p>token:${token}; id:${result[1][i]}; lv:${result[5][i]}; attr:${result[2][i]},${result[3][i]},${result[4][i]}</p>`;
      }
      document.getElementsByClassName("getCards")[0].innerHTML = html;
    });
  },

  //授信
  approve: function(){
    //授权
    let tokenAddress = Frame.contracts['nft']._address;
    let cost = Web3.utils.toHex(1e18);
    
    Frame.send('diamond', 'approve', [tokenAddress, cost]);
  },

  
  //查询授信额度
  getAllowance: function (){
    let toAddress = document.getElementsByClassName("erc20ToAdress")[0].value;
    Frame.call("diamond", "allowance", [Frame.account, toAddress], function(allowce){
      document.getElementsByClassName("allowance")[0].innerHTML = allowce;
    });
  },

  /******************************************************* 质押 ****************************************************** */

  //授权可质押
  stakeApprove: function() {
    let stakeAddress = Frame.contracts['stake']._address;
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);

    Frame.send('nft', 'approve', [stakeAddress, token]);
  },

  //查询授权
  getApproved: function(){
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);

    Frame.call("nft", "getApproved", [token], function(address){
      document.getElementsByClassName("getApproved")[0].innerHTML = "approved to:" + JSON.stringify(address);
    });
  },

  //质押
  stakeNft: function() {
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);

    Frame.send('stake', 'stakeNFT', [token]);
  },

  //查询在质押
  viewStaked: function() {
    Frame.call("stake", "reviewStaked", [], function(result){
      console.log("在质押卡片:", result);
      document.getElementsByClassName("viewStaked")[0].innerHTML = JSON.stringify(result);
    });
  },

  //解除质押
  unStakeNft: function() {
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);
    Frame.send('stake', 'unstake', [token]);
  },

  //领取质押分红
  harvest: function() {
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);
    Frame.send('stake', 'harvest', [token]);
  },

  /****************************************** 市场 ****************************************** */

  //授权手续费
  approveMarketFee: function() {
    let price = Math.floor(document.getElementsByClassName("put_price")[0].value * 1e18);
    let fee = Math.floor(Config.market.fee_percent * price);
    let tokenAddress = Frame.contracts['market']._address;

    Frame.send('diamond', 'approve', [tokenAddress, Web3.utils.toHex(fee)]);
  },

  //授权卡牌到市场
  approveMarketHero: function() {
    let token = Math.floor(document.getElementsByClassName("put_market")[0].value);
    let tokenAddress = Frame.contracts['market']._address;

    Frame.send('nft', 'approve', [tokenAddress, Web3.utils.toHex(fee)]);
  },

  //出售
  createProduct: function(){
    let token = Math.floor(document.getElementsByClassName("put_market")[0].value);
    let price = Web3.utils.toHex(Math.floor(document.getElementsByClassName("put_price")[0].value * 1e18));

    Frame.send('market', 'createProduct', [token, price]);
  },

  //取回在售物品
  withdrawProduct: function(){
    let token = Math.floor(document.getElementsByClassName("put_market")[0].value);

    Frame.send('market', 'withdrawProduct', [token]);
  },

  //查询我的在售
  reviewMyProducts: function(){
    Frame.call("market", "reviewMyProducts", [], function(result){
      console.log("我的在售卡片:", result);
    });
  },


  //签名
  sign: async function(){
    let tokenAddress = Frame.contracts['nft']._address;
    const tx = {
      from: Frame.account,
      to: tokenAddress,
      data: Frame.diamond.methods.allowance(Frame.account, tokenAddress).encodeABI() 
    };
    await Frame.web3.eth.sign( tx, tx.from, console.log);
  }
};

window.App = App;

window.addEventListener("load", function() {
  //开启调试
  window.xdebug = true;
  
  (async function(){
    await Frame.init();

    document.getElementsByClassName("account")[0].innerHTML = Frame.account;
  })();
  
  document.getElementsByClassName("erc20ToAdress")[0].value = Config.contractList.nft.address;
});