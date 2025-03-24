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
    mapping(uint => string) idToImageUrl;

    enum NFTType {
        FIRST_ACTIVITY
    }

    uint public ntfIdsCounter;

    function createNFT(
        address _to,
        string memory tokenURI, uint _type, string memory _imageURL
    ) public {
        _safeMint(_to, ntfIdsCounter);
        _setTokenURI(ntfIdsCounter, tokenURI);
        idToAddress[ntfIdsCounter] = _to;
        idToType[ntfIdsCounter] = _type;
        idToImageUrl[ntfIdsCounter] = _imageURL;
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

    function retrieveNFTUrl(uint _id) public view returns(string memory) {
        return idToImageUrl[_id];
    }

    function retrieveOwnerNFTIdsArray() public view returns(uint[] memory) {
        require(ntfIdsCounter > 0, "No NFT created");
        uint counter;
        uint[] memory ownerNFTIdsArray = new uint[](ownerNFTCount[msg.sender]);
        for(uint i = 0; i < ntfIdsCounter ; i++) {
            if(idToAddress[i] == msg.sender){
                ownerNFTIdsArray[counter] = i;
                counter++;
            }
        }
        return ownerNFTIdsArray;
    }

    // Crear funcion para modificar el url de un nft

    function changeNFTUrl(string memory _newImageURL, uint _id) public onlyOwner() {
        idToImageUrl[_id] = _newImageURL;
    }
}
