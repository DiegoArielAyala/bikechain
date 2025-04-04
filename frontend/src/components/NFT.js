import { useEffect, useState } from "react"
import ContractNFT from "../chain-info/deployments/map.json"
import BikechainNFTsContract from "../chain-info/contracts/BikechainNFTs.json"
import "../style.css";
import { Contract } from "ethers";

// Componente para renderizar los NFT que tiene el usuario (no se llama a createNFT)

const NFT = ({signer, provider}) => {
    const [contractNFT, setContractNFT] = useState(null);
    const [walletConnected, setWalletConnected] = useState(true);
    const [nftDisplay, setNFTDisplay] = useState(null);
    const [noHaveNFT, setNoHaveNFT] = useState(false);

    
    useEffect(() => {
        if(signer){
            const contractNFTAddress = ContractNFT[11155111].BikechainNFTs[0];
            const abi = BikechainNFTsContract.abi
            const contract  = new Contract(contractNFTAddress, abi, provider)
            setContractNFT(contract);
            setWalletConnected(true);
            setNFTDisplay(null);
            setNoHaveNFT(false);
        }
    },[signer, provider])

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
        const totalNFTCreated = Number(await contractNFT.retrieveNFTIdsCounter());
        const ownerNFTCounter = Number(await contractNFT.retrieveOwnerNFTCount(signer.address));
        console.log("ownerNFTCounter: ", ownerNFTCounter)
        if(ownerNFTCounter > 0) {
            const NFTImages = [];
            for(let i = 0; i < totalNFTCreated - 1; i++){
                if(await contractNFT.getTokenIdOwner(i) === signer.address){
                    const nftUrl = await contractNFT.retrieveNFTUrl(i);
                    NFTImages.push(<img key={i} src={nftUrl} alt="NFT"></img>);
                }
                //Buscar los id de los nft que tiene el owner
                //Guardalos en un array
                //Buscar el Url de la imagen correspondiente en el mapping idToImageUrl
                //Renderizar todas las imagenes

                // const nftUrl = await contractNFT.retrieveNFTUrl(ownerNFTCounter - 1);
                // console.log("URL del ultimo nft creado: ", );
                // console.log("ownerNFTIdsArray: ", ownerNFTIdsArray);
                // Agregar un for por cada nft
            }
            console.log(NFTImages)
            setNFTDisplay(NFTImages)
            return;
        }
        setNoHaveNFT(true);
        return;
    }


    // Renderizar NFTs del usuario


    return (
        <div>
            <h3>NFTs</h3>
            <div id="div-display-nft">
                <button id="button-nft" onClick={displayNFT}>View My NFTs</button>
                <div>{!walletConnected ? "Wallet is not connected." : noHaveNFT ? "You don`t have any NFTs yet" : ""}</div>
                <div id="div-nft-images">{nftDisplay}</div>
            </div>
        </div>
    )
}

export default NFT