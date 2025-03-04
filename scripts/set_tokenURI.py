from brownie import BikechainNFTs
from scripts.helpful_scripts import nft_type_mapping

NFT_IPFS_URL = {
    "FIRST_ACTIVITY": "https://ipfs.io/ipfs/bafybeiev6dob2iyvqph2enksp7cs2uz3qptibx5s7symrwadbtwdb24me4"
}

def set_token_uri(type):
    token_uri  = NFT_IPFS_URL[type]
    return token_uri

