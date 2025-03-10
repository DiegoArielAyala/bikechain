import { useEffect, useState } from "react"
import { Contract } from "ethers";
import BikechainNFTs from "../chain-info/deployments/map.json"

// Componente para renderizar los NFT que tiene el usuario (no se llama a createNFT)

const NFT =  ({signer}) => {
    const [contractNFT, setContractNFT] = useState(null);
    console.log(signer)

    useEffect(() => {
        if(signer){
            setContractNFT(BikechainNFTs[11155111][-1])
        }
    },[signer])



    

    // Renderizar NFTs del usuario


    return (
        <div>
            Display NFTs
        </div>
    )
}

export default NFT