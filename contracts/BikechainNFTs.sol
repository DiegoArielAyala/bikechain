//SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Bikechain.sol";

contract BikechainNFTs is ERC721URIStorage, Ownable {
    constructor() ERC721("BikechainNFTs", "BCNFTs") Ownable(msg.sender) {}

    mapping(uint => address) idToAddress;
    mapping(uint => uint) idToType;
    mapping(address => uint) ownerNFTCount;

    enum NFTType {
        FIRST_ACTIVITY
    }

    uint public ntfIdsCounter;

    function createNFT(
        address _to,
        string memory tokenURI, uint _type
    ) public {
        _safeMint(_to, ntfIdsCounter);
        _setTokenURI(ntfIdsCounter, tokenURI);
        idToAddress[ntfIdsCounter] = _to;
        idToType[ntfIdsCounter] = _type;
        ntfIdsCounter++;
        ownerNFTCount[msg.sender]++;
    }

    function getTokenIdType(uint _id) view public returns(uint){
        return idToType[_id];
    }

    function getTokenIdOwner(uint _id) view public returns(address) {
        return idToAddress[_id];
    }

    function retrieveNFTIdsCounter() public view returns(uint){
        return ntfIdsCounter;
    }

    function retrieveOwnerNFTCount(address _address) public view returns(uint){
        return ownerNFTCount[_address];
    }
}
