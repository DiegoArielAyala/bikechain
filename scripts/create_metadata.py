from metadata.metadata_template import metadata_template
from scripts.helpful_scripts import nft_type_mapping
from brownie import network, BikechainNFTs
from pathlib import Path
from dotenv import load_dotenv
import os
import json
import requests

load_dotenv()

nft_to_image_uri = {
    "FIRST_ACTIVITY": "https://ipfs.io/ipfs/QmYmsKFN9p9bKzHEHAr7asn2Sv1FamSiNkBR2N1teMyozt?filename=first_activity.webp"
}

headers = {
    "pinata_api_key": os.getenv("PINATA_API_KEY"),
    "pinata_secret_api_key": os.getenv("PINATA_API_SECRET"),
}


def create_metadata():
    # Funcion que obtenga el token_id de cada nft creado, revise en la carpeta metadata si existe la metadata de ese nft, en el caso que no exista, la crea. A traves de mapping, obtiene que tipo de nft es y le asigna la metadata correspondiente

    metadata = metadata_template
    metadata_dir = f"./metadata/{network.show_active()}"
    os.makedirs(metadata_dir, exist_ok=True)
    token_uri = None

    bikechain = BikechainNFTs[-1]
    for token_id in range(bikechain.ntfIdsCounter()):
        nft_type = nft_type_mapping[bikechain.getTokenIdType(token_id)]
        metadata_file_name = (
            f"./metadata/{network.show_active()}/{token_id}-{nft_type}.json"
        )
        if Path(metadata_file_name).exists():
            print(f"{metadata_file_name} already exist. Delete it to override")
        else:
            image_path = "./img/" + nft_type.lower() + ".webp"
            image_uri = None
            if os.getenv("UPLOAD_TO_IPFS") == "true":
                image_uri = upload_to_ipfs(image_path)
            image_uri = image_uri if image_uri else nft_to_image_uri[nft_type]
            metadata["image"] = image_uri
            metadata["name"] = f"{token_id}_{nft_type}"
            metadata["description"] = "NFT reward for first activity upload"
            print(metadata)
            with open(metadata_file_name, "w") as file:
                json.dump(metadata, file)
            if os.getenv("UPLOAD_TO_IPFS") == "true":
                token_uri = upload_to_ipfs(metadata_file_name)
            print("token_uri: ", token_uri)
    return token_uri


def upload_to_ipfs(path):
    with Path(path).open("rb") as fp:
        image_binary = fp.read()
        response = requests.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            files={"file": image_binary},
            headers=headers,
        )
        ipfs_hash = response.json()["IpfsHash"]
        filename = path.split("/")[-1:][0]
        image_uri = f"https://ipfs.io/ipfs/{ipfs_hash}?filename={filename}"
        print(response.json())
        return image_uri

def main():
    create_metadata()