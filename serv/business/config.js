const Diamond = require("../../build/contracts/Diamond.json");
const NftPlayer = require("../../build/contracts/NftHero.json");
const Stake = require("../../build/contracts/Stake.json");
const Marketplace = require("../../build/contracts/Marketplace.json");

class config {
    constructor() {

        this.xdebug = true;

        // 网络，必须是websocket网络
        this.rpc_addr = 'http://127.0.0.1:9545';
        this.networkId= 9999;

        // 市场
        this.market= {
            fee_percent: 0.05
        };

        // 合约配置
        this.contractList = {
            'diamond': {
                abi: Diamond.abi,
                address: Diamond.networks[this.networkId].address.toLowerCase(),
            },
            'nft': {
                abi: NftPlayer.abi,
                address: NftPlayer.networks[this.networkId].address.toLowerCase(),
            },
            'stake': {
                abi: Stake.abi,
                address: Stake.networks[this.networkId].address.toLowerCase(),
            },
            'market': {
                abi: Marketplace.abi,
                address: Marketplace.networks[this.networkId].address.toLowerCase(),
            }
        };

        // mysql
        this.mysql = {
            dev : {
                host     : '119.45.29.109',
                port     : 3307,
                user     : 'root',
                password : 'wfm0Pass',
                database : 'test',
            },
            prod : {
                host     : '119.45.29.109',
                port     : 3307,
                user     : 'root',
                password : 'wfm0Pass',
                database : 'test',
            }
        };
    }
    
}

module.exports = new config();