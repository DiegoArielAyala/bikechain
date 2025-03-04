from metadata.metadata_template import metadata_template
from scripts.set_tokenURI import NFT_IPFS_URL
from scripts.helpful_scripts import nft_type_mapping
from brownie import network, BikechainNFTs
from pathlib import Path
import os
import json
import requests

nft_to_image_uri = {"FIRST_ACTIVITY": ""}


def main():
    # Funcion que obtenga el token_id de cada nft creado, revise en la carpeta metadata si existe la metadata de ese nft, en el caso que no exista, la crea. A traves de mapping, obtiene que tipo de nft es y le asigna la metadata correspondiente

    metadata = metadata_template

    bikechain = BikechainNFTs[-1]
    for token_id in range(bikechain.ntfIdsCounter()):
        nft_type = nft_type_mapping[bikechain.getTokenIdType(token_id)]
        metadata_file_name = (
            f"./metadata/{network.show_active()}/{token_id}-{nft_type}.json"
        )
        if Path(metadata_file_name).exists():
            print(f"{metadata_file_name} already exist. Delete it to override")
        else:
            metadata["name"] = f"{token_id}_{nft_type}"
            metadata["description"] = "NFT reward for first activity upload"
            print(metadata)
            image_path = "./img/" + nft_type.lower() + ".webp"
            image_uri = None
            if os.getenv("UPLOAD_TO_IPFS") == "true":
                image_uri = upload_to_ipfs(image_path)
            image_uri = image_uri if image_uri else nft_to_image_uri[nft_type]
            metadata["image"] = image_uri
            with open(metadata_file_name, "w") as file:
                json.dump(metadata, file)
            if os.getenv("UPLOAD_TO_IPFS") == "true":
                upload_to_ipfs(metadata_file_name)


def upload_to_ipfs(path):
    with Path(path).open("rb") as fp:
        image_binary = fp.read()
        ipfs_url = "http://127.0.0.1:5001"
        endpoint = "/api/v0/add"
        response = requests.post(ipfs_url + endpoint, files={"file": image_binary})
        ipfs_hash = response.json()["Hash"]
        filename = path.split("/")[-1:][0]
        image_uri = f"https://ipfs.io/ipfs/{ipfs_hash}?filename={filename}"
        print(image_uri)
        return image_uri
