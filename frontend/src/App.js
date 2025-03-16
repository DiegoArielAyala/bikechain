import "./style.css";
import { useState } from "react";
import Header from "./components/Header.js";
import Hero from "./components/Hero.js";
import NFT from "./components/NFT.js";

function App() {
    // Defino el estado de provider y signer
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    // Paso provider y signer a Header y Hero como props
    return (
        <div id="app-id">
            <title>Bikechain</title>
            <div id="header-div">
                <h1 id="h1-bikechain">Bikechain</h1>
                <Header provider={provider} setProvider={setProvider} signer={signer} setSigner={setSigner} />
            </div>
            <div id="hero-div">
                <Hero provider={provider} signer={signer} />
            </div>
            <div id="nft-div">
                <NFT signer={signer}/>
            </div>
        </div>
    )
}

export default App;