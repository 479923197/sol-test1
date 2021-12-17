import Web3 from "web3";
import Frame from "./frame.js";
import Config from "./config.js";
import $ from 'jquery';


window.xdebug = true;
window.$ = $;
window.jQuery = $;

$(async function(){
  await Frame.init();
  $(".account").text( Frame.account );

  //自动读取
  let list = [
    ["diamond", "owner"],
    ["diamond", "totalSupply"],
    ["gold", "owner"],
    ["gold", "totalSupply"],
    ["nft", "owner"],
  ];
  for (var i=0; i<list.length; i++) {
    var contract = list[i][0];
    var method = list[i][1];

    Frame.call(contract, method, {}, function(val){
      console.log(val)
      $(`.${contract} .${method}`).text(val);
    });
  }

  //diamond
  $(".diamond .address").text(Config.contractList.diamond.address);

  //gold
  $(".gold .address").text(Config.contractList.gold.address);
})();