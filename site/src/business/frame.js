import Web3 from "web3";
import Config from "./config.js";
import ContractEvents from "./event.js";

class frame {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.contracts = {};
        this.handledEvents = {};
    }

    async init() {
        if (await this.initProvider()) {
            await this.initAccount();
            await this.initContract();
            await this.listen(ContractEvents);
            return true;
        }
        return false;
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

            // web3加入到全局变量，方便调试
            if (window.xdebug) {
                window.web3Debugger = this.web3;
            }
            this.xdebug("web3 version:", Web3.version);
            return true;
        } catch (e) {
            return false;
        }
    }

    async initAccount() {
        try {
          // 连接账号
          try {
            await ethereum.request({ method: 'eth_requestAccounts' });
          } catch (error) {
            console.error(error);
          }
    
          // 读取账号
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          this.account = accounts[0];

          this.xdebug("登录账号",accounts) // 受权成功后accounts能正常获取到帐号了
        } catch (error) {
          console.error("Could not connect to contract or chain.", error);
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

    /** 合约执行 */
    send(contractName, contractMethod, param) {
        if (!this.web3 && !this.init()) {
            return;
        }
        let _this = this;

        Helper.showLoading();
        
        this.contracts[contractName].methods[contractMethod](...param).send({
            from: _this.account
        }, (error,result)=>{
            let action = `【${contractName}->${contractMethod}】`;
            Helper.hideLoading();

            if (error) {
                if (error.code == 4001) {
                    _this.xdebug(action, "user denied"); // metamask拒绝签名
                } else {
                    console.error(action, error);
                }
            } else {
                _this.xdebug(`send ${action} completed`);
            }
        })
    }

    /** 合约调用 */
    call(contractName, contractMethod, param, callback) {
        if (!this.web3 && !this.init()) {
            return;
        }
        let _this = this;
        
        // 预估gas
        /*web3.eth.estimateGas({
            from: this.account,
            to: this.contracts[contractName]._address,
            data: this.contracts[contractName].methods[contractMethod](...param).encodeABI() 
        }, (error, gasLimit)=>{
            if (!error) {*/

        Helper.showLoading();

        // 合约调用
        _this.contracts[contractName].methods[contractMethod](...param).call({
            from: _this.account,
            // gas: _this.web3.toHex(Math.floor(gasLimit * 2)),
        }, (error, result)=>{
            let action = `【${contractName}->${contractMethod}】`;
            Helper.hideLoading();

            if (error) {
                console.error(action, error);
            } else {
                _this.xdebug(`call ${action} completed`, result);
                callback(result);
            }
        });
    }

    /** 事件监听 */
    listen(optionsArr) {
        let _this = this;
        for (let i=0; i< optionsArr.length; i++) {
            let contractName = optionsArr[i]['contract'];
            let eventName = optionsArr[i]['event'];
            let accountKey = optionsArr[i]['account_key'];
            let callback = optionsArr[i]['callback'];

            _this.contracts[contractName]['events'][eventName]({}, function(error, event){
                let eventKey = event.transactionHash + '.' + eventName;
                if (accountKey && 
                    _this.handledEvents[eventKey] == undefined &&
                    event.returnValues[accountKey].toLowerCase() == _this.account.toLowerCase()) 
                {
                    _this.xdebug(`emit my event 【${eventName}】, eventValues:`, event);

                    // 防止重复触发
                    _this.handledEvents[eventKey] = 1;

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
                        callback(...eventValue);
                    }
                }
            });
            _this.xdebug(`event 【${eventName}】 of ${_this.account} registered`);
        }
    }

    /** debug模式 */
    xdebug(...args) {
        if (window.xdebug)
            console.log(...args);
    }
}

export default new frame();