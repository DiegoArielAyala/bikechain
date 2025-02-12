from brownie import network, config, accounts

LOCAL_BLOCKCHAIN_ENVIRONMENT = ["development", "main-fork-dev", "main-fork"]


def getAccount(id=None, index=None):
    account = None
    if index:
        account = accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENT:
        account = accounts[0]

    return account
