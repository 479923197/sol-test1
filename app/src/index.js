import Web3 from "web3";
import Diamond from "../../build/contracts/Diamond.json";
import NftPlayer from "../../build/contracts/NftPlayerV2.json";

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
      this.networkId = await web3.eth.net.getId();
      //const deployedNetwork = NftPlayer.networks[networkId];
      this.nft = new web3.eth.Contract(
        NftPlayer.abi,
        NftPlayer.networks[this.networkId].address,
      );
      this.diamond = new web3.eth.Contract(
        Diamond.abi,
        Diamond.networks[this.networkId].address,
      );

      //登录账号
      const accounts = await web3.eth.getAccounts(function (error, result) {
        if (!error) {
          console.log("登录账号",result)//受权成功后result能正常获取到帐号了
          const accElement = document.getElementsByClassName("account")[0];
          accElement.innerHTML = result[0];
        }
      });
      this.account = accounts[0];

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  //开卡
  createCardCall: function() {
    this.nft.once('createCardEvent', {}, function(error, event){ 
      console.log("触发开卡事件", event); 

      let html = "<p>开卡结果 token:"+ App.web3.utils.toHex(event.returnValues.token) + "; player_id:"+ event.returnValues.player_id+ "</p>";
      document.getElementsByClassName("createCard")[0].innerHTML = html;
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
          let player_id = result[1][i];
          html += "<p>token:"+ token + "; player_id:"+ player_id+ "</p>";
        }
        document.getElementsByClassName("getCards")[0].innerHTML = html;
      }
    });
  },

  //授信
  approve: async function(){
    //授权
    let tokenAddress = NftPlayer.networks[this.networkId].address;

    await this.diamond.methods.approve(tokenAddress, 1).send({
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

  //查看球员池
  getPool: async function() {
    //授权
    let tokenAddress = NftPlayer.networks[this.networkId].address;

    let pool = await this.nft.methods.getPlayerPool().call();
    document.getElementsByClassName("getPool")[0].innerHTML = JSON.stringify(pool);
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:9545"),
    );
  }

  App.start();
});