import Web3 from "web3";
import Config from "./config.js";

class frame {

    account = null;
    nft = null;
    diamond = null;
    stake = null;
    market = null;

    constructor()
    {
        window.web3 = new Web3(window.web3.currentProvider||new Web3.providers.WebsocketProvider( Config.rpc_addr ));

        this.debug("web3 version:", web3.version);
        this.debug("web3 givenProvider:", Web3.givenProvider);
        this.debug("web3 currentProvider:", window.ethereum);
    }

    async initAccount() {
        try {
          //连接账号
          try {
            await ethereum.request({ method: 'eth_requestAccounts' });
          } catch (error) {
            console.error(error);
          }
    
          //读取账号
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          this.account = accounts[0];

          this.debug("登录账号",accounts)//受权成功后accounts能正常获取到帐号了
          document.getElementsByClassName("account")[0].innerHTML = accounts[0];
        } catch (error) {
          console.error("Could not connect to contract or chain.", error);
        }
    }

    async initContract() {
        this.nft = new web3.eth.Contract(
            Config.contract_nft.abi,
            Config.contract_nft.address,
          );
          this.diamond = new web3.eth.Contract(
            Config.contract_diamond.abi,
            Config.contract_diamond.address,
          );
          this.stake = new web3.eth.Contract(
            Config.contract_stake.abi,
            Config.contract_stake.address,
          );
          this.market = new web3.eth.Contract(
            Config.contract_market.abi,
            Config.contract_market.address,
          );

          this.debug("market instance:", this.market);
    }

    /** 合约执行 */
    send(contractName, contractMethod, param, eventName, callback) {
        if (eventName) {
            this[contractName].once(eventName, {}, function(error, event){ 
                if (error)
                  console.error(`watch event:${eventName} error`, error);
                else {
                    //整合事件中的值
                    let eventValue = [];
                    while (true) {
                        if (event.returnValues && event.returnValues[eventValue.length] != undefined) {
                            eventValue[eventValue.length] = event.returnValues[eventValue.length];
                        } else {
                            break;
                        }
                    }
                    this.debug(`emit event ${eventName}`, event.returnValues);
                    if (callback) {
                        callback(...eventValue);
                    }
                }
            });
        }

        this[contractName].methods[contractMethod](...param).send({
            from: this.account
        }, (error,result)=>{
            let action = contractName + "." + contractMethod;

            if (error) {
                if (error.code == 4001) {
                    this.debug(action, "user denied"); //metamask拒绝签名
                } else {
                    console.error(action, error);
                }
            } else {
                this.debug(`${action} completed`);
            }
        })
    }

    /** 合约调用 */
    call(contractName, contractMethod, param, callback) {
        this[contractName].methods[contractMethod](...param).call({
            from: this.account
        }, (error, result)=>{
            let action = contractName + "." + contractMethod;

            if (error) {
                console.error(action, error);
            } else {
                this.debug(`${action} completed`);
                callback(result);
            }
        })
    }

    /** debug模式 */
    debug(...args) {
        if (window.debug)
            this.debug(...args);
    }
}

export default new frame();