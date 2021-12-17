const mysqldb = require("../lib/mysqldb.js");

exports.nft = {
    //抽卡
    async createCardEvent: (transHash, owner, tokenid, heroid, li, min, zhi) => {
        let sql = "insert into nft_info(user_id,token_id,li,min,zhi,lv,create_time,last_hash) 
            values()";
        await mysqldb.query("select linkurl from app_info", null);
    },

    //卡过户给别人
    transferCardEvent: (transHash, from, to, tokenid) => {
        
    },

    //升级
    upgradeEvent: (transHash, owner, tokenid, newLv, newExp) => {
        
    }
}