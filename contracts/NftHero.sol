// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./Diamond.sol";
import "./lib/HeroPool.sol";

/** 球员卡/道具 */
contract NftHero is ERC721Upgradeable,OwnableUpgradeable {

    Diamond diamondInstance;
    HeroPool heroPoolInstance;

    //随机数种子
    uint256 totalRandTimes;
    //生成tokenID计数器
    uint256 private countor;
    //卡片id,类型
    mapping(uint => uint) herosType;
    //卡片信息
    struct HeroInfo {
        uint id;
        uint li; //力量
        uint min; //敏捷
        uint zhi; //智力
        uint lv; //等级
    }
    //球员池
    //生成 tokenId => HeroInfo
    mapping(uint256 => HeroInfo) public cardDB;
    //用户 => 生成球员的tokens
    mapping(address => uint256[]) private tokenDB;
    //用户随机英雄的次数、
    mapping(address => uint) private userRandtimes;


    function initialize(Diamond _diamondInstance, HeroPool _heroPoolInstance) public initializer {
        __ERC721_init("FM Token Card", "FMC");
        __Ownable_init();
        
        diamondInstance = _diamondInstance;
        heroPoolInstance = _heroPoolInstance;

        herosType[1] = 1;
        herosType[2] = 1;
        herosType[3] = 1;
        herosType[4] = 1;
        herosType[5] = 2;
        herosType[6] = 2;
        herosType[7] = 2;
        herosType[8] = 2;
        herosType[9] = 3;
        herosType[10] = 3;
        herosType[11] = 3;
        herosType[12] = 3;
    }

    function setHeroPool( HeroPool _heroPoolInstance) public onlyOwner {
        heroPoolInstance = _heroPoolInstance;
    }

    /** 抽卡 */
    function createCard() public payable {
        uint256 cost = 1 * 1e8;
        require(
            diamondInstance.balanceOf(msg.sender) >= cost,
            "balance < required"
        );
        diamondInstance.transferFrom(msg.sender, address(diamondInstance), cost);

        uint256 _tokenId = ++countor;

        //随机卡片
        uint id; uint li; uint min; uint zhi;
        (id,li,min,zhi) = heroPoolInstance.rand(++totalRandTimes,  ++userRandtimes[_msgSender()]);
        cardDB[_tokenId] = HeroInfo(id,li,min,zhi,1);

        //mint会触发_beforeTokenTransfer
        super._mint(msg.sender, _tokenId);
        emit createCardEvent(_tokenId, id,li,min,zhi);
    }

    /** 获取我的所有卡 */
    function getMyCards(address _addr) public view returns ( uint256[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory) {
        uint256[] memory _tokens = tokenDB[_addr];
        uint[] memory _hero_ids = new uint[](_tokens.length);
        uint[] memory _li = new uint[](_tokens.length);
        uint[] memory _min = new uint[](_tokens.length);
        uint[] memory _zhi = new uint[](_tokens.length);
        uint[] memory _lv = new uint[](_tokens.length);

        if (_tokens.length > 0) {
            for (uint i=0; i<_tokens.length; i++) {
                uint256 _tokenId = _tokens[i];
                _hero_ids[i] = cardDB[ _tokenId ].id;
                _li[i] = cardDB[ _tokenId ].li;
                _min[i] = cardDB[ _tokenId ].min;
                _zhi[i] = cardDB[ _tokenId ].zhi;
                _lv[i] = cardDB[ _tokenId ].lv;
            }
        }

        return (_tokens, _hero_ids, _li, _min, _zhi, _lv);
    }

    //删除token
    function burn(uint256 tokenId) public onlyOwner {
        address tokenOwner = ownerOf(tokenId);

        //删除指定tokenId
        uint256[] memory newUserTokens = new uint256[](tokenDB[tokenOwner].length - 1);
        uint256 realLen;

        for (uint i=0; i<tokenDB[tokenOwner].length; i++) {
            if (tokenDB[tokenOwner][i] != tokenId) {
                newUserTokens[realLen] = tokenDB[tokenOwner][i];
            }
            realLen ++;
        }
        require(realLen == tokenDB[tokenOwner].length - 1);
        tokenDB[tokenOwner] = newUserTokens;

        //燃烧
        _burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        if (to != address(0)) {
            //录入我的token
            tokenDB[_msgSender()].push(tokenId);
        } else {
            delete cardDB[tokenId];
        }
        
        emit transferCardEvent(from, to, tokenId);
    }
/*
    //随机卡片
    function _randHero(uint times) private returns(uint id, uint li, uint min, uint zhi) {
        uint overTimes = times - 1;

totalRandTimes++;
        id = rand(1, 12); //hero id
        uint attr_main; //主属性
        uint attr_side_min;  //次属性的最小值
        uint attr_side1;
        uint attr_side2;

totalRandTimes++;
        if (overTimes == 0) {
            attr_main = rand(80, 100);
        } else if (overTimes % 5 == 0) {
            attr_main = rand(70, 99);
        } else {
            attr_main = rand(65, 94);
        }

totalRandTimes++;
        attr_side_min = rand(10, 64);
totalRandTimes++;
        attr_side1 = rand(attr_side_min, attr_main);
totalRandTimes++;
        attr_side2 = rand(attr_side_min, attr_main);

        if (herosType[id] == 1) {
            li = attr_main;
            min = attr_side1;
            zhi = attr_side2;
        } else if (herosType[id] == 2) {
            li = attr_side1;
            min = attr_side2;
            zhi = attr_main;
        } else {
            li = attr_side1;
            min = attr_side2;
            zhi = attr_main;
        }
        return (id, li, zhi, min);
    }
*/
    function rand(uint256 _min,uint256 _max) private view returns(uint256) {
        require(_max > _min);
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp+ totalRandTimes)));
        return uint256(random % (_max-_min)) + _min;
    }

    event createCardEvent(uint256 token, uint hero_id, uint li, uint min, uint zhi);
    event transferCardEvent(address from, address to, uint256 tokenId);
}