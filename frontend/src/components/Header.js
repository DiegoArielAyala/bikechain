import { ethers } from "ethers";
import { useState } from "react";
// import { Layout } from "antd";
// import Bikechain from "../chain-info/contracts/Bikechain.json" with { type: "json" };
// import map from "../chain-info/deployments/map.json" with { type: "json" }

// const Bikechain = await fetch("../chain-info/contracts/Bikechain.json").then(res => res.json());
// const map = await fetch("../chain-info/deployments/map.json").then(res=>res.json());


const Header = () => {
    console.log(window.ethereum); 
    /* const provider = new ethers.BrowserProvider(window.ethereum);
    console.log(provider)
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log(signer)
    // const BIKECHAIN_ADDRESS = map[11155111][Bikechain][-1]
    // console.log(BIKECHAIN_ADDRESS)
    */
   
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const connectWallet = async () => {
        if(!window.ethereum){
            console.log("MetaMask no esta instalado");
            return;
        }
        if (isConnecting){
            console.log("Ya hay una solicitud en proceso");
            return;
        }
        setIsConnecting(true);
        
        try {
            const providerInstance = new ethers.BrowserProvider(window.ethereum);
            await providerInstance.send("eth_requestAccounts", []);
            const signerInstance = await providerInstance.getSigner();

            setProvider(providerInstance);
            setSigner(signerInstance);

            console.log("Provider:", providerInstance);
            console.log("Signer:", signerInstance);
        } catch (error) {
            console.error("Error conectando la wallet:", error);
        } finally {
            setIsConnecting(false);
        }
    }

    return (
        <div title="Header"> 
                <button onClick={connectWallet} disabled={isConnecting}>{isConnecting ? "Conectando..." : "Conectar Wallet"}</button>
                <button onClick={() => {
                    console.log(window.ethereum)
                    console.log(provider)
                    console.log(signer)
                }} disabled={isConnecting}>Console.log</button>
                {signer && <p>Connected as: {signer.address}</p>}
        </div>
    )
}

export default Header;
