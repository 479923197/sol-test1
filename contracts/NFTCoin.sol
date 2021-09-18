// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

/**
    买卡需要的币1：1:1抽卡
 */
contract NFTCoin is ERC20,Ownable {

    constructor() ERC20("FM coin","FMC") {
        //初始个数
        super._mint(msg.sender, 10000);
    }

    /** 管理员生成金币 */
    function mint(uint256 amount) public onlyOwner {
        super._mint(owner(), amount);
    }

    //精度
    function decimals() public override pure returns (uint8) {
        return 0;
    }
}