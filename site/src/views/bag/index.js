import '../../assets/Common';
import './index.scss';
import './index.html';

import Web3 from "web3";
import Frame from "../../business/frame";
// import Config from "../../assets/js/business/config";

// 返回顶部按钮
// Helper.backTop();

// 开启调试
window.xdebug = true;
  
(async function(){
  await Frame.init();

  if (Frame.account != null) {
    $("#login_btn").text(Frame.account.substr(0,3)+ "..."+ Frame.account.substr(-4,4));
  }

  Frame.call("nft", "getMyCards", [Frame.account], function(result){
    let basehtml = $(".card")[0].outerHTML;console.log("html", basehtml)

    for (let i=0; i< result[0].length; i++) {
      let wp = $(basehtml).removeClass("hide")
      wp.find(".lv").text(result[5][i])
      wp.find(".li").text(result[2][i])
      wp.find(".min").text(result[3][i])
      wp.find(".zhi").text(result[4][i])
      wp.find(".card-title").text(`#${result[0][i]}`)
      //wp = wp.find(".card-img-top").attr("src", require(`../assets/img/hero/${result[1][i]}.jpg`))
      $("#main-business").append(wp);
      //let token = Web3.utils.toHex(result[0][i]);
    }
  });
})();