import { useEffect, useState } from "react"
import ContractNFT from "../chain-info/deployments/map.json"
import BikechainNFTsContract from "../chain-info/contracts/BikechainNFTs.json"
import "../style.css";
import { Contract, ethers } from "ethers";

// Componente para renderizar los NFT que tiene el usuario (no se llama a createNFT)

const NFT = ({signer, provider}) => {
    const [contractNFT, setContractNFT] = useState(null);
    const [walletConnected, setWalletConnected] = useState(true);
    const [nftDisplay, setNFTDisplay] = useState(null);

    
    useEffect(() => {
        if(signer){
            const contractNFTAddress = ContractNFT[11155111].BikechainNFTs[0];
            const abi = BikechainNFTsContract.abi
            const contract  = new Contract(contractNFTAddress, abi, provider)
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
    
    async function displayNFT() {
        if (isConnected()){
            return;
        }
        const ownerNFTCounter = Number(await contractNFT.retrieveOwnerNFTCount(signer.address));
        console.log("ownerNFTCounter: ", ownerNFTCounter)
        if(ownerNFTCounter > 0) {
            for(let i = 0; i < ownerNFTCounter - 1; i++){
                // const nftUrl = await contractNFT.retrieveNFTUrl(ownerNFTCounter - 1);
                const nftUrl = await contractNFT.retrieveNFTUrl(i);
                const ownerNFTIdsArray = await contractNFT.retrieveOwnerNFTIdsArray();
                console.log("NFT nº: ", i, "URL: ", nftUrl + "" );
                // console.log("URL del ultimo nft creado: ", );
                // console.log("ownerNFTIdsArray: ", ownerNFTIdsArray);
                // Agregar un for por cada nft
                setNFTDisplay(<img src={nftUrl} alt="NFT"></img>);
            }
            

        }
    }


    // Renderizar NFTs del usuario


    return (
        <div id="div-display-nft">
            <button onClick={displayNFT}>Display NFTs</button>
            <div>{!walletConnected ? "Wallet is not connected" : ""}</div>
            <div>{nftDisplay}</div>
        </div>
    )
}

export default NFT