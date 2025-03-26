import "./style.css";
import { useState } from "react";
import Header from "./components/Header.js";
import Hero from "./components/Hero.js";
import NFT from "./components/NFT.js";

function App() {
    // Defino el estado de provider y signer
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [userNotConnected, setUserNotConnected] = useState(false)
    const [linkNFT, setLinkNFT] = useState(null)
    

    // Paso provider y signer a Header y Hero como props
    return (
        <div id="app-id">
            <title>Bikechain</title>
            <div id="header-div">
                <div id="div-h">
                    <h1 id="h1-bikechain">Bikechain </h1>
                    <h3 id="h3-legend">Store your workouts on the blockchain</h3>
                </div>
                <Header provider={provider} setProvider={setProvider} signer={signer} setSigner={setSigner} userNotConnected={userNotConnected} setUserNotConnected={setUserNotConnected} />
            </div>
            <div id="hero-div">
                <Hero provider={provider} signer={signer} setUserNotConnected={setUserNotConnected} userNotConnected={userNotConnected} setLinkNFT={setLinkNFT}/>
            </div>
            <div id="nft-div">
                <NFT signer={signer} provider={provider} linkNFT={linkNFT}/>
            </div>
        </div>
    )
}

export default App;