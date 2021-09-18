<template>
  <Card />
</template>

<script>
export default {
  
}












import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/NFTToken.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );

      //登录账号
      const accounts = await web3.eth.getAccounts(function (error, result) {
        if (!error) {
          console.log("登录账号",result)//受权成功后result能正常获取到帐号了
        }
      });
      this.account = accounts[0];

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  createCardCall: async function() {
    await this.meta.methods.createCard().call({from: this.account}, (error,result)=>{
      console.log("交易结果", error, result);
    });
    
    /*
    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
    */
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

</script>
