pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract nftToken is ERC721{
    constructor(string memory _name, string memory _symbol) public ERC721(_name, _symbol) {
        //super.constr
    }
}