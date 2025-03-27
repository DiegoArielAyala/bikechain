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
const Hero = ({ signer, provider, setUserNotConnected }) => {

    const [contract, setContract] = useState(null);
    const [contractNFT, setContractNFT] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [contractNFTAddress, setContractNFTAddress] = useState(null);
    const [renderActivities, setRenderActivities] = useState([]);
    const [creatingActivity, setCreatingActivity] = useState(false);
    const [activityCreated, setActivityCreated] = useState(false);
    const [showNoActivities, setShowNoActivities ] = useState(false);
    const [deletingActivity, setDeletingActivity] = useState(false);
    const [deletedActivity, setDeletedActivity] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorCreating, setErrorCreating] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

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
            setDeleteError(false);
            setErrorCreating(false);
            setErrors({});
            setDeletedActivity(false);
            setDeletingActivity(false);
            setShowNoActivities(false);
            setActivityCreated(false);
            setCreatingActivity(false);
            setRenderActivities([]);
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
            const ownerActivitiesCount = Number(await contract.retrieveActivitiesCounter());
            console.log("ownerActivitiesCount ", ownerActivitiesCount)
            // Corregir el if === 1
            if(ownerActivitiesCount === 4){
                try {
                    console.log("Creando nft");
                    const network = await provider.getNetwork()
                    const linkNFT = await createNFT(contractNFT, signer, contractNFTAddress, network.name ) 
                    console.log(linkNFT);
                }catch(error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.error(error);
            setCreatingActivity(false);
            setErrorCreating(true)
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
        if (Number(activityCounter)  === 0){
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
            setRenderActivities(activities);
            return activities;

        } catch (error) {
            console.error("Error: ", error);
        }
    }
    
    /*
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
            setRenderActivities(allActivities);
        } catch (error) {
            console.error(error);
        }
        
    }
    */

    const deleteActivity = async (id) => {
        setDeleteError(false);
        setDeletedActivity(false);
        if (!isUserConnected()){
            return;
        }
        console.log("Deleting activity: ", id);
        if(!contract.deleteActivity){
            console.log("DeleteActivity does not exist");
        }
        const deletedActivitiesIds = await contract.retrieveDeletedActivitiesIds();
        const activitiesCount = await contract.retrieveActivitiesCount();
        if(deletedActivitiesIds.includes(id) || id > activitiesCount){
            console.log("La actividad que se quiere eliminar no existe");
            return;
        }
        try {
            setDeletingActivity(true);
            const tx = await contract.deleteActivity(id, {from: signer.address});
            tx.wait();
            console.log("Activity " + {id} + " deleted");
            setDeletingActivity(false);
            setDeletedActivity(true);
            document.querySelector(".input-delete-id").value = null;
        }catch(error){
            setDeleteError(true);
            setDeletingActivity(false);
            console.log(error);
        }
    }
    

    const validarDatos = async (e) => {
        e.preventDefault();
        setErrors({})

        let hours = parseInt(document.querySelector(".input-hours").value || 0);
        let minutes = parseInt(document.querySelector(".input-minutes").value || 0);
        let seconds = parseInt(document.querySelector(".input-seconds").value || 0);
        let distance = parseFloat(document.querySelector(".input-distance").value);
        let avgSpeed = parseFloat(document.querySelector(".input-avg-speed").value);
        
        const totalTime = hours * 3600 + minutes * 60 + seconds;
        
        const newErrors = {};
        if (minutes < 0 || minutes > 59) newErrors.minutes = "Minutes must be between 0 and 59.";
        if (seconds < 0 || seconds > 59) newErrors.seconds = "Seconds must be between 0 and 59.";
        if (totalTime <= 0) newErrors.totalTime = "Duration must be greater than 0.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await createActivity(totalTime, Math.round(distance * 100), Math.round(avgSpeed * 10));
            if(activityCreated){
                [hours, minutes, seconds, distance, avgSpeed] = ["", "", "", "", ""];
            }
        } catch (error) {
            console.error("Error creating activity: ", error);
            setErrors({ general: "An error occurred. Please check your input."});
            
        }
    }

    return (
        <div>            
            <form id="form-create-activity" onSubmit={validarDatos}>
                <div className="div-input-duration">
                    <h3 id="h3-create-activity">Create New Activity</h3>
                    <label>Duration</label>
                    <input className="input-hours" type="number" min={0} ></input>
                    {errors.hours && <span className="error-message">{errors.hours}</span>}
                    <input className="input-minutes" type="number" min="0" max="59" required  ></input>
                    {errors.minutes && <span className="error-message">{errors.minutes}</span>}
                    <input className="input-seconds" type="number" min="0" max="59" required ></input>
                    {errors.seconds && <span className="error-message">{errors.seconds}</span>}
                    <span>H:MM:SS</span>
                    {errors.totalTime && <p className="error-message">{errors.totalTime}</p>}
                    {errors.general && <p className="error-message">{errors.general}</p>}
                </div>

                <div className="div-input-distance">
                    <label>Distance</label>
                    <input className="input-distance" type="number" step="0.01" min="0.01" required ></input>
                    <span>Km</span>
                </div>
                <div className="div-input-avg-speed">
                    <label>Average Speed</label>
                    <input className="input-avg-speed" type="number" step="0.1" min="0.1" required ></input>
                    <span>Km/h</span>
                </div>
                <div id="div-create-activity">
                    <button id="button-create-activity" disabled={creatingActivity} type="submit">{creatingActivity ? "Creating Activity..." : "Create Activity"}</button>

                    <div id="div-activity-created"> {creatingActivity ? "Get an NFT with your first activity!" :  activityCreated ? "Activity created!" : errorCreating ? "Error creating activity, rewrite your inputs and try again." : "Get an NFT with your first activity!"} </div>
                </div>
            </form>

            <form id="form-delete-activity">
                <h3>Delete Activity</h3>
                <label>Select activity Id:</label>
                <input className="input-delete-id" type="number" required ></input>
                <button id="button-delete-activity" type="submit" onClick={(e) => {
                    e.preventDefault();
                    const id = document.querySelector(".input-delete-id").value;
                    deleteActivity(id);
                }}> { deletingActivity ? "Deleting Activity" : "Delete Activity" }</button>
                <div id="div-delete-message">{deletedActivity ? "Activity Deleted" : deleteError ? "Can't delete this activity" : ""}</div>
            </form>

            <h3>Activities</h3>
            <div id="hero-buttons-div">
                <button onClick={() => {retrieveOwnerActivities()}}>View My Activities</button>
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
                                <p>{hours}:{minutes >= 0 && minutes <= 9 ? "0"+ minutes : minutes}:{seconds >= 0 && seconds <= 9 ? "0"+seconds : seconds }</p>
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
                ) : showNoActivities ? "No activities registered." : "" }
            </div>
        </div>
    )
}

export default Hero