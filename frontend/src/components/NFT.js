import { useEffect, useState } from "react"
import { ethers } from "ethers";
import BikechainNFTs from "../chain-info/deployments/map.json"

const NFT =  ({signer}) => {
    const [contractNFT, setContractNFT] = useState(null);
    console.log(signer)

    useEffect(() => {
        if(signer){
            setContractNFT(BikechainNFTs[11155111][-1])
        }
    },[signer])
    console.log(contractNFT)

    // Revisar si es la primera actividad que se sube

    // Crear NFT

    const createNFT = async () => {
        const createNFTTx = await contractNFT.createNFT({from:signer.address});
        createNFTTx.wait()
        console.log("NFT Created")
    }

    // Renderizar NFTs del usuario


    return (
        <div>
            Display NFTs
        </div>
    )
}

export default NFT