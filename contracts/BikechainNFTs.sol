//SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Bikechain.sol";

contract BikechainNFTs is ERC721, Ownable {
    constructor() ERC721("BikechainNFTs", "BCNFTs") Ownable(msg.sender) {}

    mapping(uint => address) idToAddress;

    uint ntfIdsCounter;

    function _createNFT(
        address _to,
        string memory tokenURI
    ) internal onlyOwner {
        _safeMint(_to, ntfIdsCounter);
        // tokenURI(ntfIdsCounter);
        idToAddress[ntfIdsCounter] = _to;
        ntfIdsCounter++;
    }
}
