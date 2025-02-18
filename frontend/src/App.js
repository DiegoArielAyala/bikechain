import "./style.css";
import Header from "./components/Header.js";

function App() {
    return (
        <div>
            <title>Bikechain</title>
            <h1 className="TituloAccount">Account</h1>
            <p className="Address">Address</p>
            <h2 className="TituloActivities">Activities</h2>
            <p className="OwnerActivities">Owner Activities</p>
            <div>
                <button className="ButtonConnect">Connect Wallet</button>
            </div>
            <div>
                <Header />
            </div>
        </div>
    )
}

export default App;