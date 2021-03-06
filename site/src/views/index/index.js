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

  if (Frame.account != null) {
    $("#login_btn").text(Frame.account.substr(0,3)+ "..."+ Frame.account.substr(-4,4));
  }

  // 登录
  $("#login_btn").on('click', async ()=>{
    await Frame.init();
    if (Frame.account != null) {
      $("#login_btn").text(Frame.account.substr(0,3)+ "..."+ Frame.account.substr(-4,4));
    }
  });

  // 授权
  $("#chouka_approve_btn").on("click", ()=>{
    let tokenAddress = Frame.contracts['nft']._address;
    let cost = Web3.utils.toHex(1e18);
    Frame.send('diamond', 'approve', [tokenAddress, cost]);
  })

  // 抽卡
  $("#chouka_btn").on("click", ()=>{
    Frame.send('nft', 'createCard', []);
  })

  //确定
  $("#chouka_done").on('click', ()=>{
    $("#chouka_done").addClass("hide")
    $("#chouka_approve_btn").removeClass("hide")
    $("#card_wrapper").addClass("hide")
    $("#kabei_wrapper").removeClass("hide")
  })
})();