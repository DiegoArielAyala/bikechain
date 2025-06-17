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
            <Header provider={provider} setProvider={setProvider} signer={signer} setSigner={setSigner} userNotConnected={userNotConnected} setUserNotConnected={setUserNotConnected} />

            <main>
                <section className="hero-section">
                    <Hero provider={provider} signer={signer} setUserNotConnected={setUserNotConnected} userNotConnected={userNotConnected} setLinkNFT={setLinkNFT}/>
                </section>

                <section className="nft-section">
                    <NFT signer={signer} provider={provider} linkNFT={linkNFT}/>
                </section>
            </main>
        </div>
    )
}

export default App;