const frame = require("../business/frame.js");
const nftEvents = require("./nft.js");
const diamondEvents = require("./diamond.js");
const stakeEvents = require("./stake.js");
const marketEvents = require("./market.js");

//监听事件
module.exports = async () => {
	await frame.initProvider();
	await frame.initContract();

	frame.listen(nftEvents);
    frame.listen(diamondEvents);
	frame.listen(stakeEvents);
	frame.listen(marketEvents);
};