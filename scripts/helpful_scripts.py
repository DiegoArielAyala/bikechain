from brownie import network, config, accounts
import shutil
import os
import yaml
import json

LOCAL_BLOCKCHAIN_ENVIRONMENT = ["development", "main-fork-dev", "main-fork"]
OPENSEA_URL = "https://testnets.opensea.io/assets/{}/{}"

nft_type_mapping = {
    0: "FIRST_ACTIVITY"
}

def get_account(id=None, index=None):
    if index:
        return accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENT:
        print(f"This is accounts from getAccount(): {accounts[0]}")
        return accounts[0]
    if id:
        return accounts.load(id)
    return accounts.add(config["wallets"]["from_key"])


def remove_metadata(dest):
    if os.path.exists(dest):
        for file in os.listdir(dest):
            file_path = os.path.join(dest, file)
            if os.path.isfile(file_path):
                os.remove(file_path)
                print("Archivo eliminado: ", file_path)

def copy_folders_to_frontend(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)

def copy_archives_to_frontend(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copy(src, dest)

def update_frontend():
    # Agregar funcion para borrar el contenido de la carpeta metadata/sepolia y metadata (En el front y en el back)
    print("Updating to frontend...")
    copy_folders_to_frontend("./build", "./frontend/src/chain-info")
    remove_metadata("./frontend/public/metadata")
    remove_metadata("./metadata/sepolia")
    with open("./brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.safe_load(brownie_config)
        with open("./frontend/src/brownie-config.json", "w") as frontend_brownie_config:
            json.dump(config_dict, frontend_brownie_config)
    with open("./metadata/metadata_template.py", "r") as metadata_template:
        metadata_code = metadata_template.read()
        metadata_dic = {}
        exec(metadata_code, metadata_dic)
        with open("./frontend/public/metadata_template.json", "w") as metadata_template_json:
            json.dump(metadata_dic['metadata_template'], metadata_template_json)