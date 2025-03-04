from metadata.metadata_template import metadata_template
from scripts.set_tokenURI import NFT_IPFS_URL
from scripts.helpful_scripts import nft_type_mapping
from brownie import network, BikechainNFTs
from pathlib import Path


def main():
    # Funcion que obtenga el token_id de cada nft creado, revise en la carpeta metadata si existe la metadata de ese nft, en el caso que no exista, la crea. A traves de mapping, obtiene que tipo de nft es y le asigna la metadata correspondiente
    
    

    bikechain = BikechainNFTs[-1]
    for token_id in range(bikechain.ntfIdsCounter()):
        nft_type = nft_type_mapping[bikechain.getTokenIdType(token_id)]
        metadata_file_name = (f"./metadata/{network.show_active()}/{token_id}-{nft_type}.json")
        if Path(metadata_file_name).exists():
            print(f"{metadata_file_name} already exist. Delete it to override")
        else:
            metadata = metadata_template
            metadata["name"] = f"{token_id}_{nft_type}"
            metadata["image"] = NFT_IPFS_URL[nft_type]
            metadata["description"] = "NFT reward for first activity upload"
            print(metadata)


def upload_to_ipfs(path):
    pass
