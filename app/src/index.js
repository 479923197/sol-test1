import Web3 from "web3";
import Frame from "./frame.js";
import Config from "./config.js";

const App = {

  //开卡
  createCardCall: function() {
    /*
    let param = {
      from: Frame.account,
      to: Frame.nft._address,
      data: Frame.nft.methods.createCard().encodeABI() 
    };
    param.gas = await web3.eth.estimateGas(param);
    
    await web3.eth.sendTransaction(param, function(err, transactionHash) {
      if (!err)
        console.log(transactionHash);
    });*/
    Frame.send('nft', 'createCard', [], 'createCardEvent');
  },

  //获取我的所有卡片
  getCards: function() {
    Frame.call("nft", "getMyCards", [Frame.account], function(result){
      let html = "";
      for (let i=0; i< result[0].length; i++) {
        let token = web3.utils.toHex(result[0][i]);
        html += `<p>token:${token}; id:${result[1][i]}; lv:${result[5][i]}; attr:${result[2][i]},${result[3][i]},${result[4][i]}</p>`;
      }
      document.getElementsByClassName("getCards")[0].innerHTML = html;
    });
  },

  //授信
  approve: function(){
    //授权
    let tokenAddress = Frame.nft._address;
    let cost = web3.utils.toHex(1e18);
    
    Frame.send('diamond', 'approve', [tokenAddress, cost], 'Approval');
  },

  
  //查询授信额度
  getAllowance: function (){
    let toAddress = document.getElementsByClassName("erc20ToAdress")[0].value;
    Frame.call("diamond", "allowance", [Frame.account, toAddress], function(allowce){
      document.getElementsByClassName("allowance")[0].innerHTML = allowce;
    });
  },

  //授权可质押
  stakeApprove: function() {
    let stakeAddress = Frame.stake._address;
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);

    Frame.send('nft', 'approve', [stakeAddress, token], 'Approval');
  },

  //查询授权
  getApproved: async function(){
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);

    let result = await Frame.nft.methods.getApproved(token).call();
    document.getElementsByClassName("getApproved")[0].innerHTML = "approved to:" + JSON.stringify(result);
  },

  //质押
  stakeNft: async function() {
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);

    await Frame.stake.methods.stakeNFT(token).send({
      from: Frame.account, 
      gasLimit: web3.utils.toHex(1000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
    }, (error,result)=>{
      document.getElementsByClassName("stake")[0].innerHTML = JSON.stringify(error || result);
      console.log("stakeNft failed", error.message)
    });
  },

  //查询在质押
  viewStaked: async function() {
    let allowce = await Frame.stake.methods.reviewStaked().call({
      from: Frame.account, 
      gasLimit: web3.utils.toHex(9000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
    });
    //document.getElementsByClassName("viewStaked")[0].innerHTML = allowce;
    console.log("在质押卡片:", allowce);
  },

  //授权手续费
  approveMarketFee: async function() {
    let price = Math.floor(document.getElementsByClassName("put_price")[0].value * 1e18);
    let fee = Math.floor(Config.market.fee_percent * price);
    let tokenAddress = Frame.market._address;

    await Frame.diamond.methods.approve(tokenAddress, web3.utils.toHex(fee)).send({
      from: Frame.account, 
      gasLimit: web3.utils.toHex(90000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
    }, (error,result)=>{
      console.log("approve市场手续费"+fee+"，结果：", error, result);
    });
  },

  //授权卡牌到市场
  approveMarketHero: async function() {
    let token = Math.floor(document.getElementsByClassName("put_market")[0].value);
    let tokenAddress = Frame.market._address;

    await Frame.nft.methods.approve(tokenAddress, token).send({
      from: Frame.account, 
      //gasLimit: web3.utils.toHex(40000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
    }, (error,result)=>{
      console.log("approve卡牌到市场，结果：", error, result);
    });
  },

  //出售
  createProduct: async function(){
    let token = Math.floor(document.getElementsByClassName("put_market")[0].value);
    let price = web3.utils.toHex(Math.floor(document.getElementsByClassName("put_price")[0].value * 1e18));
    
    await Frame.market.methods.createProduct(token, price).send({
      from: Frame.account, 
      gasLimit: web3.utils.toHex(1000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
    }, (error,result)=>{
      console.log("createProduct result", error, result)
    });
  },

  //取回在售物品
  withdrawProduct: async function(){
    let token = Math.floor(document.getElementsByClassName("put_market")[0].value);

    await Frame.market.methods.withdrawProduct(token).send({
      from: Frame.account, 
      gasLimit: web3.utils.toHex(1000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
    }, (error,result)=>{
      console.log("withdrawProduct result", error, result)
    });
  },

  //查询我的在售
  reviewMyProducts: async function(){
    let result = await Frame.market.methods.reviewMyProducts().call();
    console.log("我的在售卡片:", result);
  },


  //签名
  sign: async function(){
    let tokenAddress = Frame.nft._address;
    const tx = {
      from: Frame.account,
      to: tokenAddress,
      data: Frame.diamond.methods.allowance(Frame.account, tokenAddress).encodeABI() 
    };
    await web3.eth.sign( tx, tx.from, console.log);
  }
};

window.App = App;

window.addEventListener("load", function() {
  Frame.initAccount();
  Frame.initContract();

  //开启调试
  window.debug = true;

  document.getElementsByClassName("erc20ToAdress")[0].value = Config.contract_nft.address;
});