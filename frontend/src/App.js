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
        <div id="AppId">
            <title>Bikechain</title>
            <div id="divTituloBikechain">
                <h1 className="TituloAccount">Bikechain</h1>
            </div>
            <div id="header-div">
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