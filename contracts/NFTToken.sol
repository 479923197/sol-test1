// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";


/** 球员卡 */
contract NFTToken is ERC721{

    constructor() ERC721("FM Token", "FMT") {}

    function say() public pure returns (string memory) {
        return "hello";
    }
}