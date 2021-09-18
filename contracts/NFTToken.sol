// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";


/** 球员卡 */
contract NFTToken is ERC721,Ownable {

    //生成tokenID计数器
    uint256 private countor = 0;

    //球员池
    uint32[] private playerPool;

    //生成 tokenId => player_id
    mapping(uint256 => uint32) public cardDB;
    //生成球员的tokens
    mapping(address => uint256[]) private tokenDB;


    constructor() ERC721("FM Token Card", "FMC") {
        playerPool = [2080103,15802303,17658003,16749503,19087103,18854503,18327703,19298503,19308003,18252103];
    }

    /** 设置球员池 */
    function setPlayerPool(uint32[] memory) public onlyOwner {}

    /** 抽卡 */
    function createCard() public returns (uint256, uint32) {
        uint256 _tokenId = ++countor;

        //随机卡片
        uint32 _index = rand(playerPool.length);
        uint32 _player_id = playerPool[_index];
        cardDB[_tokenId] = _player_id;

        //记录我的token
        address _addr = msg.sender;
        tokenDB[_addr].push(_tokenId);

        super._mint(msg.sender, _tokenId);
        return (_tokenId, _player_id);
    }

    /** 获取我的所有卡 */
    function getMyCards(address _addr) public view returns ( uint256[] memory, uint32[] memory) {
        uint256[] memory _tokens = tokenDB[_addr];
        uint32[] memory _player_ids = new uint32[](_tokens.length);

        if (_tokens.length > 0) {
            for (uint i=0; i<_tokens.length; i++) {
                uint256 _tokenId = _tokens[i];
                uint32  _player_id = cardDB[ _tokenId ];
                _player_ids[i] = _player_id;
            }
        }

        return (_tokens, _player_ids);
    }

    function rand(uint256 _length) private view returns(uint32) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
        return uint32(random % _length);
    }
}