# sol-test1

一、ganache
安装：npm install -y ganache-cli
运行：ganache-cli -p 9545 -l 40000000
其他运行参数
-i num  //设置network_id

二、部署
truffle migrate --f 2  //从第二个部署文件强制部署

三、客户端打包
cd app
webpack