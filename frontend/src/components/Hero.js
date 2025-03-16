import { Contract, Network } from "ethers";
import { useState, useEffect } from "react";
import Contracts from "../chain-info/deployments/map.json";
import BikechainContract from "../chain-info/contracts/Bikechain.json"
import BikechainNFTsContract from "../chain-info/contracts/BikechainNFTs.json"
import { createNFT } from "../createNFT.js"
import "../style.css";


// Recibe signer desde App.js
const Hero = ({ signer, provider }) => {

    const [contract, setContract] = useState(null);
    const [contractNFT, setContractNFT] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [contractNFTAddress, setContractNFTAddress] = useState(null);
    const [ownerActivities, setOwnerActivities] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [renderActivities, setRenderActivities] = useState([]);
    const [metadata, setMetadata] = useState(null);
    const abi = BikechainContract.abi
    const abiNFT = BikechainNFTsContract.abi


    useEffect(() => {
        if (signer) {
            const contractAddress = Contracts[11155111].Bikechain[0];
            const contractAddressNFT = Contracts[11155111].BikechainNFTs[0];
            console.log("contractAddress: ", contractAddress);
            console.log("contractAddressNFT: ", contractAddressNFT);
            if (!contractAddress){
                console.log("Error: Contract not found");
                return;
            }
            const bikechain = new Contract(contractAddress, abi, signer);
            const bikechainNFT = new Contract(contractAddressNFT, abiNFT, signer);
            setContract(bikechain);
            setContractNFT(bikechainNFT);
            setContractAddress(contractAddress);
            setContractNFTAddress(contractAddressNFT);
            /*
            fetch("http://127.0.0.1:8000/metadata")
                .then(response=>response.json())
                .then(data => setMetadata(data))
                .catch(error => console.error("Error: ", error));
                */
        }
    }, [signer, provider]);
    
    const isUserConnected = () => {
        if (!signer){
            console.log("User is not connected");
            return false;
        }
        return true;
    }

    const isContractConnected = () => {
        if (contract == null) {
            console.log("Contract is not connected");
            return false;
        }
    }

    const retrieveOwnerActivities = async () => {
        if (!isUserConnected()){
            return;
        }
        if(!contractAddress){
            console.error("Contract address not set yet");
            return;
        }
        try {
            //Verificar si la funcion retrieveActivities existe en la ABI
            if(!contract.retrieveOwnerActivities) {
                console.error("retrieveOwnerActivities no existe");
                return;
            }
            // Llamar a retrieveOwnerActivities 
            console.log("Calling retrieveOwnerActivities...")
            const [ids, times, distances, avgSpeeds] = await contract.retrieveOwnerActivities(signer.address);
            console.log(ids, times, distances, avgSpeeds);
            const activities = [];
            for (let i = 0; i < ids.length; i++) {
                const activity = [];
                activity.push(Number(ids[i]));
                activity.push(Number(times[i]));
                activity.push(Number(distances[i]));
                activity.push(Number(avgSpeeds[i]));
                activities.push(activity);
            }
            console.log("activities: ", activities);
            setOwnerActivities(activities);
            setRenderActivities(activities);
            return activities;

        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const createActivity = async (time, distance, avgSpeed) => {
        if (!isUserConnected()){
            return;
        }
        if (isContractConnected() === false) return;
        try {
            const tx = await contract.createActivity(time, distance, avgSpeed)
            await tx.wait();
            console.log("Activity created", tx);
        } catch (error) {
            console.error(error);
        }
        
        // Revisar si es la primera actividad que se sube
        const ownerActivitiesCount = await contract.retrieveActivitiesCounter();
        if(ownerActivitiesCount==2){
            const network = await provider.getNetwork()
            createNFT(contractNFT, signer, contractNFTAddress, network.name ) 
        }
    } 

    // Funcion momentanea de prueba de createNFT
    const callCreateMetadata = async () => {
        const network = await provider.getNetwork()
        console.log("provider.getNetwork():", network)
        createNFT(contractNFT, signer, contractNFTAddress, network.name );
    }


    const retrieveAllActivities = async () => {
        if (!isUserConnected()){
            return;
        }
        if (isContractConnected() === false) return;
        
        try {
            console.log("Retrieve all activities...")
            const [ids, times, distances, avgSpeeds] = await contract.retrieveAllActivities();
            const allActivities = [];
            for (let i = 0; i < ids.length; i++) {
                const activity = [];
                activity.push(Number(ids[i]));
                activity.push(Number(times[i]));
                activity.push(Number(distances[i]));
                activity.push(Number(avgSpeeds[i]));
                allActivities.push(activity);
            }
            console.log("allActivities: ", allActivities);
            setAllActivities(allActivities);
            setRenderActivities(allActivities);
        } catch (error) {
            console.error(error);
        }
        
    }

    const removeActivity = async (id) => {
        if (!isUserConnected()){
            return;
        }
        console.log("Removing activity: ", id)
        if(!contract.removeActivity){
            console.log("RemoveActivity does not exist");
        }
        const tx = await contract.removeActivity(id, {from: signer.address});
        tx.wait();
        console.log("Activity " + {id} + " removed")
    }

    // Funcion solo de prueba
    const getFunction = async (name) => {
        if (isContractConnected() === false) return;
        abi.forEach(item => {
            if(item.name === name){
                console.log(item)
                return item;
            }
        });
    }
    
    return (
        <div>
            
                <input type="file"></input>
            
            <form id="form-create-activity">
                <div className="div-input-duration">
                    <h3 id="h3-create-activity">Create New Activity</h3>
                    <label>Duration</label>
                    <input className="input-hours" type="number" ></input>
                    <input className="input-minutes" type="number" min="0" max="59" required></input>
                    <input className="input-seconds" type="number" min="0" max="59" required></input>
                    <span>H:MM:SS</span>
                </div>

                <div className="div-input-distance">
                    <label>Distance</label>
                    <input className="input-distance" type="number" step="0.01" placeholder="Distance (Km)" min="0" required></input>
                </div>
                <div className="div-input-avg-speed">
                    <label>Average Speed</label>
                    <input className="input-avg-speed" type="number" step="0.1" placeholder="Average Speed (Km/h)" min="0" required></input>
                </div>
                <button id="button-create-activity" type="submit" onClick={(e) => {
                    e.preventDefault()
                    const hours = document.querySelector(".input-hours");
                    const minutes = document.querySelector(".input-minutes");
                    const seconds = document.querySelector(".input-seconds");
                    const time = (hours.value * 3600) + (minutes.value * 60) + Number(seconds.value)
                    const distance = document.querySelector(".input-distance");
                    const avgSpeed = document.querySelector(".input-avg-speed");
                    createActivity(time, distance.value * 100, avgSpeed.value * 10);
                    [hours.value, minutes.value, seconds.value, distance.value, avgSpeed.value] = ["", "", "", "", ""];

                    }}>Create Activity</button>
            </form>

            <form id="form-remove-activity">
                <h3>Remove Activity</h3>
                <label>Select activity Id</label>
                <input className="input-remove-id"></input>
                <button type="submit" onClick={(e) => {
                    e.preventDefault();
                    const id = document.querySelector(".input-remove-id").value;
                    removeActivity(id);
                }}>Remove Activity</button>
            </form>

            <div id="hero-buttons-div">
                <button onClick={() => {retrieveOwnerActivities()}}>retrieveOwnerActivities</button>
                <button onClick={() => {retrieveAllActivities()}}>retrieveAllActivities</button>
                <button onClick={() => {getFunction("getLastActivityId")}}>View Last Activity Id</button>
                <button onClick={() => {callCreateMetadata()}}>Create Metadata</button>
            </div>

            <div>
                <h3>Activities</h3>
                {Array.isArray(renderActivities) && renderActivities.length > 0 ? (
                    renderActivities.map((activity, idx) => (
                        <div key={idx} className="activity">
                            <ul>
                                <li> ID: {activity[0]} </li>
                                <li> Time: {Math.floor(activity[1] / 3600)}:{(Math.floor((activity[1] - (Math.floor(activity[1] / 3600)) * 3600)/60)) === 0 ? "00" : (Math.floor((activity[1] - (Math.floor(activity[1] / 3600)) * 3600)/60))}:{(activity[1] % 3600) === 0 ? "00" : (activity[1] % 3600 % 60) }  </li>
                                <li> Distance: {activity[2] / 100} Km </li>
                                <li> AvgSpeed: {activity[3] / 10} Km/h</li>
                            </ul>
                        </div>
                    ))
                ) : "" }
            </div>
        </div>
    )
}

export default Hero