from scripts.helpful_scripts import get_account
from brownie import BikechainNFTs
from scripts.set_tokenURI import set_token_uri


def deploy_bikechain_nfts():
    account = get_account()
    bikechainNFTs = BikechainNFTs.deploy({"from": account})
    print(f"Deployed contract at {bikechainNFTs.address}")


def create_nft(type):
    account = get_account()
    if len(BikechainNFTs) < 1:
        bikechainNFTs = BikechainNFTs.deploy({"from": account})
    else:
        bikechainNFTs = BikechainNFTs[-1]
    create_nft_tx = bikechainNFTs.createNFT(account, set_token_uri(type), {"from": account})
    create_nft_tx.wait(1)
    print("NFT Created")


def main():
    # deploy_bikechain_nfts()
    create_nft("FIRST_ACTIVITY")
