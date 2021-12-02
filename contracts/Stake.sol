// SPDX-License-Identifier: MIT
// https://github.com/crazyrabbitLTC/NFT-staking-boiler/blob/main/contracts/NftStake.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./NftHero.sol";
import "./Gold.sol";

/** NFT质押 */
contract Stake is IERC721ReceiverUpgradeable,OwnableUpgradeable,PausableUpgradeable {
    using SafeMathUpgradeable for uint256;

    Gold goldInstance;
    NftHero nftHeroInst;

    //质押票据信息
    struct stake {
        uint256 tokenId;
        uint256 stakedFromBlock;
        address owner;
        uint256 blockBonus;
    }
    mapping(uint256 => stake) public receipt;
    //用户质押的tokens，仅用于查询
    mapping(address => uint256[]) userTokens;
    //动态参数
    //bonus_rate 红利提出百分比100为全额
    mapping(string => uint256) params;

    /** 必须：已质押token的原属认证 */
    modifier onlyStaker(uint256 tokenId) {
        //token已被质押到本合约
        require(nftHeroInst.ownerOf(tokenId) == address(this), "onlyStaker: Contract is not owner of this NFT");
        //票据中有记录
        require(receipt[tokenId].stakedFromBlock != 0, "onlyStaker: Token is not staked");
        //票据中记录的为当前用户
        require(receipt[tokenId].owner == msg.sender, "onlyStaker: Caller is not NFT stake owner");
        _;
    }

    /** 必须：已质押token可计算红利 */
    modifier requireTimeElapsed(uint256 tokenId) {
        require(
            receipt[tokenId].stakedFromBlock < block.number,
            "requireTimeElapsed: Can not stake/unStake/harvest in same block"
        );
        _;
    }

    function initialize(address _gold, address _NftHero) public initializer {
        __Ownable_init();
        __Pausable_init();
        
        goldInstance = Gold(_gold);
        nftHeroInst = NftHero(_NftHero);
        params["bonus_rate"] = 1;
        params["base_block_bonus"] = uint256(0.01 * 1e18);
        params["attr_block_bonus"] = uint256(0.005 * 1e18);
    }

    function setNftHeroInst(address _NftHero) public onlyOwner {
        nftHeroInst = NftHero(_NftHero);
    }

    function setParam(string memory _name, uint256 _value) public onlyOwner {
        params[_name] = _value;
    }

    function getParam(string memory _name) public view returns (uint256) {
        return params[_name];
    }

    /** 合约当前拥有的金币数 */
    function getStakeContractBalance() public view returns (uint256) {
        return goldInstance.balanceOf(address(this));
    }

    /** 质押 */
    function stakeNFT(uint256 tokenId) public {
        //token尚未质押到本合约
        require(nftHeroInst.ownerOf(tokenId) != address(this), "stake failed: staked already");
        //票据中没有记录
        require(receipt[tokenId].stakedFromBlock == 0, "stake failed: tokenid staked already");

        //转账
        nftHeroInst.safeTransferFrom(msg.sender, address(this), tokenId); 
        require(nftHeroInst.ownerOf(tokenId) == address(this), "stake failed: nft belongs this contract already");

        //记录
        receipt[tokenId].tokenId = tokenId;
        receipt[tokenId].stakedFromBlock = block.number;
        receipt[tokenId].owner = msg.sender;
        receipt[tokenId].blockBonus = _getBlockBonus(tokenId);

        //该用户质押的tokens中加入该token
        userTokens[msg.sender].push(tokenId);

        emit onNftStake(msg.sender, tokenId, block.number);
    }

    /** 发放质押红利 */
    function _payoutStake(uint256 tokenId) internal {
        uint256 payout = _calcBonus(tokenId);

        //发放
        if (goldInstance.balanceOf(address(this)) < payout) {
            emit StakePayout(msg.sender, tokenId, 0, receipt[tokenId].stakedFromBlock, block.number);
            return;
        }

        // payout stake
        goldInstance.transfer(receipt[tokenId].owner, payout);

        emit StakePayout(msg.sender, tokenId, payout, receipt[tokenId].stakedFromBlock, block.number);
    }

    /** 计算奖励 */
    function _calcBonus(uint256 tokenId) private view returns (uint256) {
        require(receipt[tokenId].stakedFromBlock > 0, "_payoutStake: Can not stake from block 0");

        uint256 blockStaked = _getBlockStaked(tokenId).sub(1); //当前区块不算
        uint256 payout = blockStaked.mul(receipt[tokenId].blockBonus);
        return payout;
    }

    /** 查看所有质押物品 */
    function reviewStaked() public view returns (uint256[] memory _tokens, uint256[] memory _award) {
        if (userTokens[msg.sender].length < 1) {
            return (_tokens, _award);
        }

        uint256 _tokenId;
        _award = new uint256[](userTokens[msg.sender].length);
        for (uint i=0; i<userTokens[msg.sender].length; i++) {
            _tokenId = userTokens[msg.sender][i];
            _award[i] = _calcBonus(_tokenId);
        }
        return (userTokens[msg.sender], _award);
    }


    /** 取回 */
    function unstake(uint256 tokenId) public onlyStaker(tokenId) requireTimeElapsed(tokenId) {
        //分红
        _payoutStake(tokenId);
        //清理数据
        delete receipt[tokenId];
        //退卡
        nftHeroInst.safeTransferFrom(address(this), msg.sender, tokenId);
        emit onNftUnStaked(msg.sender, tokenId, block.number);

        //该用户质押的tokens中去掉该token
        userTokens[msg.sender] = _arrRemove(userTokens[msg.sender], tokenId);
    }

    /** 领奖 */
    function harvest(uint256 tokenId) public onlyStaker(tokenId) requireTimeElapsed(tokenId) {
        //分红
        _payoutStake(tokenId);
        //重算时间
        receipt[tokenId].stakedFromBlock = block.number;
    }

    /** 获取卡牌的质押效率（每区块工作报酬） */
    function _getBlockBonus(uint256 tokenId) private view returns (uint256) {
        uint256 id; uint256 _type; uint256 li; uint256 min; uint256 zhi; uint lv;
        (id,_type,li,min,zhi,lv) = nftHeroInst.getAttr(tokenId);

        uint256 mainAttr;
        if (_type == 1) {
            mainAttr = li;
        } else if (_type == 2) {
            mainAttr = min;
        } else {
            mainAttr = zhi;
        }

        //没区块奖励：0.01 + （主属性-85）*0.005*等级
        uint256 blockBonus = params["base_block_bonus"];
        if (mainAttr > 85) {
            blockBonus += uint256((mainAttr - 85) * params["attr_block_bonus"] * lv);
        }
        return blockBonus;
    }

    /** 质押后生成的区块数 */
    function _getBlockStaked(uint256 tokenId) internal view returns (uint256) {
        if (receipt[tokenId].stakedFromBlock == 0) {
            return 0;
        }

        return block.number.sub(receipt[tokenId].stakedFromBlock);
    }

    /** 数组中删除某个元素（该元素确定存在且唯一） */
    function _arrRemove(uint256[] memory arr, uint256 one) private pure returns (uint256[] memory) {
        require(arr.length >= 1, "_arrRemove from []");

        uint256[] memory ret = new uint256[](arr.length - 1);

        //长度为0表示空数组
        if (arr.length > 1) {
            uint k;
            for (uint i; i<arr.length; i++) {
                if (arr[i] != one) {
                    ret[k] = arr[i];
                    k++;
                }
            }
        }
        return ret;
    } 

    /**
     * Always returns `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    event onNftStake(address indexed staker, uint256 tokenId, uint256 blockNumber);
    event onNftUnStaked(address indexed staker, uint256 tokenId, uint256 blockNumber);
    event StakePayout(address indexed staker, uint256 tokenId, uint256 stakeAmount, uint256 fromBlock, uint256 toBlock);
}