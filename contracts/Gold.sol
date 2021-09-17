// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

/**
    挖矿获得的金币
 */
contract Gold is ERC20,Ownable {

    constructor() ERC20("FM gold","FMG") {
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