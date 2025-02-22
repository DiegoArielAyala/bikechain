import "./style.css";
import { useState } from "react";
import Header from "./components/Header.js";
import Hero from "./components/Hero.js";

function App() {
    // Defino el estado de provider y signer
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    // Paso provider y signer a Header y Hero como props
    return (
        <div>
            <title>Bikechain</title>
            <h1 className="TituloAccount">Bikechain</h1>
            <div>
                <Header provider={provider} setProvider={setProvider} signer={signer} setSigner={setSigner} />
                <Hero provider={provider} signer={signer} />
            </div>
        </div>
    )
}

export default App;