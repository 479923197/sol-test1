import Diamond from "../../build/contracts/Diamond.json";
import NftPlayer from "../../build/contracts/NftHero.json";
import Stake from "../../build/contracts/Stake.json";
import Marketplace from "../../build/contracts/Marketplace.json";

class config {
    //网络
    rpc_addr = 'ws://127.0.0.1:9545';
    networkId= 9999;

    //合约
    contract_diamond = {
        abi: Diamond.abi,
        address: Diamond.networks[this.networkId].address,
    };
    contract_nft = {
        abi: NftPlayer.abi,
        address: NftPlayer.networks[this.networkId].address,
    };
    contract_stake = {
        abi: Stake.abi,
        address: Stake.networks[this.networkId].address,
    };
    contract_market = {
        abi: Marketplace.abi,
        address: Marketplace.networks[this.networkId].address,
    };

    market= {
        fee_percent: 0.05
    };
}

export default new config();