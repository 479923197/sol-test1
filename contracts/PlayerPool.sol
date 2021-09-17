// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.0;

contract PlayerPool {

    /** 球员池项目 */
    struct playerPoolItem {
        uint player_id;
        string player_name;
        uint[6] attr; 
    }

    /** 球员池 */
    playerPoolItem[] private playerPool = [
        playerPoolItem({1, "梅西", uint[]([97,98,99,122,79,96])}),
        playerPoolItem({2, "C罗", uint[]([97,98,99,122,79,96])}),
        playerPoolItem({3, "内马尔", uint[]([97,98,99,122,79,96])}),
    ];

    //获取球员池
    function getPlayerPool() view returns (playerPoolItem[]) {
        return playerPool;
    }

    /** 随机一个球员 */
    function randItem() view returns (playerPoolItem) {
        uint256 index = rand(getPlayerPool().length()-1);
        return playerPool[index];
    }

    function rand(uint256 _length) public view returns(uint256) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, now)));
        return random%_length;
    }
}