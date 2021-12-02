# sol-test1

一、ganache-cli
安装：npm install -y ganache-cli
运行：ganache-cli -p 9545 -l 40000000 -i 9999 --account="0xced31424da8dc9483838794526f408f0ff1b68e1474d3ab356d3a144d6b79ad3,100000000000000000000"
运行参数
-p //设置端口
-i //设置network_id
-l //gas上限
--account=“privateKey,xxWei” //初始账户的私钥的初始余额(wei)

ganache windows客户端
下载地址：https://www.trufflesuite.com/ganache

二、部署
truffle migrate --f 2  //从第二个部署文件强制部署

三、客户端打包
cd app
webpack

四、bootstrap框架文档
https://yanxiaojun617.gitbook.io/webpack4-bootstrap4-demo/