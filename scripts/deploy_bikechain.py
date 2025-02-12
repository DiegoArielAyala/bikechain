from brownie import Bikechain
from helpful_scripts import getAccount

def deploy_bikechain():
    account = getAccount()
    bikechain = Bikechain.deploy({"from": account})