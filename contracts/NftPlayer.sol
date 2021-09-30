// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./Diamond.sol";

/** 球员卡/道具 */
contract NftPlayer is ERC721Upgradeable,OwnableUpgradeable {

    Diamond diamondInstance;

    //生成tokenID计数器
    uint256 private countor;
    //球员池
    uint32[] private playerPool;
    //生成 tokenId => player_id
    mapping(uint256 => uint32) public cardDB;
    //生成球员的tokens
    mapping(address => uint256[]) private tokenDB;


    function initialize(Diamond _diamondInstance) public initializer {
        __ERC721_init("FM Token Card", "FMC");
        diamondInstance = _diamondInstance;
        playerPool = [2080103,15802303,17658003,16749503,19087103,18854503,18327703,19298503,19308003,18252103];
    }

    /** 设置球员池 */
    function setPlayerPool(uint32[] memory) public onlyOwner {}

    /** 读取球员池 */
    function getPlayerPool() public view returns (uint32[] memory) {
        uint32[] memory pool = new uint32[](playerPool.length);
        return pool;
    }

    /** 抽卡 */
    function createCard() public payable {
        uint256 cost = 1;
        require(
            diamondInstance.balanceOf(msg.sender) >= cost,
            "balance < required"
        );
        diamondInstance.transferFrom(msg.sender, address(diamondInstance), cost);

        uint256 _tokenId = ++countor;

        //随机卡片
        uint32 _index = rand(playerPool.length);
        uint32 _player_id = playerPool[_index];
        cardDB[_tokenId] = _player_id;

        //记录我的token
        address _addr = msg.sender;
        tokenDB[_addr].push(_tokenId);

        super._mint(msg.sender, _tokenId);
        emit createCardEvent(_tokenId, _player_id);
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

    event createCardEvent(uint256 token, uint32 player_id);
}