// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
    钻石-抽取盲盒
 */
contract Diamond is ERC20Upgradeable,OwnableUpgradeable {

    function initialize() public initializer {
        __ERC20_init("Tamer Token","TMT");
        __Ownable_init();
        
        //初始个数
        super._mint(msg.sender, 10000* 1e18);
    }

    /** 管理员生成金币 */
    function mint(uint256 amount) public onlyOwner {
        super._mint(owner(), amount);
    }

    //精度
    function decimals() public override pure returns (uint8) {
        return 18;
    }
}