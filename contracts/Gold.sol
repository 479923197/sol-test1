// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
    挖矿获得的金币
 */
contract Gold is ERC20 {

    constructor() ERC20("FM gold","FMG") {}
}