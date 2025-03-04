from brownie import network, config, accounts
import shutil
import os
import yaml
import json

LOCAL_BLOCKCHAIN_ENVIRONMENT = ["development", "main-fork-dev", "main-fork"]
OPENSEA_URL = "https://testnets.opensea.io/assets/{}/{}"


def get_account(id=None, index=None):
    if index:
        return accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENT:
        print(f"This is accounts from getAccount(): {accounts[0]}")
        return accounts[0]
    if id:
        return accounts.load(id)
    return accounts.add(config["wallets"]["from_key"])


def copy_folders_to_frontend(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def update_frontend():
    copy_folders_to_frontend("./build", "./frontend/src/chain-info")
    with open("./brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.safe_load(brownie_config)
        with open("./frontend/src/brownie-config.json", "w") as frontend_brownie_config:
            json.dump(config_dict, frontend_brownie_config)
