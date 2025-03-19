import { useEffect, useState } from "react"
import BikechainNFTs from "../chain-info/deployments/map.json"
import "../style.css";

// Componente para renderizar los NFT que tiene el usuario (no se llama a createNFT)

const NFT =  ({signer}) => {
    const [contractNFT, setContractNFT] = useState(null);

    useEffect(() => {
        if(signer){
            setContractNFT(BikechainNFTs[11155111][-1])
        }
    },[signer])

    
    function displayNFT() {
        console.log("contractNFT: ", contractNFT)
        console.log("BikechainNFTs[11155111][-1]: ", BikechainNFTs[-1])

    }

    

    // Renderizar NFTs del usuario


    return (
        <div id="div-display-nft">
            <button onClick={displayNFT}>Display NFTs</button>
            
        </div>
    )
}

export default NFT