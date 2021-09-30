// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
    金币-用于游戏内产出/消耗的货币
 */
contract Gold is ERC20Upgradeable,OwnableUpgradeable {

    function initialize() public initializer {
        __ERC20_init("FM gold","FMG");

        //初始个数
        super._mint(msg.sender, 10000000);
    }

    /** 管理员生成金币 */
    function mint(uint256 amount) public onlyOwner {
        super._mint(owner(), amount);
    }

    //精度
    function decimals() public pure override returns (uint8) {
        return 0;
    }
}