import Web3 from "web3";
import Diamond from "../../build/contracts/Diamond.json";
import NftPlayer from "../../build/contracts/NftHero.json";
import Stake from "../../build/contracts/Stake.json";

const App = {
  web3: null,
  account: null,
  networkId: 0,
  coin: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      this.networkId = 9999;//await web3.eth.net.getId();
      //const deployedNetwork = NftPlayer.networks[networkId];
      this.nft = new web3.eth.Contract(
        NftPlayer.abi,
        NftPlayer.networks[this.networkId].address,
      );
      this.diamond = new web3.eth.Contract(
        Diamond.abi,
        Diamond.networks[this.networkId].address,
      );
      this.stake = new web3.eth.Contract(
        Stake.abi,
        Stake.networks[this.networkId].address,
      );

      //连接账号
      try {
        await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error(error);
      }

      //读取账号
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      console.log("登录账号",accounts)//受权成功后accounts能正常获取到帐号了
      const accElement = document.getElementsByClassName("account")[0];
      accElement.innerHTML = accounts[0];
      this.account = accounts[0];

    } catch (error) {
      console.error("Could not connect to contract or chain.", error);
    }
  },

  //开卡
  createCardCall: function() {
    this.nft.once('createCardEvent', {}, function(error, event){ 
      if (!error) {
        let html = "<p>开卡结果 token:"+ App.web3.utils.toHex(event.returnValues.token) +"</p>";
        document.getElementsByClassName("createCard")[0].innerHTML = html;
      }
      console.log("触发开卡事件", error, event);
    });

    this.nft.methods.createCard().send({from: this.account})
    .on('error', (error)=>{
      console.error("抽卡发生错误", error);
    });
  },

  //获取我的所有卡片
  getCards: async function() {
    await this.nft.methods.getMyCards(this.account).call({}, (error,result)=>{
      console.log("查卡结果", error, result);
      
      if (error) {
        document.getElementsByClassName("getCards")[0].innerHTML = JSON.stringify(error || result);
      } else {
        let html = "";
        for (let i=0; i< result[0].length; i++) {
          let token = this.web3.utils.toHex(result[0][i]);
          html += `<p>token:${token}; id:${result[1][i]}; lv:${result[5][i]}; attr:${result[2][i]},${result[3][i]},${result[4][i]}</p>`;
        }
        document.getElementsByClassName("getCards")[0].innerHTML = html;
      }
    });
  },

  //授信
  approve: async function(){
    //授权
    let tokenAddress = NftPlayer.networks[this.networkId].address;

    await this.diamond.methods.approve(tokenAddress, 1e8).send({
      from: this.account, 
      gasLimit: this.web3.utils.toHex(90000),
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('20', 'gwei'))
    }, (error,result)=>{
      console.log("approve结果of"+NftPlayer.networks[this.networkId].address, error, result);
      document.getElementsByClassName("approve")[0].innerHTML = JSON.stringify(error || result);
    });
  },

  //获取授信额度
  allowance: async function() {
    //授权
    let tokenAddress = NftPlayer.networks[this.networkId].address;

    let allowce = await this.diamond.methods.allowance(this.account, tokenAddress).call();
    document.getElementsByClassName("allowance")[0].innerHTML = allowce;
  },

  //授权可质押
  stakeApprove: async function() {
    let stakeAddress = Stake.networks[this.networkId].address;
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);

    await this.nft.methods.approve(stakeAddress, token).send({
      from: this.account, 
      //gasLimit: this.web3.utils.toHex(40000),
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('20', 'gwei'))
    }, (error,result)=>{
      console.log("approve结果of"+NftPlayer.networks[this.networkId].address, error, result);
      document.getElementsByClassName("approve")[0].innerHTML = JSON.stringify(error || result);
    });
  },

  //查询授权
  getApproved: async function(){
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);

    let result = await this.nft.methods.getApproved(token).call();
    console.log("approved to:", result);
    document.getElementsByClassName("getApproved")[0].innerHTML = "approved to:" + JSON.stringify(result);
  },

  //质押
  stakeNft: async function() {
    let token = Math.floor(document.getElementsByClassName("stake")[0].value);

    await this.stake.methods.stakeNFT(token).send({
      from: this.account, 
      gasLimit: this.web3.utils.toHex(1000000),
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('20', 'gwei'))
    }, (error,result)=>{
      document.getElementsByClassName("stake")[0].innerHTML = JSON.stringify(error || result);
      console.log("stakeNft failed", error.message)
    });
  },

  //查询在质押
  viewStaked: async function() {
    //授权
    let tokenAddress = Stake.networks[this.networkId].address;

    let allowce = await this.stake.methods.reviewStaked().call();
    //document.getElementsByClassName("viewStaked")[0].innerHTML = allowce;
    console.log("再质押卡片:", allowce);
  },

  //签名
  sign: async function(){
    let tokenAddress = NftPlayer.networks[this.networkId].address;
    const tx = {
      from: this.account,
      to: tokenAddress,
      data: this.diamond.methods.allowance(this.account, tokenAddress).encodeABI() 
    };
    await this.web3.eth.sign( tx, tx.from, console.log);
  }
};

window.App = App;

window.addEventListener("load", function() {
  //http不支持事件监听已被废弃，ws可以
  App.web3 = new Web3(window.web3.currentProvider||new Web3.providers.WebsocketProvider('ws://127.0.0.1:9545'));

  console.log("web3 version:", App.web3.version);
  console.log("web3 givenProvider:", Web3.givenProvider);
  console.log("web3 currentProvider:", window.ethereum);

  App.start();
});