from brownie import BikechainNFTs
from scripts.helpful_scripts import nft_type_mapping

NFT_IPFS_URL = {
    "FIRST_ACTIVITY": "https://ipfs.io/ipfs/QmYmsKFN9p9bKzHEHAr7asn2Sv1FamSiNkBR2N1teMyozt?filename=first_activity.webp"
}

def set_token_uri(type):
    token_uri  = NFT_IPFS_URL[type]
    return token_uri

