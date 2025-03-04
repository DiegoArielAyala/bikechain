from metadata.metadata_template import metadata_template
from scripts.set_tokenURI import NFT_IPFS_URL
from brownie import network
from pathlib import Path


def main():
    # Funcion que obtenga el token_id de cada nft creado, revise en la carpeta metadata si existe la metadata de ese nft, en el caso que no exista, la crea. A traves de mapping, obtiene que tipo de nft es y le asigna la metadata correspondiente
    metadata = metadata_template
    metadata["name"] = "FIRST_ACTIVITY"
    metadata["img"] = NFT_IPFS_URL[metadata["name"]]
    metadata["description"] = "NFT reward for first activity upload"
    print(metadata)
    metadata_file_name = f"./metadata/{network.show_active()}/{metadata['name']}.json"
    if Path(metadata_file_name).exists:
        print(f"{metadata_file_name} already exist. Delete it to override")
    else:
        pass


def upload_to_ipfs(path):
    pass
