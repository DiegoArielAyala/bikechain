import { useEffect, useState } from "react"
import ContractNFT from "../chain-info/deployments/map.json"
import BikechainNFTsContract from "../chain-info/contracts/BikechainNFTs.json"
import "../style.css";
import { Contract } from "ethers";

// Componente para renderizar los NFT que tiene el usuario (no se llama a createNFT)

const NFT =  ({signer}) => {
    const [contractNFT, setContractNFT] = useState(null);
    const [walletConnected, setWalletConnected] = useState(true);

    useEffect(() => {
        if(signer){
            const contractNFTAddress = ContractNFT[11155111].BikechainNFTs[0];
            const abi = BikechainNFTsContract.abi
            const contract  = new Contract(contractNFTAddress, abi)
            setContractNFT(contract)
            setWalletConnected(true)
        }
    },[signer])

    function isConnected() {
        if(!signer){
            console.log("Wallet is not connected");
            setWalletConnected(false)
            return true;
        }
    }
    
    function displayNFT() {
        if (isConnected()){
            return;
        }
        console.log("contractNFT: ", contractNFT)
        console.log("ContractNFT[-1] ", ContractNFT[11155111].BikechainNFTs[0])

    }

    

    // Renderizar NFTs del usuario


    return (
        <div id="div-display-nft">
            <button onClick={displayNFT}>Display NFTs</button>
            <div>{!walletConnected ? "Wallet is not connected" : ""}</div>
        </div>
    )
}

export default NFT