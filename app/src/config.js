import Diamond from "../../build/contracts/Diamond.json";
import Gold from "../../build/contracts/Gold.json";
import NftPlayer from "../../build/contracts/NftHero.json";
import Stake from "../../build/contracts/Stake.json";
import Marketplace from "../../build/contracts/Marketplace.json";

class config {
    //网络，必须是websocket网络
    rpc_addr = 'ws://127.0.0.1:9545';
    networkId= 9999;

    //市场
    market= {
        fee_percent: 0.05
    };

    //合约配置
    contractList = {
        'diamond': {
            abi: Diamond.abi,
            address: Diamond.networks[this.networkId].address,
        },
        'gold': {
            abi: Gold.abi,
            address: Gold.networks[this.networkId].address,
        },
        'nft': {
            abi: NftPlayer.abi,
            address: NftPlayer.networks[this.networkId].address,
        },
        'stake': {
            abi: Stake.abi,
            address: Stake.networks[this.networkId].address,
        },
        'market': {
            abi: Marketplace.abi,
            address: Marketplace.networks[this.networkId].address,
        }
    };
}

export default new config();