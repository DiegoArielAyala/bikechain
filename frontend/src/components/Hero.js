import { Contract } from "ethers";
import { useState, useEffect } from "react";
import Contracts from "../chain-info/deployments/map.json";
import BikechainContract from "../chain-info/contracts/Bikechain.json"
import BikechainNFTsContract from "../chain-info/contracts/BikechainNFTs.json"

// Recibe provider y signer desde App.js
const Hero = ({ signer }) => {

    const [contract, setContract] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [ownerActivities, setOwnerActivities] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [renderActivities, setRenderActivities] = useState([]);
    const abi = BikechainContract.abi


    useEffect(() => {
        if (signer) {
            const contractAddress = Contracts[11155111].Bikechain[0];
            console.log("Contract Address: ", contractAddress);
            console.log("Contract: ", contract);
            console.log("Signer: ", signer);
            if (!contractAddress){
                console.log("Error: Contract not found");
                return;
            }
            const bikechain = new Contract(contractAddress, abi, signer);
            setContract(bikechain);
            setContractAddress(contractAddress);
        }
    }, [signer]);
    
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
    }

    const createNFT = async () => {

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

    const getFunction = async (name) => {
        if (isContractConnected() === false) return;
        abi.forEach(item => {
            if(item.name === name){
                console.log(item)
                return item;
            }
        });
        /*
        try {
            const retrieveActivities = await contract[name]();
            console.log(`Resultado  de ${name}`, retrieveActivities )
        } catch (error) {
            console.error(`Error ejecutando ${name}` ,error);
        }
            */
    }
    
    return (
        <div>
            Hero
            <button onClick={() => {retrieveOwnerActivities()}}>retrieveOwnerActivities</button>
            <button onClick={() => {retrieveAllActivities()}}>retrieveAllActivities</button>
            <button onClick={() => {getFunction("getLastActivityId")}}>View Last Activity Id</button>
            
            <form>
                <div className="divInputTime">
                    <label>Time</label>
                    <input className="inputHours" type="number" placeholder="Hours" ></input>
                    <input className="inputMinutes" type="number" placeholder="Minutes" min="0" max="59" required></input>
                    <input className="inputSeconds" type="number" placeholder="Seconds" min="0" max="59" required></input>
                </div>
                <div className="divInputDistance">
                    <label>Distance</label>
                    <input className="inputDistance" type="number" step="0.01" placeholder="Distance (Km)" min="0" required></input>
                </div>
                <div className="divInputAvgSpeed">
                    <label>Average Speed</label>
                    <input className="inputAvgSpeed" type="number" step="0.1" placeholder="Average Speed (Km/h)" min="0" required></input>
                </div>
                <button type="submit" onClick={(e) => {
                    e.preventDefault()
                    const hours = document.querySelector(".inputHours");
                    const minutes = document.querySelector(".inputMinutes");
                    const seconds = document.querySelector(".inputSeconds");
                    const time = (hours.value * 3600) + (minutes.value * 60) + Number(seconds.value)
                    const distance = document.querySelector(".inputDistance");
                    const avgSpeed = document.querySelector(".inputAvgSpeed");
                    createActivity(time, distance.value * 100, avgSpeed.value * 10);
                    [hours.value, minutes.value, seconds.value, distance.value, avgSpeed.value] = ["", "", "", "", ""];

                    }}>Create Activity</button>
            </form>

            <form>
                <input className="inputRemoveId" placeholder="Id"></input>
                <button type="submit" onClick={(e) => {
                    e.preventDefault();
                    const id = document.querySelector(".inputRemoveId").value;
                    removeActivity(id);
                }}>Remove Activity</button>
            </form>

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