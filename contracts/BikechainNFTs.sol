//SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Bikechain.sol";

contract BikechainNFTs is ERC721URIStorage, Ownable {
    constructor() ERC721("BikechainNFTs", "BCNFTs") Ownable(msg.sender) {}

    mapping(uint => address) idToAddress;

    uint public ntfIdsCounter;

    function createNFT(
        address _to,
        string memory tokenURI
    ) public onlyOwner {
        _safeMint(_to, ntfIdsCounter);
        _setTokenURI(ntfIdsCounter, tokenURI);
        idToAddress[ntfIdsCounter] = _to;
        ntfIdsCounter++;
    }
}
