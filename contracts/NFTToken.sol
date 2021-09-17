// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "PlayerPool.sol";


/** 球员卡 */
contract NFTToken is ERC721{

    public PlayerPool pl;

    struct card {
        uint player_id;
        //战术类型
        uint8 tactical;
        //属性
        uint[6] attr; 
    }

    mapping(uint256 => card) public cardDB;

    constructor() ERC721("FM Token Card", "FMC") {}

    /** 抽卡 */
    function createCard() public payable returns (card) {
        uint256 _tokenId = totalSupply();

        playerPoolItem itemCfg = pl.randItem();
        card _card = card({
            itemCfg.player_id,
            randTactical(),
            itemCfg.attr
        });
        cardDB[_tokenId] = _card;

        super._mint(msg.sender, _tokenId);
    }

    /** 获取我的所有卡 */
    function getMyCards(address _addr) view returns (card[]) {
        uint256[] _tokens = ownedTokens[_addr];

        card[] ret;
        for (uint i=0; i<_tokens.length(); i++) {
            ret.push(cardDB[ _tokens[i] ]);
        }
        return ret;
    } 

    /** 随机战术类型 */
    function randTactical() pure returns (uint8) {
        uint8 r = rand(3);
        return r;
    }

    function rand(uint256 _length) public view returns(uint256) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, now)));
        return random%_length;
    }
  }
}