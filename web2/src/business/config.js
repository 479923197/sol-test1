import Diamond from "../../../build/contracts/Diamond.json";
import NftPlayer from "../../../build/contracts/NftHero.json";
import Stake from "../../../build/contracts/Stake.json";
import Marketplace from "../../../build/contracts/Marketplace.json";

class config {
    constructor() {

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
    }
    
}

export default new config();