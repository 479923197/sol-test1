// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./NftHero.sol";
import "./Gold.sol";

/** NFT质押 */
contract Stake is OwnableUpgradeable {

    Gold goldInstance;
    NftHero nftHeroInst;

    //nft质押时间
    mapping(uint256 => uint256) tokenStaketime;
    //nft质押人
    mapping(address => uint256) userToken;

    function initialize(Gold _gold, NftHero _NftHero) public initializer {
        goldInstance = _gold;
        nftHeroInst = _NftHero;
    }

    /** 质押 */
    function stakeHero(uint256 _token) public {
        require(nftHeroInst.ownerOf(_token) == _msgSender(), "That is not your token");
        nftHeroInst.safeTransferFrom(_msgSender(), address(this), _token);
        
    }

    /** 查看所有质押物品 */
    function reviewStaked() public view returns (uint256[] memory _tokens, uint256[] memory _award) {

    }

    /** 取回奖励 */
    function earn(uint256 _token) public returns (uint256 _goldNum) {
        require(tokenStaketime[_token] > 0);

        uint256 ontime = block.timestamp - tokenStaketime[_token];
        _goldNum = ontime * 10 ;

        tokenStaketime[_token] = block.timestamp;
    }

    /** 取回 */
    function unstake(uint256 _token) public {

    }

    event onStake(uint256 _token);
}