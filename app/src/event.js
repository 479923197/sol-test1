import Config from "./config.js";

export default [
    //授权钻石用于开卡或挂牌手续费
    {
        contract: "diamond",
        event: 'Approval',
        account_key: 'owner',
        callback: function(owner, spender, amount) {
            //console.log(`approve市场手续费:${amount}, from:${owner}, to:${spender}`);
        }
    },

    /******************************* 卡牌 ************************* */
    //开卡
    {
        contract: "nft",
        event: 'createCardEvent',
        account_key: 'owner',
        callback: function(owner, tokenid, heroid, li, min, zhi) {
      
        }
    },
    //卡牌授权给市场或stake
    {
        contract: "nft",
        event: 'Approval',
        account_key: 'owner',
        callback: function(owner, to, tokenId) {
            if (to == Config.contract_stake.address) {
                console.log(`approve到可质押，结果：${tokenId}, from:${owner}, to:${to}`);
            } else if (to == Config.contract_market.address) {
                console.log(`approve卡牌到市场，结果：${tokenId}, from:${owner}, to:${to}`);
            }
        }
    },
    //卡牌过户给别人
    {
        contract: "nft",
        event: 'transferCardEvent',
        account_key: 'from',
        callback: function(from, to, tokenid) {
      
        }
    },
    //卡牌过户给我
    {
        contract: "nft",
        event: 'transferCardEvent',
        account_key: 'to',
        callback: function(from, to, tokenid) {
      
        }
    },

    /***************************** stake ************************* */
    //质押
    {
        contract: "stake",
        event: 'onNftStake',
        account_key: 'sender',
        callback: function(sender, tokenId, blockNumber){
            console.log(`onNftStake: sender:${sender}, token:${tokenId}, block_number:${blockNumber}`);
          }
    },
    //解除质押（会同时触发发放分红事件）
    {
        contract: "stake", 
        event: 'onNftUnStaked',
        account_key: 'staker',
        callback: function(staker, tokenId, blockNumber){
            console.log(`onNftUnStaked: staker:${sender}, token:${tokenId}, block_number:${blockNumber}`);
          }
    },
    //发放质押分红
    {
        contract: "stake",
        event: 'StakePayout',
        account_key: 'staker',
        callback: function(staker, tokenId, blockNumber,stakeAmount,fromBlock,toBlock){
            console.log(`StakePayout: staker:${sender}, token:${tokenId}, got_money:${stakeAmount}, block:${fromBlock}~${toBlock}`);
          }
    },

    /***************************** 市场 ************************* */
    //挂牌出售
    {
        contract: "market",
        event: 'onCreateProduct',
        account_key: 'staker',
        callback: function(owner, tokenId, price) {
            console.log(`已经挂牌到市场, token:${tokenId}, price:${price}`);
        }
    },
    //市场撤销出售
    {
        contract: "market",
        event: 'onNftWithdraw',
        account_key: 'owner',
        callback: function(owner, tokenId) {
            console.log(`已经取回：${tokenId}`);
        }
    },
    //买到卡牌
    {
        contract: "market",
        event: 'onBuy',
        account_key: 'comsumer',
        callback: function(comsumer, staker, tokenId, price) {
            console.log(`购买获得卡牌：${tokenId}`);
        }
    },
];