import { Contract } from "ethers";
import { useState, useEffect } from "react";
import Contracts from "../chain-info/deployments/map.json";
import BikechainContract from "../chain-info/contracts/Bikechain.json"
import BikechainNFTsContract from "../chain-info/contracts/BikechainNFTs.json"
import { createNFT } from "../createNFT.js"
import "../style.css";


const abi = BikechainContract.abi
const abiNFT = BikechainNFTsContract.abi

// Recibe signer desde App.js
const Hero = ({ signer, provider, setUserNotConnected, userNotConnected }) => {

    const [contract, setContract] = useState(null);
    const [contractNFT, setContractNFT] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [contractNFTAddress, setContractNFTAddress] = useState(null);
    const [ownerActivities, setOwnerActivities] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [renderActivities, setRenderActivities] = useState([]);
    const [creatingActivity, setCreatingActivity] = useState(false)
    const [activityCreated, setActivityCreated] = useState(false)
    const [showNoActivities, setShowNoActivities ] = useState(false)
    
    


    useEffect(() => {
        if (signer) {
            const contractAddress = Contracts[11155111].Bikechain[0];
            const contractAddressNFT = Contracts[11155111].BikechainNFTs[0];
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

        }
    }, [signer]);
    
    const isUserConnected = () => {
        if (!signer){
            console.log("User is not connected");
            setUserNotConnected(true)
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

    const createActivity = async (time, distance, avgSpeed) => {
        if (!isUserConnected()){
            return;
        }
        if (isContractConnected() === false) return;
        try {
            setCreatingActivity(true);
            const tx = await contract.createActivity(time, distance, avgSpeed);
            await tx.wait();
            console.log("Activity created", tx);
            setCreatingActivity(false);
            setActivityCreated(true)
            // Revisar si es la primera actividad que se sube
            console.log("Revisando si es primera actividad")
            const ownerActivitiesCount = await contract.retrieveActivitiesCounter();
            console.log("ownerActivitiesCount ", ownerActivitiesCount)
            // Corregir el if === 1
            if(ownerActivitiesCount < 50){
                console.log("Creando nft");
                const network = await provider.getNetwork()
                const linkNFT = await createNFT(contractNFT, signer, contractNFTAddress, network.name ) 
                console.log(linkNFT);
            }
        } catch (error) {
            console.error(error);
            setCreatingActivity(false);
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
        const activityCounter = await contract.retrieveActivitiesCounter()
        if (Number(activityCounter)  == 0){
            console.log("No hay actividades");
            setShowNoActivities(true)
            return (<di>No hay actividades</di>);
        }
        try {
            //Verificar si la funcion retrieveActivities existe en la ABI
            if(!contract.retrieveOwnerActivities) {
                console.error("retrieveOwnerActivities no existe");
                return;
            }
            // Llamar a retrieveOwnerActivities 
            setShowNoActivities(false)
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
                    <input className="input-hours" type="number" required ></input>
                    <input className="input-minutes" type="number" min="0" max="59" required></input>
                    <input className="input-seconds" type="number" min="0" max="59" required></input>
                    <span>H:MM:SS</span>
                </div>

                <div className="div-input-distance">
                    <label>Distance</label>
                    <input className="input-distance" type="number" step="0.01" min="0.01" required></input>
                    <span>Km</span>
                </div>
                <div className="div-input-avg-speed">
                    <label>Average Speed</label>
                    <input className="input-avg-speed" type="number" step="0.1" min="0.1" required></input>
                    <span>Km/h</span>
                </div>
                <div id="div-create-activity">
                    <button id="button-create-activity" disabled={creatingActivity} type="submit" onClick={(e) => {
                        e.preventDefault()
                        const hours = document.querySelector(".input-hours");
                        const minutes = document.querySelector(".input-minutes");
                        const seconds = document.querySelector(".input-seconds");
                        const time = (hours.value * 3600) + (minutes.value * 60) + Number(seconds.value)
                        const distance = document.querySelector(".input-distance");
                        const avgSpeed = document.querySelector(".input-avg-speed");
                        createActivity(time, distance.value * 100, avgSpeed.value * 10);
                        [hours.value, minutes.value, seconds.value, distance.value, avgSpeed.value] = ["", "", "", "", ""];

                    }}>{creatingActivity ? "Creating Activity" : "Create Activity"}</button>
                    
                    <div id="div-activity-created"> {() => {if(createActivity){return "Activity Created!"}}} </div>
                </div>
            </form>

            <form id="form-remove-activity">
                <h3>Remove Activity</h3>
                <label>Select activity Id</label>
                <input className="input-remove-id"></input>
                <button id="button-remove-activity" type="submit" onClick={(e) => {
                    e.preventDefault();
                    const id = document.querySelector(".input-remove-id").value;
                    removeActivity(id);
                }}>Remove Activity</button>
            </form>

            <h3>Activities</h3>
            <div id="hero-buttons-div">
                <button onClick={() => {retrieveOwnerActivities()}}>View My Activities</button>
                <button onClick={() => {retrieveAllActivities()}}>View All Activities</button>
            </div>

            <div id="div-show-activities">
                {Array.isArray(renderActivities) && renderActivities.length > 0 ? (
                    renderActivities.map((activity, idx) => {
                        const hours = Math.floor(activity[1] / 3600);
                        const minutes = Math.floor((activity[1] - (hours) * 3600)/60);
                        const seconds = activity[1] % 3600 % 60;
                        return (
                        <div key={idx} className="div-activity">
                            <div className="div-activity-info">
                                <p>{activity[0]}</p>
                                <p className="p-data">ID</p>
                            </div>
                            <div className="div-activity-info">
                                <p>{hours}:{minutes >= 0 && minutes <= 9 ? "0"+minutes : minutes}:{seconds >= 0 && seconds <= 9 ? "0"+seconds : seconds }</p>
                                <p className="p-data">TIME</p>
                            </div>
                            <div className="div-activity-info">
                                <p>{activity[2] / 100} Km</p>
                                <p className="p-data">DISTANCE</p>
                            </div>
                            <div className="div-activity-info">
                                <p>{activity[3] / 10} Km/h</p>
                                <p className="p-data">AVG SPEED</p>
                            </div>
                            
                        </div>
                    )})
                ) : showNoActivities ? "No activities registered" : "" }
            </div>
        </div>
    )
}

export default Hero