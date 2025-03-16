from scripts.helpful_scripts import get_account, OPENSEA_URL, nft_type_mapping, update_frontend
from brownie import BikechainNFTs
from scripts.create_metadata import create_metadata


def deploy_bikechain_nfts():
    account = get_account()
    bikechainNFTs = BikechainNFTs.deploy({"from": account})
    update_frontend()
    print(f"Deployed contract at {bikechainNFTs.address}")


def create_nft(type):
    # Type: 0 - FIRST_ACTIVITY
    account = get_account()
    if len(BikechainNFTs) < 1:
        bikechainNFTs = BikechainNFTs.deploy({"from": account})
    else:
        bikechainNFTs = BikechainNFTs[-1]
    token_uri = create_metadata()
    print(f"token_uri: ", token_uri)
    create_nft_tx = bikechainNFTs.createNFT(
        account, token_uri, type, {"from": account}
    )
    create_nft_tx.wait(1)
    print(
        f"NFT Created {OPENSEA_URL.format(bikechainNFTs.address,bikechainNFTs.ntfIdsCounter() -1 )} type {nft_type_mapping[type]}"
    )


def main():
    deploy_bikechain_nfts()
