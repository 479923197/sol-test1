// SPDX-License-Identifier: MIT
// https://github.com/crazyrabbitLTC/NFT-staking-boiler/blob/main/contracts/NftStake.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./NftHero.sol";
import "./Diamond.sol";

/** nft市场 */
contract Marketplace is IERC721ReceiverUpgradeable,OwnableUpgradeable,PausableUpgradeable {
    using SafeMathUpgradeable for uint256;

    Diamond diamondInstance;
    NftHero nftHeroInst;

    //商品信息
    struct product {
        uint256 tokenId;
        uint256 price;
        address owner;
    }
    mapping(uint256 => product) public receipt;
    //用户质押的tokens，仅用于查询
    mapping(address => uint256[]) userTokens;
    //动态参数
    //launch_rate 上架佣金百分比0为免佣
    mapping(string => uint256) params;

    /** 必须：已质押token的原属认证 */
    modifier onlyStaker(uint256 tokenId) {
        //token已被质押到本合约
        require(nftHeroInst.ownerOf(tokenId) == address(this), "onlyStaker: Contract is not owner of this NFT");
        //票据中有记录
        require(receipt[tokenId].price != 0, "onlyStaker: Token is not launch");
        //票据中记录的为当前用户
        require(receipt[tokenId].owner == msg.sender, "onlyStaker: Caller is not NFT owner");
        _;
    }

    function initialize(address _diamond, address _NftHero) public initializer {
        __Ownable_init();
        __Pausable_init();
        
        diamondInstance = Diamond(_diamond);
        nftHeroInst = NftHero(_NftHero);
        params["fee_percent"] = 5; //上架收取手续费百分比 5%
        params["min_price"] = uint256(0.001 * 1e18); //最低价格
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

    /** 上架 */
    function createProduct(uint256 tokenId, uint256 _price) public {
        //token尚未上架到本合约
        require(nftHeroInst.ownerOf(tokenId) != address(this), "create failed: launched already");
        //票据中没有记录
        require(receipt[tokenId].price == 0, "create failed: tokenid launched already");
        //价格不能太低
        require(_price > params["min_price"], "price 0.001 at least");

        //转账上架手续费
        uint256 fee = uint256(params["fee_percent"] * _price / 100);
        //手续费不能为0
        require(fee > 0, "fee must > 0");
        //手续费不能高于价格
        require(fee < _price, "fee must be less than price");
        //查询授权
        require(diamondInstance.allowance(msg.sender, address(this))  <= fee, "allowance not enough");
        require(nftHeroInst.getApproved(tokenId) == address(this), "nft should approved to contract");
        
        diamondInstance.transferFrom(msg.sender, address(this), fee);
        //转账NFT
        nftHeroInst.safeTransferFrom(msg.sender, address(this), tokenId); 
        require(nftHeroInst.ownerOf(tokenId) == address(this), "create failed: nft belongs this contract already");

        //记录
        receipt[tokenId].tokenId = tokenId;
        receipt[tokenId].owner = msg.sender;
        receipt[tokenId].price = _price;

        //该用户质押的tokens中加入该token
        userTokens[msg.sender].push(tokenId);

        emit onCreateProduct(msg.sender, tokenId, _price);
    }

    /** 查看我的在售物品 */
    function reviewMyProducts() public view returns (uint256[] memory _tokens, uint256[] memory _prices) {
        if (userTokens[msg.sender].length < 1) {
            return (_tokens, _prices);
        }

        uint256 _tokenId;
        _prices = new uint256[](userTokens[msg.sender].length);
        for (uint i=0; i<userTokens[msg.sender].length; i++) {
            _tokenId = userTokens[msg.sender][i];
            _prices[i] = receipt[_tokenId].price;
        }
        return (userTokens[msg.sender], _prices);
    }


    /** 取回 */
    function withdrawProduct(uint256 tokenId) public onlyStaker(tokenId) {
        //清理数据
        delete receipt[tokenId];
        //退卡
        nftHeroInst.safeTransferFrom(address(this), msg.sender, tokenId);
        emit onNftWithdraw(msg.sender, tokenId);

        //该用户质押的tokens中去掉该token
        userTokens[msg.sender] = _arrRemove(userTokens[msg.sender], tokenId);
    }

    /** 购买 */
    function buy(uint256 tokenId) public {
        require(receipt[tokenId].price > 0, "goods not exists");

        product memory item = receipt[tokenId];
        require(item.owner != msg.sender, "cannt by owned item");
        require(diamondInstance.allowance(msg.sender, address(this)) > item.price, "not enough allowance");

        //付款给玩家
        diamondInstance.transferFrom(msg.sender, item.owner, item.price);
        //获得卡片
        nftHeroInst.safeTransferFrom(address(this), msg.sender, tokenId);

        //事件
        emit onBuy(msg.sender, receipt[tokenId].owner, tokenId, receipt[tokenId].price);
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

    event onCreateProduct(address indexed staker, uint256 tokenId, uint256 price);
    event onNftWithdraw(address indexed staker, uint256 tokenId);
    event onBuy(address indexed comsumer, address indexed staker, uint256 tokenId, uint256 price);
}