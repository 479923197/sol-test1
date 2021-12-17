const Web3 = require("web3");
const Config =require("./config.js");

class frame {
    constructor() {
        this.web3 = null;
        this.contracts = {};
        this.handledEvents = {};
    }

    async initProvider()
    {
        try {
            /**
             * 直接连接配置的rpc地址做provider，而不是通过this.web3.setProvider更改Web3.givenProvider
             */
            this.web3 = await new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(Config.rpc_addr));

            // 检查chainID
            let networkId = await this.web3.eth.net.getId();
            if (networkId != Config.networkId) {
                console.error(`currentProvider chainID ${networkId} not same with setting ${Config.networkId}`);
            }

            this.xdebug("web3 version:", Web3.version);
            return true;
        } catch (e) {
            return false;
        }
    }

    async initContract() {
        let contractCfgList = Config.contractList;

        for (var k in contractCfgList) {
            let contractCfg = contractCfgList[k];
            this.contracts[k] = new this.web3.eth.Contract(
                contractCfg.abi,
                contractCfg.address,
            );
        }
    }

    /** 事件监听 */
    listen(listenerExports) {
        let _this = this;

        for (let contractName in listenerExports) {
            let events = listenerExports[contractName];
            for (let eventName in events) {
                let callback = events[eventName];
                
                _this.contracts[contractName]['events'][eventName]({}, function(error, event){
                    if (!error) {
                        _this.xdebug(`emit my event 【${eventName}】, eventValues:`, event.returnValues);
    
                        // 整合事件中的值
                        let eventValue = [];
                        while (true) {
                            if (event.returnValues[eventValue.length] != undefined) {
                                eventValue[eventValue.length] = event.returnValues[eventValue.length];
                            } else {
                                break;
                            }
                        }
                        
                        // 有回调函数时，要求触发事件的第一个参数必须是本用户，即合约执行人
                        if (callback ) {
                            callback(event.transactionHash, ...eventValue);
                        }
                    } else {
                        _this.xdebug(`event 【${eventName}】 exception!`, error);
                    }
                    
                });
                
            }
        }
    }

    /** debug模式 */
    xdebug(...args) {
        if (Config.xdebug)
            console.log(...args);
    }
}

module.exports = new frame();